"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Activity,
  Database,
  Clock,
  Zap,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { useAppSelector } from "@/store";
import { usePerformanceMonitor } from "@/hooks/useOptimizedProperties";

interface PerformanceStats {
  memoryUsage: {
    used: number;
    total: number;
    limit: number;
    percentage: number;
  } | null;
  apiCalls: number;
  cacheHitRate: number;
  loadTime: number;
  propertiesLoaded: number;
  lastUpdate: string;
}

export const PerformanceDashboard: React.FC = () => {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const performanceState = useAppSelector((state) => state.properties);
  const { getPerformanceMetrics, getMemoryUsage } = usePerformanceMonitor();

  // Update stats every 5 seconds
  useEffect(() => {
    const updateStats = () => {
      const metrics = getPerformanceMetrics();
      const memory = getMemoryUsage();

      const newStats: PerformanceStats = {
        memoryUsage: memory
          ? {
              ...memory,
              percentage: (memory.used / memory.limit) * 100,
            }
          : null,
        apiCalls: (metrics as any).apiCallCount || 0,
        cacheHitRate: performanceState.mapProperties.length > 0 ? 85 : 0, // Simulated cache hit rate
        loadTime: (metrics as any).renderTime || 0,
        propertiesLoaded: performanceState.totalPropertiesLoaded,
        lastUpdate: new Date().toLocaleTimeString(),
      };

      setStats(newStats);
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, [getPerformanceMetrics, getMemoryUsage, performanceState]);

  const getMemoryStatus = (percentage: number) => {
    if (percentage > 80)
      return { color: "destructive", icon: AlertTriangle, label: "High" };
    if (percentage > 60)
      return { color: "warning", icon: TrendingUp, label: "Medium" };
    return { color: "success", icon: CheckCircle, label: "Good" };
  };

  const getCacheStatus = (hitRate: number) => {
    if (hitRate > 80)
      return { color: "success", icon: CheckCircle, label: "Excellent" };
    if (hitRate > 60)
      return { color: "warning", icon: TrendingUp, label: "Good" };
    return { color: "destructive", icon: TrendingDown, label: "Poor" };
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 z-50 bg-white shadow-lg"
      >
        <Activity className="w-4 h-4 mr-2" />
        Performance
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-h-[80vh] overflow-y-auto">
      <Card className="bg-white shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-600" />
              Performance Monitor
            </CardTitle>
            <div className="flex gap-2">
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
                size="sm"
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setIsVisible(false)}
                variant="outline"
                size="sm"
              >
                ×
              </Button>
            </div>
          </div>
          {stats && (
            <p className="text-sm text-gray-500">
              Last updated: {stats.lastUpdate}
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          {stats ? (
            <>
              {/* Memory Usage */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Memory Usage</span>
                  {stats.memoryUsage && (
                    <Badge
                      variant={
                        getMemoryStatus(stats.memoryUsage.percentage)
                          .color as any
                      }
                      className="text-xs"
                    >
                      {getMemoryStatus(stats.memoryUsage.percentage).label}
                    </Badge>
                  )}
                </div>
                {stats.memoryUsage ? (
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-gray-600">
                      <span>{stats.memoryUsage.used}MB used</span>
                      <span>{stats.memoryUsage.limit}MB limit</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          stats.memoryUsage.percentage > 80
                            ? "bg-red-500"
                            : stats.memoryUsage.percentage > 60
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{
                          width: `${Math.min(
                            stats.memoryUsage.percentage,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      {stats.memoryUsage.percentage.toFixed(1)}% of available
                      memory
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    Memory info not available
                  </p>
                )}
              </div>

              {/* Properties Loaded */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Database className="w-4 h-4 mr-2 text-green-600" />
                  <span className="text-sm font-medium">Properties Loaded</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {stats.propertiesLoaded.toLocaleString()}
                </Badge>
              </div>

              {/* Cache Performance */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cache Hit Rate</span>
                  <Badge
                    variant={getCacheStatus(stats.cacheHitRate).color as any}
                    className="text-xs"
                  >
                    {stats.cacheHitRate}%
                  </Badge>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${stats.cacheHitRate}%` }}
                  />
                </div>
              </div>

              {/* API Calls */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-orange-600" />
                  <span className="text-sm font-medium">API Calls</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {stats.apiCalls}
                </Badge>
              </div>

              {/* Load Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="text-sm font-medium">Load Time</span>
                </div>
                <Badge variant="outline" className="text-xs">
                  {stats.loadTime > 0
                    ? `${(stats.loadTime / 1000).toFixed(1)}s`
                    : "N/A"}
                </Badge>
              </div>

              {/* Redux State Info */}
              <div className="pt-2 border-t border-gray-200">
                <h4 className="text-sm font-medium mb-2">Cache Status</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Map Cache:</span>
                    <br />
                    <span className="font-medium">
                      {performanceState.mapProperties.length} items
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">List Cache:</span>
                    <br />
                    <span className="font-medium">
                      {performanceState.listProperties.length} items
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Cache Version:</span>
                    <br />
                    <span className="font-medium">
                      v{performanceState.cacheVersion}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Max Size:</span>
                    <br />
                    <span className="font-medium">
                      {performanceState.maxCacheSize}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Tips */}
              <div className="pt-2 border-t border-gray-200">
                <h4 className="text-sm font-medium mb-2">Performance Tips</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  {stats.memoryUsage && stats.memoryUsage.percentage > 80 && (
                    <div className="flex items-center text-red-600">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      High memory usage detected
                    </div>
                  )}
                  {stats.cacheHitRate < 60 && (
                    <div className="flex items-center text-yellow-600">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      Low cache efficiency
                    </div>
                  )}
                  {stats.apiCalls > 20 && (
                    <div className="flex items-center text-orange-600">
                      <Zap className="w-3 h-3 mr-1" />
                      High API call count
                    </div>
                  )}
                  {stats.memoryUsage &&
                    stats.memoryUsage.percentage < 50 &&
                    stats.cacheHitRate > 80 && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Optimal performance
                      </div>
                    )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">
                Loading performance data...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
