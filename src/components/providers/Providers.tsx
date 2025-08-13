"use client";

import React from "react";
import { Provider } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { store } from "@/store";

// Persistent cache functions for localStorage
const persistCache = (queryClient: QueryClient) => {
  if (typeof window !== "undefined") {
    const cache = queryClient.getQueryCache();
    const data = cache.getAll().map((query) => ({
      queryKey: query.queryKey,
      queryHash: query.queryHash,
      data: query.state.data,
      dataUpdatedAt: query.state.dataUpdatedAt,
    }));
    localStorage.setItem("react-query-cache", JSON.stringify(data));
  }
};

const restoreCache = (queryClient: QueryClient) => {
  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem("react-query-cache");
      if (cached) {
        const data = JSON.parse(cached);
        data.forEach((item: any) => {
          // Only restore if data is less than 8 hours old
          const isStale = Date.now() - item.dataUpdatedAt > 8 * 60 * 60 * 1000;
          if (!isStale && item.data) {
            queryClient.setQueryData(item.queryKey, item.data);
          }
        });
      }
    } catch (error) {
      console.warn("Failed to restore cache from localStorage:", error);
    }
  }
};

// Create a client with extended cache times
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache for 8 hours (data stays fresh for 8 hours)
      staleTime: 8 * 60 * 60 * 1000, // 8 hours
      // Keep in cache for 12 hours (garbage collection after 12 hours)
      gcTime: 12 * 60 * 60 * 1000, // 12 hours
      // Retry failed requests 2 times
      retry: 2,
      // Don't refetch on window focus by default
      refetchOnWindowFocus: false,
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  // Restore cache on mount
  React.useEffect(() => {
    restoreCache(queryClient);
  }, []);

  // Persist cache on unmount and periodically
  React.useEffect(() => {
    const interval = setInterval(() => {
      persistCache(queryClient);
    }, 5 * 60 * 1000); // Save every 5 minutes

    // Save on page unload
    const handleBeforeUnload = () => {
      persistCache(queryClient);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      persistCache(queryClient); // Final save on unmount
    };
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </Provider>
  );
}
