import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

/**
 * GET /api/properties/batch-100
 * Proxy to backend batch-100 endpoint for efficient property loading
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page") || "1";
    const limit = searchParams.get("limit") || "100";

    console.log(`📦 [PROXY] Fetching batch-100: page=${page}, limit=${limit}`);

    // Forward request to backend
    const backendUrl = `${BACKEND_URL}/api/properties/batch-100?page=${page}&limit=${limit}`;
    
    const response = await fetch(backendUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`❌ [PROXY] Backend error: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to fetch properties from backend",
          error: `Backend returned ${response.status}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(`✅ [PROXY] Successfully fetched ${data.data?.length || 0} properties`);

    return NextResponse.json(data);
  } catch (error) {
    console.error("❌ [PROXY] Error in batch-100 proxy:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error in proxy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
