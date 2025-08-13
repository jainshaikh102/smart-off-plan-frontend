'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  Database, 
  Clock, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle,
  Activity
} from 'lucide-react';

interface CacheInfo {
  hasCache: boolean;
  cacheSize: number;
  lastUpdated: string | null;
  expiresAt: string | null;
  isExpired: boolean;
}

export const CachingStatus: React.FC = () => {
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const checkCacheStatus = () => {
    if (typeof window === 'undefined') return;

    try {
      const cached = localStorage.getItem('react-query-cache');
      if (cached) {
        const data = JSON.parse(cached);
        const propertyCache = data.find((item: any) => 
          item.queryKey && item.queryKey.includes('properties')
        );

        if (propertyCache) {
          const lastUpdated = new Date(propertyCache.dataUpdatedAt);
          const expiresAt = new Date(propertyCache.dataUpdatedAt + (8 * 60 * 60 * 1000)); // 8 hours
          const isExpired = Date.now() > expiresAt.getTime();

          setCacheInfo({
            hasCache: true,
            cacheSize: propertyCache.data?.length || 0,
            lastUpdated: lastUpdated.toLocaleString(),
            expiresAt: expiresAt.toLocaleString(),
            isExpired,
          });
        } else {
          setCacheInfo({
            hasCache: false,
            cacheSize: 0,
            lastUpdated: null,
            expiresAt: null,
            isExpired: true,
          });
        }
      } else {
        setCacheInfo({
          hasCache: false,
          cacheSize: 0,
          lastUpdated: null,
          expiresAt: null,
          isExpired: true,
        });
      }
    } catch (error) {
      console.error('Error checking cache status:', error);
      setCacheInfo({
        hasCache: false,
        cacheSize: 0,
        lastUpdated: null,
        expiresAt: null,
        isExpired: true,
      });
    }
  };

  useEffect(() => {
    checkCacheStatus();
    const interval = setInterval(checkCacheStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const clearCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('react-query-cache');
      checkCacheStatus();
      // Refresh the page to trigger fresh API calls
      window.location.reload();
    }
  };

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        variant="outline"
        size="sm"
        className="fixed top-4 right-4 z-50 bg-white shadow-lg"
      >
        <Activity className="w-4 h-4 mr-2" />
        Cache Status
      </Button>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-50 w-80">
      <Card className="bg-white shadow-xl border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-600" />
              Cache Status
            </CardTitle>
            <Button
              onClick={() => setIsVisible(false)}
              variant="outline"
              size="sm"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {cacheInfo ? (
            <>
              {/* Cache Status */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cache Status</span>
                <Badge 
                  variant={cacheInfo.hasCache && !cacheInfo.isExpired ? "default" : "destructive"}
                  className="text-xs"
                >
                  {cacheInfo.hasCache && !cacheInfo.isExpired ? (
                    <>
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {cacheInfo.isExpired ? 'Expired' : 'Empty'}
                    </>
                  )}
                </Badge>
              </div>

              {/* Properties Cached */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Properties Cached</span>
                <Badge variant="secondary" className="text-xs">
                  {cacheInfo.cacheSize.toLocaleString()}
                </Badge>
              </div>

              {/* Last Updated */}
              {cacheInfo.lastUpdated && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">Last Updated</span>
                  <p className="text-xs text-gray-600">{cacheInfo.lastUpdated}</p>
                </div>
              )}

              {/* Expires At */}
              {cacheInfo.expiresAt && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">Expires At</span>
                  <p className="text-xs text-gray-600">{cacheInfo.expiresAt}</p>
                </div>
              )}

              {/* Cache Performance */}
              <div className="pt-2 border-t border-gray-200">
                <h4 className="text-sm font-medium mb-2">Performance Impact</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  {cacheInfo.hasCache && !cacheInfo.isExpired ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      No API calls needed - instant loading
                    </div>
                  ) : (
                    <div className="flex items-center text-orange-600">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Will trigger 17 API calls on next load
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-gray-200 space-y-2">
                <Button
                  onClick={checkCacheStatus}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Status
                </Button>
                
                <Button
                  onClick={clearCache}
                  variant="destructive"
                  size="sm"
                  className="w-full"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Clear Cache & Reload
                </Button>
              </div>

              {/* Instructions */}
              <div className="pt-2 border-t border-gray-200">
                <h4 className="text-sm font-medium mb-1">Test Instructions</h4>
                <div className="space-y-1 text-xs text-gray-600">
                  <p>1. Clear cache to see 17 API calls</p>
                  <p>2. Refresh page to see instant loading</p>
                  <p>3. Cache lasts 8 hours automatically</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-500">Checking cache...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
