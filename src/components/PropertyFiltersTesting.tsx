import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useOptimizedMapProperties } from "@/hooks/useOptimizedProperties";
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
import GoogleMutantLayer from "./GoogleMutantLayer";

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
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Key to force map re-initialization if needed

  // Use optimized map properties with caching
  const {
    properties: mapProperties,
    loading: mapLoading,
    error: mapError,
    hasMore: mapHasMore,
    loadNextBatch,
    refreshData: refreshMapData,
  } = useOptimizedMapProperties();

  // Infinite scroll pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Map loading state (developer-based) - now handled by optimized hook
  // Note: mapLoading is now provided by useOptimizedMapProperties hook
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

  // OLD FUNCTION - NOW USING OPTIMIZED HOOK
  // Map properties are now handled by useOptimizedMapProperties hook
  // This provides automatic caching, progressive loading, and 8-hour persistence

  // OLD FUNCTION - NOW USING OPTIMIZED HOOK
  // Map properties by developers are now handled by useOptimizedMapProperties hook

  useEffect(() => {
    // Set client-side flag to enable map rendering
    setIsClient(true);
    fetchProperties(1, 12);
    // Map properties are now automatically loaded by useOptimizedMapProperties hook
  }, []); // No dependencies needed since map loading is handled by hook

  // Separate effect for map cleanup to prevent initialization errors
  useEffect(() => {
    return () => {
      // Cleanup map instance when component unmounts
      if (mapRef.current) {
        try {
          // Properly remove all event listeners and layers
          mapRef.current.off();
          mapRef.current.remove();
        } catch (error) {
          // Silently handle cleanup errors and force re-initialization
          setMapKey((prev) => prev + 1);
        } finally {
          mapRef.current = null;
        }
      }
    };
  }, [mapKey]); // Re-run cleanup when mapKey changes

  // Effect to handle map initialization errors
  useEffect(() => {
    const handleMapError = () => {
      // Force map re-initialization on error
      setMapKey((prev) => prev + 1);
    };

    // Listen for unhandled map errors
    window.addEventListener("error", (event) => {
      if (
        event.message &&
        event.message.includes("Map container is already initialized")
      ) {
        event.preventDefault();
        handleMapError();
      }
    });

    return () => {
      window.removeEventListener("error", handleMapError);
    };
  }, []);

  // Auto-load map properties - now handled by optimized hook
  useEffect(() => {
    // The useOptimizedMapProperties hook automatically handles progressive loading
    // with 5-second delays between batches and 8-hour caching
    if (mapHasMore && !mapLoading) {
      console.log(
        `🚀 Optimized map loading: ${mapProperties.length} properties loaded`
      );

      // Trigger next batch if needed
      const timer = setTimeout(() => {
        if (mapHasMore && !mapLoading) {
          loadNextBatch();
        }
      }, 5000); // 5 seconds between batches as per optimized hook

      return () => clearTimeout(timer);
    }
  }, [mapHasMore, mapLoading, mapProperties.length, loadNextBatch]);

  // Handle z-index for hovered properties - bring to front
  useEffect(() => {
    if (typeof window === "undefined" || !mapRef.current) return;

    // Get all markers from the map
    const map = mapRef.current;

    // Reset all markers to default z-index
    map.eachLayer((layer: any) => {
      if (layer._propertyId && layer.setZIndexOffset) {
        layer.setZIndexOffset(0);
      }
    });

    // If there's a hovered property, bring its marker to front
    if (hoveredProperty) {
      map.eachLayer((layer: any) => {
        if (layer._propertyId === hoveredProperty.id && layer.setZIndexOffset) {
          layer.setZIndexOffset(1000);
        }
      });
    }
  }, [hoveredProperty]);

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

                        <div className="flex flex-wrap gap-2 mt-2">
                          {property.status && (
                            <Badge
                              className={`text-white border-0 text-xs font-medium px-2 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow ${
                                property.status === "Presale"
                                  ? "bg-[#D4AF37]"
                                  : property.status === "Under construction"
                                  ? "bg-[#FF6900]"
                                  : property.status === "Completed"
                                  ? "bg-[#8b7355]"
                                  : "bg-[#8b7355]"
                              }`}
                            >
                              {property.status}
                            </Badge>
                          )}

                          {property.sale_status && (
                            <Badge
                              className={`text-white border-0 text-xs font-medium px-2 py-1 rounded-full shadow-sm hover:shadow-md transition-shadow ${
                                property.sale_status === "On sale"
                                  ? "bg-[#D4AF37]"
                                  : property.sale_status === "Start of sales"
                                  ? "bg-[#FF6900]"
                                  : property.sale_status === "Presale(EOI)"
                                  ? "bg-[#8b7355]"
                                  : "bg-[#8b7355]"
                              }`}
                            >
                              {property.sale_status || "Available"}
                            </Badge>
                          )}
                        </div>
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
                      key={`property-map-${mapKey}-${isClient}`} // Dynamic key to prevent re-initialization errors
                      className="custom-map english-map"
                      center={[
                        initialViewState.latitude,
                        initialViewState.longitude,
                      ]}
                      zoom={initialViewState.zoom}
                      style={{ height: "100%", width: "100%" }}
                      zoomControl={false}
                      ref={(map) => {
                        // Safely assign map reference
                        if (map && !mapRef.current) {
                          mapRef.current = map;
                        }
                      }}
                      whenReady={() => {
                        // MapContainer will call whenReady without args per types; use ref from whenCreated above
                        if (mapRef.current) return;
                      }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                      />

                      {/* <GoogleMutantLayer mapTypeId="roadmap" /> */}
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
                                getDeveloperLogoUrl(property.developer_logo),
                                currentZoom
                              )} // Use custom icon with developer logo and zoom-based sizing
                              eventHandlers={{
                                click: () => {
                                  setSelectedProperty(property);
                                  // Don't interfere with list hover - only handle clicks
                                },
                                add: (e) => {
                                  // Store reference to marker for z-index manipulation
                                  const marker = e.target;
                                  marker._propertyId = property.id;

                                  // Apply z-index based on hover state
                                  if (isHovered) {
                                    marker.setZIndexOffset(1000);
                                  }
                                },
                              }}
                            >
                              {(selectedProperty?.id === property.id ||
                                isHovered) && (
                                <Popup>
                                  <div
                                    className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                                    onClick={() =>
                                      router.push(`/properties/${property.id}`)
                                    }
                                    title="Click to view property details"
                                  >
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
                                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                                        <div className="flex items-center">
                                          <Building className="w-3 h-3 mr-1" />
                                          {property.developer}
                                        </div>
                                      </div>
                                      <button className="w-full bg-[#D4AF37] hover:bg-[#B8941F] text-white text-xs py-1 px-2 rounded transition-colors">
                                        View Details →
                                      </button>
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
  imageUrl = "/placeholder-property.jpg",
  zoomLevel = 10
) => {
  // Only create icon on client side
  if (typeof window === "undefined") {
    return null;
  }

  // Dynamically import Leaflet only on client side
  const L = require("leaflet");

  // Calculate size based on zoom level (minimum 16px, maximum 40px)
  const baseSize = Math.max(16, Math.min(40, (zoomLevel - 8) * 4 + 16));
  const hoveredSize = Math.max(32, Math.min(64, baseSize * 1.5));
  const actualSize = isHovered ? hoveredSize : baseSize;
  const innerSize = actualSize - 8; // Account for border

  return L.divIcon({
    className: "custom-marker",
    html: `
          <div style="
            position: relative;
            width: ${actualSize}px;
            height: ${actualSize}px;
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
              width: ${innerSize}px;
              height: ${innerSize}px;
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
    iconSize: [actualSize, actualSize], // Match width/height
    iconAnchor: [actualSize / 2, actualSize / 2], // Center of circle
    popupAnchor: [0, -actualSize / 2], // Popup above marker
    zIndexOffset: isHovered ? 1000 : 0, // Bring hovered markers to front
  });
};
