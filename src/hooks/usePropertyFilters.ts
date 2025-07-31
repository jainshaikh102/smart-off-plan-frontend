import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Filters } from "../components/shared/PropertyFiltersDialog";

interface UsePropertyFiltersProps {
  storageKey?: string;
  defaultFilters?: Partial<Filters>;
}

export function usePropertyFilters({
  storageKey = "propertyFilters",
  defaultFilters = {},
}: UsePropertyFiltersProps = {}) {
  // Default filter values - memoized to prevent recreation on every render
  const getDefaultFilters = useMemo(
    (): Filters => ({
      searchTerm: "",
      priceRange: [0, 20000000],
      priceDisplayMode: "total",
      areaRange: [0, 50000], // sqft
      completionTimeframe: "all",
      developmentStatus: [],
      salesStatus: [],
      unitType: [],
      bedrooms: [],
      featured: null, // No featured filter by default
      ...defaultFilters,
    }),
    [defaultFilters]
  );

  // Helper functions for localStorage
  const saveFiltersToStorage = useCallback(
    (filters: Filters) => {
      // Check if we're in the browser environment
      if (typeof window === "undefined") {
        return;
      }

      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            ...filters,
            timestamp: Date.now(),
          })
        );
        // console.log(`✅ Filters saved to localStorage (${storageKey})`);
      } catch (error) {
        console.warn(`⚠️ Failed to save filters to localStorage:`, error);
      }
    },
    [storageKey]
  );

  const loadFiltersFromStorage = useCallback((): Filters | null => {
    // Check if we're in the browser environment
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Check if filters are less than 24 hours old
        const isRecent =
          parsed.timestamp &&
          Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
        if (isRecent) {
          const { timestamp, ...filters } = parsed;
          // console.log(
          //   `✅ Loaded saved filters from localStorage (${storageKey})`
          // );
          return filters;
        } else {
          // Remove expired filters
          localStorage.removeItem(storageKey);
          // console.log(
          //   `🗑️ Removed expired filters from localStorage (${storageKey})`
          // );
        }
      }
    } catch (error) {
      console.warn(`⚠️ Failed to load filters from localStorage:`, error);
      if (typeof window !== "undefined") {
        localStorage.removeItem(storageKey);
      }
    }
    return null;
  }, [storageKey]);

  // Initialize filters with saved values or defaults
  const initializeFilters = useCallback((): Filters => {
    const savedFilters = loadFiltersFromStorage();
    if (savedFilters) {
      return savedFilters;
    }
    return getDefaultFilters;
  }, [loadFiltersFromStorage, getDefaultFilters]);

  // Applied filters (used for API calls)
  const [appliedFilters, setAppliedFilters] =
    useState<Filters>(getDefaultFilters);

  // Debounced search state
  const [searchTerm, setSearchTerm] = useState("");
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search effect - only update appliedFilters after user stops typing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setAppliedFilters((prev) => {
        const newFilters = { ...prev, searchTerm };
        // Save filters to localStorage for persistence
        saveFiltersToStorage(newFilters);
        return newFilters;
      });
    }, 500); // 500ms debounce delay

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm, saveFiltersToStorage]);

  // Filter helper functions for applied filters (search term with debouncing)
  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm); // Update local state immediately for UI responsiveness
  }, []);

  const handleFiltersChange = useCallback(
    (newFilters: Filters) => {
      setAppliedFilters(newFilters);
      // Save filters to localStorage for persistence
      saveFiltersToStorage(newFilters);
    },
    [saveFiltersToStorage]
  );

  const resetFilters = useCallback(() => {
    setSearchTerm(""); // Reset search term
    setAppliedFilters(getDefaultFilters);
    // Clear saved filters from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
      // console.log(`🗑️ Cleared saved filters from localStorage (${storageKey})`);
    }
  }, [storageKey, getDefaultFilters]);

  // Count active filters (excluding search term as it's visible in the search bar)
  const getActiveFilterCount = useCallback(() => {
    let count = 0;

    if (
      appliedFilters.priceRange[0] > 0 ||
      appliedFilters.priceRange[1] < 20000000
    )
      count++;
    if (appliedFilters.areaRange[0] > 0 || appliedFilters.areaRange[1] < 50000)
      count++;
    if (appliedFilters.completionTimeframe !== "all") count++;
    if (appliedFilters.developmentStatus.length > 0) count++;
    if (appliedFilters.salesStatus.length > 0) count++;
    if (appliedFilters.unitType.length > 0) count++;
    if (appliedFilters.bedrooms.length > 0) count++;
    if (appliedFilters.featured !== null) count++;

    return count;
  }, [appliedFilters]);

  // Initialize filters on first load
  const initializeFiltersState = useCallback(() => {
    const initialFilters = initializeFilters();
    setAppliedFilters(initialFilters);
    return initialFilters;
  }, [initializeFilters]);

  return {
    appliedFilters,
    searchTerm, // Current search term for UI display
    setAppliedFilters,
    handleSearchChange,
    handleFiltersChange,
    resetFilters,
    getActiveFilterCount,
    initializeFiltersState,
    saveFiltersToStorage,
    loadFiltersFromStorage,
  };
}
