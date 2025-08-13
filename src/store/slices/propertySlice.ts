import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Property {
  id: number;
  name: string;
  area: string;
  area_unit: string;
  cover_image_url: string;
  developer: string;
  is_partner_project: boolean;
  min_price: number;
  max_price: number;
  price_currency: string;
  sale_status: string;
  status: string;
  development_status: string;
  completion_datetime: string;
  coordinates: string;
  description: string;
  featured: boolean;
  pendingReview: boolean;
  featureReason: string[];
  reelly_status: boolean;
  lastFeaturedAt?: string;
  lastFetchedAt: Date;
  cacheExpiresAt: Date;
  source: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  developer_logo?: string;
}

interface PropertyState {
  // Map properties cache
  mapProperties: Property[];
  mapLoading: boolean;
  mapError: string | null;
  mapCurrentPage: number;
  mapHasMore: boolean;
  mapLastFetch: number | null;
  
  // List properties cache
  listProperties: Property[];
  listLoading: boolean;
  listError: string | null;
  listCurrentPage: number;
  listHasMore: boolean;
  
  // Performance tracking
  totalPropertiesLoaded: number;
  lastPerformanceCheck: number | null;
  
  // Cache management
  cacheVersion: number;
  maxCacheSize: number;
}

const initialState: PropertyState = {
  mapProperties: [],
  mapLoading: false,
  mapError: null,
  mapCurrentPage: 0,
  mapHasMore: true,
  mapLastFetch: null,
  
  listProperties: [],
  listLoading: false,
  listError: null,
  listCurrentPage: 0,
  listHasMore: true,
  
  totalPropertiesLoaded: 0,
  lastPerformanceCheck: null,
  
  cacheVersion: 1,
  maxCacheSize: 1000, // Limit to prevent memory issues
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    // Map properties actions
    setMapLoading: (state, action: PayloadAction<boolean>) => {
      state.mapLoading = action.payload;
    },
    setMapProperties: (state, action: PayloadAction<Property[]>) => {
      state.mapProperties = action.payload;
      state.totalPropertiesLoaded = action.payload.length;
      state.mapLastFetch = Date.now();
    },
    appendMapProperties: (state, action: PayloadAction<Property[]>) => {
      // Prevent duplicates and enforce cache size limit
      const existingIds = new Set(state.mapProperties.map(p => p.id));
      const newProperties = action.payload.filter(p => !existingIds.has(p.id));
      
      const combined = [...state.mapProperties, ...newProperties];
      
      // Enforce cache size limit
      if (combined.length > state.maxCacheSize) {
        state.mapProperties = combined.slice(-state.maxCacheSize);
      } else {
        state.mapProperties = combined;
      }
      
      state.totalPropertiesLoaded = state.mapProperties.length;
      state.mapLastFetch = Date.now();
    },
    setMapError: (state, action: PayloadAction<string | null>) => {
      state.mapError = action.payload;
    },
    setMapPagination: (state, action: PayloadAction<{ page: number; hasMore: boolean }>) => {
      state.mapCurrentPage = action.payload.page;
      state.mapHasMore = action.payload.hasMore;
    },
    
    // List properties actions
    setListLoading: (state, action: PayloadAction<boolean>) => {
      state.listLoading = action.payload;
    },
    setListProperties: (state, action: PayloadAction<Property[]>) => {
      state.listProperties = action.payload;
    },
    appendListProperties: (state, action: PayloadAction<Property[]>) => {
      const existingIds = new Set(state.listProperties.map(p => p.id));
      const newProperties = action.payload.filter(p => !existingIds.has(p.id));
      state.listProperties = [...state.listProperties, ...newProperties];
    },
    setListError: (state, action: PayloadAction<string | null>) => {
      state.listError = action.payload;
    },
    setListPagination: (state, action: PayloadAction<{ page: number; hasMore: boolean }>) => {
      state.listCurrentPage = action.payload.page;
      state.listHasMore = action.payload.hasMore;
    },
    
    // Cache management
    clearMapCache: (state) => {
      state.mapProperties = [];
      state.mapCurrentPage = 0;
      state.mapHasMore = true;
      state.mapLastFetch = null;
      state.mapError = null;
    },
    clearListCache: (state) => {
      state.listProperties = [];
      state.listCurrentPage = 0;
      state.listHasMore = true;
      state.listError = null;
    },
    clearAllCache: (state) => {
      return { ...initialState, cacheVersion: state.cacheVersion + 1 };
    },
    
    // Performance tracking
    updatePerformanceCheck: (state) => {
      state.lastPerformanceCheck = Date.now();
    },
    
    // Memory management
    optimizeCache: (state) => {
      // Keep only the most recent properties if cache is too large
      if (state.mapProperties.length > state.maxCacheSize) {
        state.mapProperties = state.mapProperties.slice(-state.maxCacheSize);
      }
      if (state.listProperties.length > state.maxCacheSize) {
        state.listProperties = state.listProperties.slice(-state.maxCacheSize);
      }
    },
  },
});

export const {
  setMapLoading,
  setMapProperties,
  appendMapProperties,
  setMapError,
  setMapPagination,
  setListLoading,
  setListProperties,
  appendListProperties,
  setListError,
  setListPagination,
  clearMapCache,
  clearListCache,
  clearAllCache,
  updatePerformanceCheck,
  optimizeCache,
} = propertySlice.actions;

export default propertySlice.reducer;
