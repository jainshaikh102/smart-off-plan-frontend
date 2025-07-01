import { cn } from "@/lib/utils"
import { Button } from "./button"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center py-12 px-4",
      className
    )}>
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-muted-foreground mb-6 max-w-md">
          {description}
        </p>
      )}
      
      {action && (
        <Button onClick={action.onClick} variant="outline">
          {action.label}
        </Button>
      )}
    </div>
  )
}

// Specific empty states
export function NoPropertiesFound({ onReset }: { onReset?: () => void }) {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          🏠
        </div>
      }
      title="No Properties Found"
      description="We couldn't find any properties matching your criteria. Try adjusting your filters or search terms."
      action={onReset ? {
        label: "Clear Filters",
        onClick: onReset
      } : undefined}
    />
  )
}

export function NoDevelopersFound() {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          🏢
        </div>
      }
      title="No Developers Found"
      description="We couldn't find any developers at the moment. Please try again later."
    />
  )
}

export function NoFavoritesFound({ onBrowse }: { onBrowse?: () => void }) {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          ❤️
        </div>
      }
      title="No Favorites Yet"
      description="You haven't added any properties to your favorites. Start browsing to find your dream property!"
      action={onBrowse ? {
        label: "Browse Properties",
        onClick: onBrowse
      } : undefined}
    />
  )
}

export function NoInquiriesFound() {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          📧
        </div>
      }
      title="No Inquiries Yet"
      description="You haven't made any inquiries yet. Contact us about properties you're interested in!"
    />
  )
}

export function ErrorState({ 
  onRetry, 
  message = "Something went wrong" 
}: { 
  onRetry?: () => void
  message?: string 
}) {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
          ⚠️
        </div>
      }
      title="Oops! Something went wrong"
      description={message}
      action={onRetry ? {
        label: "Try Again",
        onClick: onRetry
      } : undefined}
    />
  )
}

export function NetworkErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <EmptyState
      icon={
        <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
          📡
        </div>
      }
      title="Connection Problem"
      description="Please check your internet connection and try again."
      action={onRetry ? {
        label: "Retry",
        onClick: onRetry
      } : undefined}
    />
  )
}
