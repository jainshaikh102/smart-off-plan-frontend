"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

export class ErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Call the onError callback if provided
    this.props.onError?.(error, errorInfo);

    // Log performance metrics if available
    if (typeof window !== "undefined" && "performance" in window) {
      const memory = (window.performance as any).memory;
      if (memory) {
        console.error("Memory usage at error:", {
          used: Math.round(memory.usedJSHeapSize / 1048576),
          total: Math.round(memory.totalJSHeapSize / 1048576),
          limit: Math.round(memory.jsHeapSizeLimit / 1048576),
        });
      }
    }
  }

  handleRetry = () => {
    if (this.state.retryCount < this.maxRetries) {
      this.setState((prevState) => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1,
      }));
    } else {
      // Force page reload if max retries exceeded
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              {this.state.retryCount < this.maxRetries
                ? "We're having trouble loading this content. Please try again."
                : "Multiple errors occurred. The page will be refreshed."}
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left bg-gray-100 p-4 rounded mb-4 text-sm">
                <summary className="cursor-pointer font-medium">
                  Error Details
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-red-600">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <button
              onClick={this.handleRetry}
              className="inline-flex items-center px-4 py-2 bg-gold text-white rounded-lg hover:bg-gold/90 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {this.state.retryCount < this.maxRetries
                ? "Try Again"
                : "Refresh Page"}
            </button>

            <p className="text-xs text-gray-500 mt-2">
              Retry {this.state.retryCount}/{this.maxRetries}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Performance monitoring wrapper
export const PerformanceErrorBoundary: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const handleError = (error: Error, errorInfo: ErrorInfo) => {
    // Log performance metrics
    if (typeof window !== "undefined") {
      const metrics = {
        timestamp: Date.now(),
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      // Add memory info if available
      if ("performance" in window && "memory" in (window.performance as any)) {
        const memory = (window.performance as any).memory;
        (metrics as any).memory = {
          used: Math.round(memory.usedJSHeapSize / 1048576),
          total: Math.round(memory.totalJSHeapSize / 1048576),
          limit: Math.round(memory.jsHeapSizeLimit / 1048576),
        };
      }

      console.error("Performance Error Boundary:", metrics);

      // In production, you might want to send this to an error tracking service
      // Example: Sentry, LogRocket, etc.
    }
  };

  return <ErrorBoundary onError={handleError}>{children}</ErrorBoundary>;
};
