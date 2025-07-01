import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

interface ErrorEvent {
  id: string
  timestamp: string
  message: string
  stack?: string
  url: string
  userAgent: string
  userId?: string
  sessionId: string
  level: 'error' | 'warning' | 'info'
  context?: Record<string, any>
  tags?: string[]
  fingerprint?: string
}

interface ErrorBatch {
  errors: ErrorEvent[]
  sessionId: string
  userId?: string
  timestamp: string
}

// In production, you would store these in a database or send to a monitoring service
const errorStore: ErrorEvent[] = []

export async function POST(request: NextRequest) {
  try {
    const headersList = headers()
    const userAgent = headersList.get('user-agent') || 'unknown'
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

    const body: ErrorBatch = await request.json()

    // Validate the request
    if (!body.errors || !Array.isArray(body.errors)) {
      return NextResponse.json(
        { error: 'Invalid request: errors array is required' },
        { status: 400 }
      )
    }

    // Process each error
    for (const error of body.errors) {
      // Add server-side metadata
      const enrichedError: ErrorEvent = {
        ...error,
        userAgent: error.userAgent || userAgent,
        context: {
          ...error.context,
          ip,
          serverTimestamp: new Date().toISOString(),
        },
      }

      // Store the error (in production, save to database)
      errorStore.push(enrichedError)

      // Log critical errors
      if (error.level === 'error') {
        console.error('Client Error:', {
          message: error.message,
          stack: error.stack,
          url: error.url,
          userId: error.userId,
          sessionId: error.sessionId,
          context: error.context,
        })
      }

      // In production, you might want to:
      // 1. Save to database
      // 2. Send to external monitoring service (Sentry, LogRocket, etc.)
      // 3. Send alerts for critical errors
      // 4. Update error metrics/dashboards

      // Example: Send to external service
      if (process.env.NODE_ENV === 'production') {
        await sendToMonitoringService(enrichedError)
      }
    }

    // Return success response
    return NextResponse.json({
      success: true,
      processed: body.errors.length,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('Error processing error batch:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get error statistics (for admin dashboard)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeframe = searchParams.get('timeframe') || '24h'
    const level = searchParams.get('level')

    // Calculate time range
    const now = new Date()
    const timeRanges = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
    }

    const timeRange = timeRanges[timeframe as keyof typeof timeRanges] || timeRanges['24h']
    const startTime = new Date(now.getTime() - timeRange)

    // Filter errors
    let filteredErrors = errorStore.filter(error => {
      const errorTime = new Date(error.timestamp)
      return errorTime >= startTime
    })

    if (level) {
      filteredErrors = filteredErrors.filter(error => error.level === level)
    }

    // Group errors by fingerprint
    const groupedErrors = filteredErrors.reduce((groups, error) => {
      const key = error.fingerprint || 'unknown'
      if (!groups[key]) {
        groups[key] = {
          fingerprint: key,
          message: error.message,
          count: 0,
          firstSeen: error.timestamp,
          lastSeen: error.timestamp,
          level: error.level,
          urls: new Set<string>(),
          users: new Set<string>(),
        }
      }

      groups[key].count++
      groups[key].lastSeen = error.timestamp
      groups[key].urls.add(error.url)
      if (error.userId) {
        groups[key].users.add(error.userId)
      }

      return groups
    }, {} as Record<string, any>)

    // Convert to array and add statistics
    const errorGroups = Object.values(groupedErrors).map(group => ({
      ...group,
      urls: Array.from(group.urls),
      users: Array.from(group.users),
      affectedUrls: group.urls.size,
      affectedUsers: group.users.size,
    }))

    // Sort by count (most frequent first)
    errorGroups.sort((a, b) => b.count - a.count)

    // Calculate summary statistics
    const summary = {
      totalErrors: filteredErrors.length,
      uniqueErrors: errorGroups.length,
      errorsByLevel: {
        error: filteredErrors.filter(e => e.level === 'error').length,
        warning: filteredErrors.filter(e => e.level === 'warning').length,
        info: filteredErrors.filter(e => e.level === 'info').length,
      },
      timeframe,
      startTime: startTime.toISOString(),
      endTime: now.toISOString(),
    }

    return NextResponse.json({
      summary,
      errors: errorGroups.slice(0, 50), // Limit to top 50 error groups
    })

  } catch (error) {
    console.error('Error fetching error statistics:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to send errors to external monitoring service
async function sendToMonitoringService(error: ErrorEvent): Promise<void> {
  try {
    // Example: Send to Sentry, LogRocket, or custom monitoring service
    
    // For Sentry:
    // Sentry.captureException(new Error(error.message), {
    //   extra: error.context,
    //   tags: error.tags,
    //   user: error.userId ? { id: error.userId } : undefined,
    //   level: error.level,
    // })

    // For custom webhook:
    if (process.env.ERROR_WEBHOOK_URL) {
      await fetch(process.env.ERROR_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ERROR_WEBHOOK_TOKEN}`,
        },
        body: JSON.stringify(error),
      })
    }

    // For Slack notifications (critical errors only):
    if (error.level === 'error' && process.env.SLACK_WEBHOOK_URL) {
      await fetch(process.env.SLACK_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `🚨 Critical Error in Smart Off Plan`,
          attachments: [
            {
              color: 'danger',
              fields: [
                {
                  title: 'Error Message',
                  value: error.message,
                  short: false,
                },
                {
                  title: 'URL',
                  value: error.url,
                  short: true,
                },
                {
                  title: 'User ID',
                  value: error.userId || 'Anonymous',
                  short: true,
                },
                {
                  title: 'Session ID',
                  value: error.sessionId,
                  short: true,
                },
                {
                  title: 'Timestamp',
                  value: error.timestamp,
                  short: true,
                },
              ],
            },
          ],
        }),
      })
    }

  } catch (sendError) {
    console.error('Failed to send error to monitoring service:', sendError)
    // Don't throw here to avoid infinite error loops
  }
}
