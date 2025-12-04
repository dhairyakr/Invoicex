import { useState, useCallback, useRef } from 'react';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheStore {
  [key: string]: CacheEntry<any>;
}

const CACHE_DURATION = 5 * 60 * 1000;

export function useReportCache<T>() {
  const cacheRef = useRef<CacheStore>({});

  const getCacheKey = useCallback((reportType: string, params: any): string => {
    const paramsStr = JSON.stringify(params);
    return `${reportType}:${paramsStr}`;
  }, []);

  const getFromCache = useCallback((reportType: string, params: any): T | null => {
    const key = getCacheKey(reportType, params);
    const entry = cacheRef.current[key];

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > CACHE_DURATION) {
      delete cacheRef.current[key];
      return null;
    }

    return entry.data;
  }, [getCacheKey]);

  const setToCache = useCallback((reportType: string, params: any, data: T): void => {
    const key = getCacheKey(reportType, params);
    cacheRef.current[key] = {
      data,
      timestamp: Date.now()
    };
  }, [getCacheKey]);

  const clearCache = useCallback((reportType?: string): void => {
    if (reportType) {
      Object.keys(cacheRef.current).forEach(key => {
        if (key.startsWith(reportType + ':')) {
          delete cacheRef.current[key];
        }
      });
    } else {
      cacheRef.current = {};
    }
  }, []);

  return {
    getFromCache,
    setToCache,
    clearCache
  };
}
