"use client";

import { useEffect, useCallback, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  updatePerformanceCheck,
  optimizeCache,
} from "@/store/slices/propertySlice";

interface PerformanceMetrics {
  timestamp: number;
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  } | null;
  propertiesLoaded: number;
  renderTime?: number;
  apiCallCount: number;
}

export const usePerformanceMonitoring = () => {
  const dispatch = useAppDispatch();
  const performanceState = useAppSelector((state) => state.properties);
  const renderStartTime = useRef<number>(Date.now());
  const apiCallCount = useRef<number>(0);

  // Get memory usage if available
  const getMemoryUsage = useCallback(() => {
    if (
      typeof window !== "undefined" &&
      "performance" in window &&
      "memory" in (window.performance as any)
    ) {
      const memory = (window.performance as any).memory;
      return {
        used: Math.round(memory.usedJSHeapSize / 1048576), // MB
        total: Math.round(memory.totalJSHeapSize / 1048576), // MB
        limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      };
    }
    return null;
  }, []);

  // Track API calls
  const trackApiCall = useCallback(() => {
    apiCallCount.current += 1;
  }, []);

  // Get comprehensive performance metrics
  const getPerformanceMetrics = useCallback((): PerformanceMetrics => {
    const now = Date.now();
    const renderTime = now - renderStartTime.current;

    return {
      timestamp: now,
      memoryUsage: getMemoryUsage(),
      propertiesLoaded: performanceState.totalPropertiesLoaded,
      renderTime,
      apiCallCount: apiCallCount.current,
    };
  }, [getMemoryUsage, performanceState.totalPropertiesLoaded]);

  // Check for performance issues
  const checkPerformanceIssues = useCallback(() => {
    const metrics = getPerformanceMetrics();
    const issues: string[] = [];

    // Memory usage checks
    if (metrics.memoryUsage) {
      const memoryUsagePercent =
        (metrics.memoryUsage.used / metrics.memoryUsage.limit) * 100;

      if (memoryUsagePercent > 80) {
        issues.push(`High memory usage: ${memoryUsagePercent.toFixed(1)}%`);
      }

      if (metrics.memoryUsage.used > 150) {
        issues.push(
          `Memory usage exceeds 150MB: ${metrics.memoryUsage.used}MB`
        );
      }
    }

    // Properties count check
    if (metrics.propertiesLoaded > 1000) {
      issues.push(
        `Large number of properties loaded: ${metrics.propertiesLoaded}`
      );
    }

    // Render time check
    if (metrics.renderTime && metrics.renderTime > 5000) {
      issues.push(`Slow render time: ${metrics.renderTime}ms`);
    }

    // API call frequency check
    if (metrics.apiCallCount > 50) {
      issues.push(`High API call count: ${metrics.apiCallCount}`);
    }

    return {
      metrics,
      issues,
      hasIssues: issues.length > 0,
    };
  }, [getPerformanceMetrics]);

  // Auto-optimize when performance issues are detected
  const autoOptimize = useCallback(() => {
    const { issues, hasIssues } = checkPerformanceIssues();

    if (hasIssues) {
      console.warn("🚨 Performance issues detected:", issues);

      // Trigger cache optimization
      dispatch(optimizeCache());

      // Reset API call counter
      apiCallCount.current = 0;

      // Force garbage collection if available
      if (typeof window !== "undefined" && "gc" in window) {
        try {
          (window as any).gc();
        } catch (e) {
          // Ignore if gc is not available
        }
      }

      return true;
    }

    return false;
  }, [checkPerformanceIssues, dispatch]);

  // Performance monitoring interval
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(updatePerformanceCheck());
      autoOptimize();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [dispatch, autoOptimize]);

  // Monitor for memory leaks
  useEffect(() => {
    let previousMemoryUsage = 0;
    const memoryCheckInterval = setInterval(() => {
      const memoryUsage = getMemoryUsage();
      if (memoryUsage) {
        const memoryIncrease = memoryUsage.used - previousMemoryUsage;

        // If memory increased by more than 20MB in 1 minute, warn about potential leak
        if (memoryIncrease > 20 && previousMemoryUsage > 0) {
          console.warn("🔍 Potential memory leak detected:", {
            previous: previousMemoryUsage,
            current: memoryUsage.used,
            increase: memoryIncrease,
          });
        }

        previousMemoryUsage = memoryUsage.used;
      }
    }, 60000); // Check every minute

    return () => clearInterval(memoryCheckInterval);
  }, [getMemoryUsage]);

  // Log performance metrics on component unmount
  useEffect(() => {
    return () => {
      const finalMetrics = getPerformanceMetrics();
      console.log("📊 Final performance metrics:", finalMetrics);
    };
  }, [getPerformanceMetrics]);

  return {
    getPerformanceMetrics,
    getMemoryUsage,
    checkPerformanceIssues,
    autoOptimize,
    trackApiCall,
  };
};

// Hook for monitoring specific component performance
export const useComponentPerformance = (componentName: string) => {
  const startTime = useRef<number>(Date.now());
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderCount.current += 1;
  });

  useEffect(() => {
    const mountTime = Date.now() - startTime.current;
    console.log(`⏱️ ${componentName} mounted in ${mountTime}ms`);

    return () => {
      const totalTime = Date.now() - startTime.current;
      console.log(`📈 ${componentName} performance:`, {
        totalTime,
        renderCount: renderCount.current,
        avgRenderTime: totalTime / renderCount.current,
      });
    };
  }, [componentName]);

  return {
    renderCount: renderCount.current,
    mountTime: Date.now() - startTime.current,
  };
};

// Hook for tracking API performance
export const useApiPerformance = () => {
  const apiTimes = useRef<Map<string, number>>(new Map());

  const startApiCall = useCallback((endpoint: string) => {
    apiTimes.current.set(endpoint, Date.now());
  }, []);

  const endApiCall = useCallback((endpoint: string) => {
    const startTime = apiTimes.current.get(endpoint);
    if (startTime) {
      const duration = Date.now() - startTime;
      console.log(`🌐 API call to ${endpoint} took ${duration}ms`);
      apiTimes.current.delete(endpoint);

      // Warn about slow API calls
      if (duration > 5000) {
        console.warn(`⚠️ Slow API call detected: ${endpoint} (${duration}ms)`);
      }

      return duration;
    }
    return 0;
  }, []);

  return {
    startApiCall,
    endApiCall,
  };
};
