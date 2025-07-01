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

interface MarketInfoProps {
  onAreaSelect?: (area: any) => void;
}

export function MarketInfo({ onAreaSelect }: MarketInfoProps) {
  const [isReportDialogOpen, setIsReportDialogOpen] = useState(false);
  const [allAreas, setAllAreas] = useState<any[]>([]);
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [areasWithProperties, setAreasWithProperties] = useState<any[]>([]);
  const [areasLoading, setAreasLoading] = useState(true);
  const [propertiesLoading, setPropertiesLoading] = useState(false);
  const router = useRouter();

  // Fetch all areas and properties
  useEffect(() => {
    const fetchData = async () => {
      try {
        setAreasLoading(true);
        setPropertiesLoading(true);

        // Fetch areas and properties in parallel
        const [areasResponse, propertiesResponse] = await Promise.all([
          axios.get("/api/areas"),
          axios.get("/api/properties"),
        ]);

        // Process areas
        if (areasResponse.data.success) {
          setAllAreas(areasResponse.data.data);
        }

        // Process properties
        let properties = [];
        if (propertiesResponse.data.success && propertiesResponse.data.data) {
          properties =
            propertiesResponse.data.data.items ||
            propertiesResponse.data.data ||
            [];
        } else if (Array.isArray(propertiesResponse.data)) {
          properties = propertiesResponse.data;
        }

        setAllProperties(properties);

        // Calculate property counts per area using frontend filtering
        if (areasResponse.data.success && properties.length > 0) {
          calculateAreaPropertyCounts(areasResponse.data.data, properties);
        }
      } catch (error) {
        console.error("❌ Error fetching data:", error);
      } finally {
        setAreasLoading(false);
        setPropertiesLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Fallback market data with comprehensive information for each area (used if API fails)
  const fallbackAreas = [
    {
      name: "Dubai Marina",
      growth: "+18.5%",
      avgPrice: "AED 1,450 /sq ft",
      image:
        "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-blue-600/70 via-blue-800/60 to-black/80",
      description:
        "Waterfront luxury living with world-class marina views and premium amenities.",
      marketCap: "AED 45.2B",
      totalProjects: 156,
      propertyCount: 156,
      averageRoi: "8.2%",
    },
    {
      name: "Downtown Dubai",
      growth: "+22.3%",
      avgPrice: "AED 1,680 /sq ft",
      image:
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-amber-600/70 via-orange-700/60 to-black/80",
      description:
        "The heart of Dubai with iconic skyscrapers and unmatched urban sophistication.",
      marketCap: "AED 67.8B",
      totalProjects: 189,
      propertyCount: 189,
      averageRoi: "9.1%",
    },
    {
      name: "Business Bay",
      growth: "+15.7%",
      avgPrice: "AED 1,280 /sq ft",
      image:
        "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-emerald-600/70 via-teal-700/60 to-black/80",
      description:
        "Dubai's central business district offering modern living and commercial excellence.",
      marketCap: "AED 38.9B",
      totalProjects: 134,
      propertyCount: 134,
      averageRoi: "8.8%",
    },
    {
      name: "Palm Jumeirah",
      growth: "+25.2%",
      avgPrice: "AED 2,100 /sq ft",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-rose-600/70 via-pink-700/60 to-black/80",
      description:
        "Ultra-luxury island living with exclusive villas and world-renowned resorts.",
      marketCap: "AED 89.4B",
      totalProjects: 78,
      propertyCount: 78,
      averageRoi: "7.5%",
    },
    {
      name: "JBR",
      growth: "+19.8%",
      avgPrice: "AED 1,520 /sq ft",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      gradient: "from-purple-600/70 via-indigo-700/60 to-black/80",
      description:
        "Beachfront lifestyle with luxury towers and vibrant beach culture.",
      marketCap: "AED 52.3B",
      totalProjects: 98,
      propertyCount: 98,
      averageRoi: "8.4%",
    },
  ];

  const marketStats = [
    {
      title: "Total Market Value",
      value: "AED 320B",
      change: "+12.5%",
      icon: DollarSign,
      color: "text-gold",
    },
    {
      title: "Active Projects",
      value: "1,247",
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
    return allProperties.filter((property) => {
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

  // Use real areas with properties if available, otherwise fallback to static data
  const topAreas =
    areasWithProperties.length > 0
      ? areasWithProperties.map((area) => ({
          name: area.name,
          propertyCount: area.propertyCount,
          growth: "+12.5%", // Default growth rate
          avgPrice: "AED 1,200 /sq ft", // Default price
          image:
            "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          gradient: "from-blue-600/70 via-blue-800/60 to-black/80",
          description: `Discover ${area.propertyCount} premium properties in ${area.name}`,
          marketCap: "AED 25.2B",
          totalProjects: area.propertyCount,
          averageRoi: "7.5%",
        }))
      : fallbackAreas;

  return (
    <section
      id="market-info"
      className="section-padding bg-gradient-to-br from-ivory via-beige/30 to-ivory"
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

        {/* View Market Report Button */}
        <div className="text-center mb-16">
          <Dialog
            open={isReportDialogOpen}
            onOpenChange={setIsReportDialogOpen}
          >
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold/90 text-charcoal px-8 py-3 rounded-xl shadow-[0_4px_20px_-2px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_32px_-4px_rgba(212,175,55,0.4)] transition-all duration-300 hover:-translate-y-1">
                <FileText className="w-5 h-5 mr-3" />
                View Market Report
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#8b7355]">
                  Download Market Report
                </DialogTitle>
                <DialogDescription className="text-warm-gray">
                  Get the latest Dubai real estate market insights and analysis
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#8b7355] font-medium">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full p-3 border border-beige rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#8b7355] font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-3 border border-beige rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#8b7355] font-medium">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+971 50 123 4567"
                    className="w-full p-3 border border-beige rounded-lg focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setIsReportDialogOpen(false)}
                  className="border-warm-gray/30 text-warm-gray hover:bg-warm-gray/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setIsReportDialogOpen(false)}
                  className="bg-gold hover:bg-gold/90 text-charcoal"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
            {/* Loading State */}
            {(areasLoading || propertiesLoading) && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
                  <span className="text-warm-gray">
                    {areasLoading
                      ? "Loading areas..."
                      : "Loading properties..."}
                  </span>
                </div>
              </div>
            )}

            {/* Areas Display */}
            {!areasLoading && (
              <div className="overflow-x-auto pb-4">
                <div className="flex gap-8 min-w-max">
                  {topAreas.map((area, index) => (
                    <div
                      key={index}
                      className="group cursor-pointer transition-all duration-300 hover:-translate-y-2 flex-shrink-0"
                      onClick={() => handleAreaClick(area)}
                    >
                      <Card className="overflow-hidden rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] transition-all duration-300 border-0 h-80 w-72">
                        <div className="relative h-full">
                          {/* Background Image */}
                          <ImageWithFallback
                            src={area.image}
                            alt={area.name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />

                          {/* Gradient Overlay */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-t ${area.gradient}`}
                          ></div>

                          {/* Content Overlay */}
                          <div className="relative h-full flex flex-col justify-between p-6 text-white">
                            {/* Top Content */}
                            <div>
                              <h4 className="text-xl text-white group-hover:text-gold transition-colors">
                                {area.name}
                              </h4>
                              <p className="text-white/70 text-sm mt-1">
                                {area.propertyCount || area.totalProjects}{" "}
                                Properties
                              </p>
                            </div>

                            {/* Bottom Content */}
                            <div className="space-y-3">
                              <div className="text-4xl text-gold group-hover:scale-105 transition-transform">
                                {area.growth}
                              </div>
                              <div className="text-lg text-white/90">
                                {area.avgPrice}
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
          <div className="inline-flex items-center space-x-2 bg-beige/50 rounded-full px-6 py-3 mb-6">
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
