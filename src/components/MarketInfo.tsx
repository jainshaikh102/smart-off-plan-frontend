import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  TrendingUp,
  Users,
  Building,
  Globe,
  ArrowRight,
  MapPin,
  Download,
  FileText,
  BarChart3,
  Calendar,
  DollarSign,
  Target,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Skeleton Loading Component for Area Cards
const AreaCardSkeleton = () => {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] border-0 h-80 w-72 animate-pulse">
      <div className="relative h-full">
        {/* Background Image skeleton */}
        <div className="absolute inset-0 w-full h-full bg-gray-200"></div>

        {/* Gradient Overlay skeleton */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-400/70 via-gray-500/60 to-gray-300/80"></div>

        {/* Content Overlay skeleton */}
        <div className="relative h-full flex flex-col justify-between p-6">
          {/* Top Content skeleton */}
          <div>
            <div className="h-6 bg-gray-300 rounded mb-1 w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>

          {/* Bottom Content skeleton */}
          <div className="space-y-3">
            <div className="h-10 bg-gray-300 rounded w-20"></div>
            <div className="h-5 bg-gray-300 rounded w-32"></div>

            {/* Hover Details skeleton */}
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
              <div className="h-4 bg-gray-300 rounded w-28"></div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

interface MarketInfoProps {
  onAreaSelect?: (area: any) => void;
  // Optional props for shared data to avoid multiple API calls
  allProperties?: any[];
  propertiesLoading?: boolean;
  propertiesError?: string | null;
}

export function MarketInfo({
  onAreaSelect,
  allProperties: sharedAllProperties,
  propertiesLoading,
  propertiesError,
}: MarketInfoProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [allAreas, setAllAreas] = useState<any[]>([]);
  const [localAllProperties, setLocalAllProperties] = useState<any[]>([]);
  const [areasWithProperties, setAreasWithProperties] = useState<any[]>([]);
  const [areasLoading, setAreasLoading] = useState(true);
  const [localPropertiesLoading, setLocalPropertiesLoading] = useState(false);
  const router = useRouter();

  // Use shared properties if available, otherwise use local state
  const effectiveAllProperties = sharedAllProperties || localAllProperties;
  const effectivePropertiesLoading =
    propertiesLoading !== undefined
      ? propertiesLoading
      : localPropertiesLoading;

  // Fetch all areas and properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        setAreasLoading(true);

        // Only fetch properties if not provided via props
        if (!sharedAllProperties) {
          setLocalPropertiesLoading(true);
        }

        // Fetch areas and optionally properties
        const requests = [axios.get("/api/areas")];
        if (!sharedAllProperties) {
          // Use the new /all endpoint to get ALL properties without pagination
          console.log(
            "🔄 MarketInfo: Fetching all properties from /api/properties/all"
          );
          requests.push(axios.get("/api/properties/all"));
        }

        const responses = await Promise.all(requests);
        const areasResponse = responses[0];
        const propertiesResponse = responses[1];

        console.log("📡 API Responses received:", {
          areasSuccess: areasResponse?.data?.success,
          areasCount: areasResponse?.data?.data?.length,
          propertiesSuccess: propertiesResponse?.data?.success,
          propertiesCount: propertiesResponse?.data?.data?.length,
        });

        // Process areas
        if (areasResponse.data.success) {
          setAllAreas(areasResponse.data.data);
        }

        // Process properties only if not provided via props
        let properties = effectiveAllProperties;
        if (!sharedAllProperties && propertiesResponse) {
          console.log("🔍 Raw API response:", propertiesResponse.data);

          if (propertiesResponse.data.success && propertiesResponse.data.data) {
            // The /all endpoint returns all properties directly in data array (no pagination)
            properties = propertiesResponse.data.data || [];
            console.log(
              `✅ Successfully parsed ${properties.length} properties from API response`
            );

            // Log first property structure for debugging
            if (properties.length > 0) {
              console.log("🏠 First property structure:", {
                id: properties[0].id,
                name: properties[0].name,
                min_price: properties[0].min_price,
                max_price: properties[0].max_price,
                area: properties[0].area,
                developer: properties[0].developer,
              });
            }
          } else if (Array.isArray(propertiesResponse.data)) {
            properties = propertiesResponse.data;
            console.log(
              `✅ Direct array response with ${properties.length} properties`
            );
          } else {
            console.error(
              "❌ Unexpected API response structure:",
              propertiesResponse.data
            );
            properties = [];
          }
          setLocalAllProperties(properties);
          console.log(
            `🏠 Final: Set ${properties.length} properties in local state`
          );
        }

        // Calculate property counts per area using frontend filtering
        if (areasResponse.data.success && properties.length > 0) {
          calculateAreaPropertyCounts(areasResponse.data.data, properties);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
        // Set empty arrays as fallback
        if (!sharedAllProperties) {
          setLocalAllProperties([]);
        }
        setAllAreas([]);
      } finally {
        setAreasLoading(false);
        if (!sharedAllProperties) {
          setLocalPropertiesLoading(false);
        }
      }
    };

    fetchData();
  }, [sharedAllProperties]);

  // Recalculate area property counts when shared properties change
  useEffect(() => {
    if (sharedAllProperties && allAreas.length > 0) {
      calculateAreaPropertyCounts(allAreas, sharedAllProperties);
    }
  }, [sharedAllProperties, allAreas]);

  // Calculate property counts per area using frontend filtering
  const calculateAreaPropertyCounts = (areas: any[], properties: any[]) => {
    try {
      console.log("🔢 Calculating property counts for areas...");
      console.log("📊 Total properties:", properties.length);
      console.log("🏙️ Total areas:", areas.length);

      const areasWithCounts = areas.map((area) => {
        // Filter properties by area name (case-insensitive)
        const areaProperties = properties.filter((property) => {
          const propertyArea = property.area?.toLowerCase().trim();
          const areaName = area.name?.toLowerCase().trim();

          // Check for exact match or if area name is contained in property area
          return (
            propertyArea === areaName ||
            propertyArea?.includes(areaName) ||
            areaName?.includes(propertyArea)
          );
        });

        return {
          ...area,
          propertyCount: areaProperties.length,
        };
      });

      // Filter areas with properties, sort by property count and take top 6
      const sortedAreas = areasWithCounts
        .filter((area) => area.propertyCount > 0) // Only show areas with properties
        .sort((a, b) => b.propertyCount - a.propertyCount)
        .slice(0, 6);

      console.log(
        "✅ Top areas with properties:",
        sortedAreas.map((a) => `${a.name}: ${a.propertyCount}`)
      );
      setAreasWithProperties(sortedAreas);
    } catch (error) {
      console.error("❌ Error calculating property counts:", error);
    }
  };

  // Calculate dynamic market statistics
  const calculateMarketStats = () => {
    const properties = effectiveAllProperties || [];

    console.log(
      `📊 MarketInfo: Calculating stats for ${properties.length} properties`
    );
    console.log("🔍 Properties array:", properties.slice(0, 2)); // Log first 2 properties

    // Calculate total market value (sum of all min_price values)
    let totalMarketValue = 0;
    let propertiesWithPrice = 0;

    properties.forEach((property, index) => {
      // Try different possible field names for price
      const minPrice =
        property.min_price || property.min_price_aed || property.minPrice || 0;

      if (minPrice > 0) {
        totalMarketValue += minPrice;
        propertiesWithPrice++;
      }

      // Log first few properties for debugging
      if (index < 5) {
        console.log(`🏠 Property ${index + 1}:`, {
          id: property.id,
          name: property.name,
          min_price: property.min_price,
          min_price_aed: property.min_price_aed,
          minPrice: property.minPrice,
          finalMinPrice: minPrice,
        });
      }
    });

    console.log(
      `💰 Total Market Value: ${totalMarketValue} (from ${propertiesWithPrice} properties with prices)`
    );

    // Format the total market value
    const formatMarketValue = (value: number) => {
      if (value >= 1000000000) {
        return `AED ${(value / 1000000000).toFixed(1)}B`;
      } else if (value >= 1000000) {
        return `AED ${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `AED ${(value / 1000).toFixed(1)}K`;
      } else if (value > 0) {
        return `AED ${value.toLocaleString()}`;
      } else {
        return "AED 0";
      }
    };

    // Count active projects (total number of properties)
    const activeProjectsCount = properties.length;

    console.log(`🏢 Active Projects Count: ${activeProjectsCount}`);

    const result = {
      totalMarketValue: formatMarketValue(totalMarketValue),
      activeProjectsCount: activeProjectsCount.toLocaleString(),
    };

    console.log("📈 Final calculated stats:", result);

    return result;
  };

  const { totalMarketValue, activeProjectsCount } = calculateMarketStats();

  const marketStats = [
    {
      title: "Total Market Value",
      value: effectivePropertiesLoading ? "Loading..." : totalMarketValue,
      change: "+12.5%",
      icon: DollarSign,
      color: "text-gold",
    },
    {
      title: "Active Projects",
      value: effectivePropertiesLoading ? "Loading..." : activeProjectsCount,
      change: "+8.3%",
      icon: Building,
      color: "text-[#8b7355]",
    },
    {
      title: "International Investors",
      value: "89,450",
      change: "+15.7%",
      icon: Users,
      color: "text-gold",
    },
    {
      title: "Average ROI",
      value: "8.4%",
      change: "+2.1%",
      icon: TrendingUp,
      color: "text-warm-gray",
    },
  ];

  // Get properties for a specific area using frontend filtering
  const getPropertiesByArea = (areaName: string) => {
    return effectiveAllProperties.filter((property: any) => {
      const propertyArea = property.area?.toLowerCase().trim();
      const searchArea = areaName?.toLowerCase().trim();

      return (
        propertyArea === searchArea ||
        propertyArea?.includes(searchArea) ||
        searchArea?.includes(propertyArea)
      );
    });
  };

  const handleAreaClick = (area: any) => {
    // Navigate to area-specific page
    const areaName = area.name || area.area;
    if (areaName) {
      router.push(`/area/${encodeURIComponent(areaName)}`);
    }

    // Also call the callback if provided with area properties
    if (onAreaSelect) {
      const areaProperties = getPropertiesByArea(areaName);
      onAreaSelect({
        ...area,
        properties: areaProperties,
      });
    }
  };

  return (
    <section
      id="market-info"
      className="section-padding bg-gradient-to-b from-ivory via-beige/30 to-white"
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gold/10 rounded-full px-6 py-3 mb-6">
            <BarChart3 className="w-5 h-5 text-gold" />
            <span className="text-[#8b7355] font-medium">
              Market Intelligence
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl text-[#8b7355] mb-6  text-[40px]">
            Dubai Real Estate Market Insights
          </h2>

          <p className="text-xl text-warm-gray max-w-3xl mx-auto leading-relaxed  text-[16px]">
            Comprehensive market analysis and investment opportunities across
            Dubai's most prestigious neighborhoods
          </p>
        </div>

        {/* Market Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {marketStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] transition-all duration-300 hover:-translate-y-1"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                      <IconComponent className="w-6 h-6 text-gold" />
                    </div>
                    <div className="text-gold text-sm font-medium">
                      {stat.change}
                    </div>
                  </div>
                  <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                    {stat.value}
                  </div>
                  <div className="text-warm-gray font-medium">{stat.title}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Top Performing Areas */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl text-[#8b7355] mb-3">
                Top Performing Areas
              </h3>
              <p className="text-warm-gray">
                Prime locations showing exceptional growth and investment
                potential
              </p>
            </div>
          </div>

          {/* Areas Carousel */}
          <div className="relative">
            {/* Loading State - Show skeleton cards */}
            {areasLoading || propertiesLoading ? (
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-8 min-w-max">
                  <div className="flex-shrink-0">
                    <AreaCardSkeleton />
                  </div>
                  <div className="flex-shrink-0">
                    <AreaCardSkeleton />
                  </div>
                  <div className="flex-shrink-0">
                    <AreaCardSkeleton />
                  </div>
                  <div className="flex-shrink-0">
                    <AreaCardSkeleton />
                  </div>
                </div>
              </div>
            ) : areasWithProperties.length > 0 ? (
              /* Areas Display - Only show when data is loaded and available */
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-8 min-w-max">
                  {areasWithProperties.map((area, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer transition-all duration-300 hover:-translate-y-2 flex-shrink-0"
                      onClick={() => handleAreaClick(area)}
                    >
                      <Card className="overflow-hidden rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] transition-all duration-300 border-0 h-80 w-72">
                        <div className="relative h-full">
                          {/* Background Image */}
                          <ImageWithFallback
                            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                            alt={area.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />

                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-blue-600/70 via-blue-800/60 to-black/80"></div>

                          {/* Content Overlay */}
                          <div className="relative h-full flex flex-col justify-between p-6 text-white">
                            {/* Top Content */}
                            <div>
                              <h4 className="text-xl text-white group-hover:text-gold transition-colors">
                                {area.name}
                              </h4>
                              <p className="text-white/70 text-sm mt-1">
                                {area.propertyCount} Properties
                              </p>
                            </div>

                            {/* Bottom Content */}
                            <div className="space-y-3">
                              <div className="text-4xl text-gold group-hover:scale-105 transition-transform">
                                +12.5%
                              </div>
                              <div className="text-lg text-white/90">
                                AED 1,200 /sq ft
                              </div>

                              {/* Hover Details */}
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex items-center text-white/80 text-sm">
                                  <ArrowRight className="w-4 h-4 mr-2" />
                                  <span>View Market Details</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* No data available state */
              <div className="text-center py-12">
                <div className="text-warm-gray mb-4">
                  <Building className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">No areas available</p>
                  <p className="text-sm">
                    Area data will appear here once loaded from the API.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Market Insights */}
        <div className="max-w-3xl mx-auto">
          {/* Investment Opportunities */}
          <Card className="border-gold/20 bg-gradient-to-br from-gold/5 to-light-gold/10 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <h4 className="text-xl text-[#8b7355]">
                    Investment Opportunities
                  </h4>
                  <p className="text-warm-gray text-sm">
                    Current market highlights
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl">
                  <div>
                    <div className="text-[#8b7355] font-medium">
                      Off-Plan Premium
                    </div>
                    <div className="text-warm-gray text-sm">
                      High-end developments
                    </div>
                  </div>
                  <div className="text-gold font-bold">8.5% ROI</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl">
                  <div>
                    <div className="text-[#8b7355] font-medium">
                      Waterfront Luxury
                    </div>
                    <div className="text-warm-gray text-sm">
                      Marina & beachfront
                    </div>
                  </div>
                  <div className="text-gold font-bold">9.2% ROI</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/60 rounded-xl">
                  <div>
                    <div className="text-[#8b7355] font-medium">
                      Business Districts
                    </div>
                    <div className="text-warm-gray text-sm">
                      Commercial hubs
                    </div>
                  </div>
                  <div className="text-gold font-bold">7.8% ROI</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Global Recognition */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 bg-[#f8f5f1] rounded-full px-6 py-3 mb-6">
            <Globe className="w-5 h-5 text-gold" />
            <span className="text-[#8b7355] font-medium">
              Global Recognition
            </span>
          </div>

          <h3 className="text-2xl text-[#8b7355] mb-4">
            Dubai: World's Leading Investment Destination
          </h3>

          <p className="text-warm-gray max-w-2xl mx-auto mb-8">
            Recognized globally for its innovative development projects,
            investor-friendly policies, and exceptional returns on real estate
            investments.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl text-gold font-bold mb-2">#1</div>
              <div className="text-warm-gray text-sm">
                Global Investment Hub
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gold font-bold mb-2">0%</div>
              <div className="text-warm-gray text-sm">Income Tax</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gold font-bold mb-2">100%</div>
              <div className="text-warm-gray text-sm">Foreign Ownership</div>
            </div>
            <div className="text-center">
              <div className="text-2xl text-gold font-bold mb-2">200+</div>
              <div className="text-warm-gray text-sm">Nationalities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
