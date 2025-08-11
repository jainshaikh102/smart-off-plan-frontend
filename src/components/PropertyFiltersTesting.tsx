import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});
const ZoomControl = dynamic(
  () => import("react-leaflet").then((mod) => mod.ZoomControl),
  { ssr: false }
);

// Add custom styles for English-only map labels
const mapStyles = `
  .english-map {
    font-family: 'Arial', 'Helvetica', sans-serif !important;
  }
  .english-map .leaflet-container {
    font-family: 'Arial', 'Helvetica', sans-serif !important;
  }
  .leaflet-container {
    direction: ltr !important;
  }
`;
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin, Building, ExternalLink } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRouter } from "next/navigation";

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
  development_status: string; // Development status from complete property data
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
  developer_logo?: string; // Developer logo URL for map markers
}

interface PropertyFiltersTestingProps {
  onPropertySelect: (property: Property) => void;
}

export function PropertyFiltersTesting({}: PropertyFiltersTestingProps) {
  const [properties, setProperties] = useState<Property[]>([]); // For property list (paginated)
  const [mapProperties, setMapProperties] = useState<Property[]>([]); // For map markers (progressively loaded)
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Key to force map re-initialization if needed

  // Infinite scroll pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Map loading state (developer-based)
  const [mapLoading, setMapLoading] = useState(false);
  const [mapCurrentDeveloperPage, setMapCurrentDeveloperPage] = useState(1);
  const [mapHasMoreDevelopers, setMapHasMoreDevelopers] = useState(true);

  const mapRef = useRef<L.Map | null>(null);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );

  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null);
  const [currentZoom, setCurrentZoom] = useState(10);
  const router = useRouter();

  // Ref for infinite scroll trigger
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const fetchProperties = async (
    page: number = 1,
    limit: number = 12,
    append: boolean = false
  ) => {
    if (append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
      setError(null);
    }

    try {
      // Build query parameters for server-side pagination and filtering
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      // No sorting - just basic property fetching

      // No filters - just basic property fetching

      const response = await axios.get(`/api/properties?${params.toString()}`);
      const data = response.data;

      if (data.success && data.data) {
        const fetchedProperties = data.data || [];

        // Update properties - append for infinite scroll or replace for new search
        if (append) {
          setProperties((prev) => [...prev, ...fetchedProperties]);
        } else {
          setProperties(fetchedProperties);
        }

        // Update pagination info from server response
        if (data.pagination) {
          setCurrentPage(data.pagination.page);
          setHasMore(data.pagination.page < data.pagination.totalPages);
        }
      } else {
        if (!append) {
          setProperties([]);
          setCurrentPage(1);
          setHasMore(false);
        }
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          `Failed to fetch properties: ${err.response?.status || err.message}`
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch properties"
        );
      }
      if (!append) {
        setProperties([]);
        setCurrentPage(1);
        setHasMore(false);
      }
    } finally {
      if (append) {
        setLoadingMore(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Load more properties for infinite scroll
  const loadMoreProperties = () => {
    if (!loadingMore && hasMore) {
      const nextPage = currentPage + 1;
      fetchProperties(nextPage, 12, true);
    }
  };

  // Fetch map properties in batches of 100 - much more efficient than developer-based loading
  const fetchMapPropertiesBatch100 = useCallback(
    async (page: number = 1, limit: number = 100, append: boolean = false) => {
      if (!append) {
        setMapLoading(true);
      }

      try {
        // Build query parameters for API call
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());

        // No filters for map loading - just load all properties in batches

        const response = await axios.get(
          `/api/properties/batch-100?${params.toString()}`
        );
        const data = response.data;

        if (data.success && data.data) {
          const fetchedProperties = data.data;

          if (append) {
            setMapProperties((prev) => [...prev, ...fetchedProperties]);
          } else {
            setMapProperties(fetchedProperties);
          }

          // Update map pagination info
          if (data.pagination) {
            setMapCurrentDeveloperPage(data.pagination.page);
            const hasMore = data.pagination.page < data.pagination.totalPages;
            setMapHasMoreDevelopers(hasMore);

            console.log(
              `📦 Batch Loading: Page ${data.pagination.page}/${data.pagination.totalPages}, HasMore: ${hasMore}, Properties: ${fetchedProperties.length}`
            );
          }
        } else {
          if (!append) {
            setMapProperties([]);
            setMapCurrentDeveloperPage(1);
            setMapHasMoreDevelopers(false);
          }
        }
      } catch (err) {
        if (!append) {
          setMapProperties([]);
          setMapCurrentDeveloperPage(1);
          setMapHasMoreDevelopers(false);
        }
      } finally {
        if (!append) {
          setMapLoading(false);
        }
      }
    },
    [
      setMapProperties,
      setMapCurrentDeveloperPage,
      setMapHasMoreDevelopers,
      setMapLoading,
    ]
  );

  // Fetch map properties by developers - loads properties grouped by developers
  const fetchMapPropertiesByDevelopers = useCallback(
    async (
      page: number = 1,
      limit: number = 1, // Number of developers per page (increased to get more developers)
      append: boolean = false
    ) => {
      if (!append) {
        setMapLoading(true);
      }

      try {
        // Build query parameters for API call
        const params = new URLSearchParams();
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        params.append("properties_per_developer", "100"); // Max properties per developer

        // No filters for map loading - just load all properties by developers

        const response = await axios.get(
          `/api/properties/by-developers?${params.toString()}`
        );
        const data = response.data;

        if (data.success && data.data) {
          // Flatten the developer groups into a single array of properties
          const fetchedProperties: Property[] = [];
          data.data.forEach((developerGroup: any) => {
            fetchedProperties.push(...developerGroup.properties);
          });

          // Update map properties
          if (append) {
            setMapProperties((prev) => [...prev, ...fetchedProperties]);
          } else {
            setMapProperties(fetchedProperties);
          }

          // Update map pagination info
          if (data.pagination) {
            setMapCurrentDeveloperPage(data.pagination.page);
            const hasMore = data.pagination.page < data.pagination.totalPages;
            setMapHasMoreDevelopers(hasMore);

            console.log(
              `📊 Map Loading: Page ${data.pagination.page}/${data.pagination.totalPages}, HasMore: ${hasMore}, Properties: ${fetchedProperties.length}`
            );
          }
        } else {
          if (!append) {
            setMapProperties([]);
            setMapCurrentDeveloperPage(1);
            setMapHasMoreDevelopers(false);
          }
        }
      } catch (err) {
        if (!append) {
          setMapProperties([]);
          setMapCurrentDeveloperPage(1);
          setMapHasMoreDevelopers(false);
        }
      } finally {
        if (!append) {
          setMapLoading(false);
        }
      }
    },
    [
      setMapProperties,
      setMapCurrentDeveloperPage,
      setMapHasMoreDevelopers,
      setMapLoading,
    ]
  );

  useEffect(() => {
    // Set client-side flag to enable map rendering
    setIsClient(true);
    fetchProperties(1, 12);
    fetchMapPropertiesBatch100(1, 100, false);

    // Cleanup function to prevent map initialization errors
    return () => {
      if (mapRef.current) {
        try {
          mapRef.current.remove();
          mapRef.current = null;
        } catch (error) {
          // Force re-initialization by updating the key
          setMapKey((prev) => prev + 1);
        }
      }
    };
  }, [fetchMapPropertiesBatch100]);

  // Auto-load map properties by developers with a delay - only when page changes and loading is complete
  useEffect(() => {
    console.log(
      `⏰ Page change detected: page=${mapCurrentDeveloperPage}, hasMore=${mapHasMoreDevelopers}, loading=${mapLoading}`
    );

    // Only set timer when we have a valid page, there are more developers, and we're not currently loading
    if (mapCurrentDeveloperPage > 0 && mapHasMoreDevelopers && !mapLoading) {
      console.log(
        `⏳ Setting 3-second timer for next batch (page ${
          mapCurrentDeveloperPage + 1
        })...`
      );
      const timer = setTimeout(() => {
        console.log(
          `⏰ Timer fired! Loading page ${mapCurrentDeveloperPage + 1}...`
        );
        if (mapHasMoreDevelopers && !mapLoading) {
          const nextPage = mapCurrentDeveloperPage + 1;
          fetchMapPropertiesBatch100(nextPage, 100, true);
        }
      }, 2000); // 2 seconds between batches (faster since we're loading 100 at once)

      return () => {
        console.log(`🚫 Clearing timer for page ${mapCurrentDeveloperPage}`);
        clearTimeout(timer);
      };
    } else {
      console.log(
        `❌ Auto-load conditions not met: page=${mapCurrentDeveloperPage}, hasMore=${mapHasMoreDevelopers}, loading=${mapLoading}`
      );
    }
  }, [
    mapCurrentDeveloperPage,
    mapHasMoreDevelopers,
    mapLoading,
    fetchMapPropertiesBatch100,
  ]);

  // Infinite scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasMore && !loadingMore && !loading) {
          loadMoreProperties();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, loadingMore, loading]);

  // Handle property hover from list - move to property but maintain zoom level 12
  const handlePropertyListHover = (property: Property) => {
    setHoveredProperty(property);
    if (mapRef.current) {
      // Parse coordinates from the property
      const coords = parseCoordinates(property.coordinates);
      if (coords) {
        // Move to property location but keep zoom at 12
        const map = mapRef.current;
        map.setView([coords.lat, coords.lng], 12, {
          animate: true,
          duration: 0.8,
        });
        // Show popup for this property - find it in mapProperties for consistency
        const mapProperty = mapProperties.find((p) => p.id === property.id);
        setSelectedProperty(mapProperty || property);
      }
    }
  };

  // Handle property hover end from list - just clear hover state, keep map position
  const handlePropertyListHoverEnd = () => {
    setHoveredProperty(null);
    // Remove popup but keep map position where user is
    setSelectedProperty(null);
  };

  // Count active filters (excluding search term as it's visible in the search bar)

  // Parse coordinates from database structure to { lat, lng }
  const parseCoordinates = (
    coordinates: string | { lat: number; lng: number } | undefined
  ): { lat: number; lng: number } => {
    try {
      if (!coordinates) {
        throw new Error("No coordinates provided");
      }

      // If coordinates is already an object
      if (
        typeof coordinates === "object" &&
        coordinates.lat &&
        coordinates.lng
      ) {
        return { lat: coordinates.lat, lng: coordinates.lng };
      }

      // If coordinates is a string, try to parse it
      if (typeof coordinates === "string") {
        const [lat, lng] = coordinates
          .split(",")
          .map((s) => parseFloat(s.trim()));
        if (isNaN(lat) || isNaN(lng)) {
          throw new Error("Invalid coordinates");
        }
        return { lat, lng };
      }

      throw new Error("Invalid coordinate format");
    } catch {
      return { lat: 25.2048, lng: 55.2708 }; // Fallback to Dubai center
    }
  };

  // Calculate initial map view based on properties
  const initialViewState = {
    latitude: 25.2048,
    longitude: 55.2708,
    zoom: 10,
  };

  // Get image URL from JSON string
  const getImageUrl = (coverImageUrl?: string) => {
    if (!coverImageUrl) return "/placeholder-property.jpg";

    try {
      const parsed = JSON.parse(coverImageUrl);
      return parsed.url || "/placeholder-property.jpg";
    } catch {
      return "/placeholder-property.jpg";
    }
  };

  // Get developer logo URL - fallback to placeholder if not available
  const getDeveloperLogoUrl = (developerLogo?: string) => {
    if (!developerLogo) return "/placeholder-developer.jpg";
    return developerLogo;
  };

  // MapEvents component for handling map interactions
  const MapEvents = dynamic(
    () =>
      import("react-leaflet").then((mod) => {
        const { useMapEvents } = mod;
        return function MapEventsComponent() {
          useMapEvents({
            click: () => {
              setSelectedProperty(null);
            },
            zoomend: (e) => {
              setCurrentZoom(e.target.getZoom());
            },
          });
          return null;
        };
      }),
    { ssr: false }
  );

  return (
    <section className="section-padding bg-white">
      <style dangerouslySetInnerHTML={{ __html: mapStyles }} />
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-[#8b7355] mb-6">Find Your Perfect Property</h2>
          <p className="text-warm-gray max-w-2xl mx-auto text-lg">
            Explore our curated selection of luxury properties in Dubai's most
            prestigious locations. Use our advanced search and interactive map
            to find your ideal investment.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:col-span-1">
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-warm-gray mb-4">
                    Loading properties...
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="text-warm-gray mb-4">{error}</div>
                  <Button
                    onClick={() => fetchProperties(1, 12)}
                    className="bg-gold hover:bg-gold/90 text-charcoal"
                  >
                    Retry
                  </Button>
                </div>
              ) : properties.length > 0 ? (
                properties.map((property, index) => (
                  <div
                    key={`list-${property.id}-${index}`}
                    className={`border rounded-lg p-3 transition-all duration-300 cursor-pointer border-[#F6F2ED] hover:border-[#D4A373]/50 hover:shadow-md ${
                      hoveredProperty?.id === property.id
                        ? "border-gold shadow-lg bg-gold/5"
                        : ""
                    }`}
                    onClick={() => router.push(`/properties/${property.id}`)}
                    onMouseEnter={() => handlePropertyListHover(property)}
                    onMouseLeave={handlePropertyListHoverEnd}
                  >
                    <div className="flex gap-3">
                      <ImageWithFallback
                        src={getImageUrl(property.cover_image_url)}
                        alt={property.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="mb-1 truncate text-sm text-[rgba(30,26,26,1)]">
                          {property.name}
                        </h4>
                        <div className="flex items-center text-muted-foreground text-xs mb-1">
                          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{property.area}</span>
                        </div>
                        <div className="text-deep-blue mb-2 text-sm">
                          {property.min_price && property.max_price
                            ? `${property.price_currency} ${(
                                property.min_price / 1000000
                              ).toFixed(1)}M - ${(
                                property.max_price / 1000000
                              ).toFixed(1)}M`
                            : property.min_price
                            ? `${property.price_currency} ${(
                                property.min_price / 1000000
                              ).toFixed(1)}M+`
                            : "Price on Request"}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center">
                            <Building className="w-3 h-3 mr-1" />
                            {property.developer}
                          </div>
                        </div>

                        <Badge
                          className={`mt-2 text-xs tracking-wide ${
                            property.development_status === "Completed"
                              ? "bg-[#8b7355] text-white"
                              : property.development_status ===
                                "Under construction"
                              ? "bg-[#FF6900] text-white"
                              : property.development_status === "Presale"
                              ? "bg-[#D4AF37] text-white"
                              : "" // Fallback for unexpected values
                          }`}
                        >
                          {property.development_status ||
                            property.development_status ||
                            "Available"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-warm-gray mb-4">
                    No properties found matching your criteria
                  </div>
                  <Button
                    // onClick={resetFilters}
                    className="bg-gold hover:bg-gold/90 text-charcoal"
                  >
                    Reset Filters
                  </Button>
                </div>
              )}

              {/* Infinite scroll trigger and loading indicator */}
              {properties.length > 0 && (
                <div className="mt-6">
                  {/* Intersection observer trigger */}
                  <div ref={loadMoreRef} className="h-4" />

                  {/* Loading more indicator */}
                  {loadingMore && (
                    <div className="text-center py-4">
                      <div className="text-warm-gray text-sm">
                        Loading more properties...
                      </div>
                    </div>
                  )}

                  {/* End of results indicator */}
                  {!hasMore && !loadingMore && properties.length > 0 && (
                    <div className="text-center py-4">
                      <div className="text-warm-gray text-sm">
                        You've reached the end of the results
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="h-[600px] border-beige shadow-sm overflow-hidden">
              <CardContent className="p-0 h-full relative">
                {!isClient ? (
                  // Show loading placeholder during SSR
                  <div className="flex items-center justify-center h-full bg-gray-100">
                    <div className="text-center">
                      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <div className="text-gray-600">Loading map...</div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Zoom Level Display */}
                    <div className="absolute top-4 left-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-lg border">
                      <div className="text-sm font-medium text-gray-700">
                        Zoom: {currentZoom.toFixed(1)}
                      </div>
                    </div>

                    {/* Progressive Map Loading Indicator */}
                    {loading && currentPage === 1 && (
                      <div className="absolute top-4 right-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-lg border">
                        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                          Loading properties...
                        </div>
                      </div>
                    )}

                    {/* Progressive Loading Indicator */}
                    {loadingMore && (
                      <div className="absolute top-4 right-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-lg border">
                        <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                          Loading more properties...
                        </div>
                      </div>
                    )}

                    {/* Map Properties Counter */}
                    {mapProperties.length > 0 && (
                      <div className="absolute bottom-4 right-4 z-[1000] bg-white px-3 py-2 rounded-lg shadow-lg border">
                        <div className="text-sm font-medium text-gray-700">
                          {mapProperties.length} properties on map
                          {mapHasMoreDevelopers && (
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                              {mapLoading ? (
                                <>
                                  <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                                  Loading more developers...
                                </>
                              ) : (
                                `Loading developer batch ${
                                  mapCurrentDeveloperPage + 1
                                }...`
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <MapContainer
                      key={`property-map-${mapKey}`} // Dynamic key to prevent re-initialization errors
                      className="custom-map english-map"
                      center={[
                        initialViewState.latitude,
                        initialViewState.longitude,
                      ]}
                      zoom={initialViewState.zoom}
                      style={{ height: "100%", width: "100%" }}
                      zoomControl={false}
                      ref={mapRef}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      />
                      <ZoomControl position="topright" />

                      {mapProperties
                        .filter((property) => property.coordinates)
                        .map((property, index) => {
                          const coords = parseCoordinates(property.coordinates);
                          const isHovered = hoveredProperty?.id === property.id;

                          return (
                            <Marker
                              key={`map-${property.id}-${index}`}
                              position={[coords.lat, coords.lng]}
                              icon={createCustomIcon(
                                isHovered,
                                getDeveloperLogoUrl(property.developer_logo)
                              )} // Use custom icon with developer logo
                              eventHandlers={{
                                click: () => {
                                  setSelectedProperty(property);
                                  // Don't interfere with list hover - only handle clicks
                                },
                              }}
                            >
                              {(selectedProperty?.id === property.id ||
                                isHovered) && (
                                <Popup>
                                  <div className="flex gap-3">
                                    <div className="flex flex-col gap-2">
                                      <ImageWithFallback
                                        src={getImageUrl(
                                          property.cover_image_url
                                        )}
                                        alt={property.name}
                                        className="w-16 h-12 object-cover rounded-lg flex-shrink-0"
                                      />
                                      {property.developer_logo && (
                                        <ImageWithFallback
                                          src={getDeveloperLogoUrl(
                                            property.developer_logo
                                          )}
                                          alt={`${property.developer} logo`}
                                          className="w-16 h-8 object-contain rounded bg-white p-1 flex-shrink-0"
                                        />
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <h4 className="mb-1 truncate text-sm text-[#D4AF37]">
                                        {property.name}
                                      </h4>
                                      <div className="flex items-center text-muted-foreground text-xs mb-1">
                                        <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
                                        <span className="truncate">
                                          {property.area}
                                        </span>
                                      </div>
                                      <div className="mb-2 text-sm text-[#D4AF37]">
                                        {property.min_price &&
                                        property.max_price
                                          ? `${property.price_currency} ${(
                                              property.min_price / 1000000
                                            ).toFixed(1)}M - ${(
                                              property.max_price / 1000000
                                            ).toFixed(1)}M`
                                          : property.min_price
                                          ? `${property.price_currency} ${(
                                              property.min_price / 1000000
                                            ).toFixed(1)}M+`
                                          : "Price on Request"}
                                      </div>
                                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                        <div className="flex items-center">
                                          <Building className="w-3 h-3 mr-1" />
                                          {property.developer}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </Popup>
                              )}
                            </Marker>
                          );
                        })}
                      <MapEvents />
                    </MapContainer>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-[#FAF8F4] rounded-2xl p-8">
            <h3 className="text-[#8b7355] mb-4">
              Can't Find What You're Looking For?
            </h3>
            <p className="text-warm-gray mb-6 max-w-2xl mx-auto">
              Our expert team has access to exclusive off-market properties and
              upcoming launches. Let us help you find your perfect investment
              opportunity.
            </p>
            <Button
              className="bg-gold hover:bg-gold/90 text-charcoal px-8 py-3"
              onClick={() => router.push(`/contact`)}
            >
              Speak with an Expert
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const createCustomIcon = (
  isHovered = false,
  imageUrl = "/placeholder-property.jpg"
) => {
  // Only create icon on client side
  if (typeof window === "undefined") {
    return null;
  }

  // Dynamically import Leaflet only on client side
  const L = require("leaflet");

  return L.divIcon({
    className: "custom-marker",
    html: `
          <div style="
            position: relative;
            width: ${isHovered ? "48px" : "20px"};
            height: ${isHovered ? "48px" : "20px"};
            background: #d4af37;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 300ms ease;
            overflow: hidden;
            ${
              isHovered
                ? "transform: scale(1.1); box-shadow: 0 25px 50px -12px rgba(255, 215, 0, 0.5);"
                : ""
            }
          " class="marker-inner ${isHovered ? "hovered" : ""}">
            <div style="
              width: ${isHovered ? "40px" : "16px"};
              height: ${isHovered ? "40px" : "16px"};
              background-image: url('${imageUrl}');
              background-size: cover;
              background-position: center;
              background-repeat: no-repeat;
              border-radius: 50%;
              transition: all 300ms ease;

            ">

            </div>
            ${
              isHovered
                ? `
              <div style="
                position: absolute;
                inset: 0;
                border-radius: 50%;
                background: #FFD700;
                opacity: 0.3;
                animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
              "></div>
              <div style="
                position: absolute;
                inset: 0;
                border-radius: 50%;
                background: rgba(255, 215, 0, 0.2);
                transform: scale(1.5);
                animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              "></div>
            `
                : ""
            }
          </div>
          <style>
            @keyframes ping {
              75%, 100% {
                transform: scale(2);
                opacity: 0;
              }
            }
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          </style>
        `,
    iconSize: [isHovered ? 48 : 16, isHovered ? 48 : 16], // Match width/height
    iconAnchor: [isHovered ? 24 : 8, isHovered ? 24 : 8], // Center of circle
    popupAnchor: [0, isHovered ? -24 : -16], // Popup above marker
  });
};
