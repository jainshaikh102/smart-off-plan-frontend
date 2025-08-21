import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Navbar } from "./Navbar";
import {
  ArrowLeft,
  MapPin,
  TrendingUp,
  Building2,
  Users,
  DollarSign,
  Calendar,
  Target,
  Zap,
  Car,
  Train,
  Plane,
  ShoppingBag,
  GraduationCap,
  Heart,
  Waves,
  Download,
  Share2,
  Bookmark,
  ExternalLink,
  BarChart3,
  PieChart,
  LineChart,
  Home,
  Navigation,
  Clock,
  Shield,
  Award,
  Globe,
  Phone,
  Mail,
  Bed,
  Bath,
  Square,
  ArrowUp,
  ArrowDown,
  TrendingDown,
  ChevronLeft,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AreaDetailPageProps {
  area: any;
  onBack: () => void;
  onProjectSelect: (project: any) => void;
  onNavigate?: (page: string) => void;
  onLogoClick?: () => void;
}

export function AreaDetailPage({
  area,
  onBack,
  onProjectSelect,
  onNavigate,
  onLogoClick,
}: AreaDetailPageProps) {
  // Mock detailed data for the area
  const areaDetails = {
    ...area,
    description: `${area.area} stands as one of Dubai's most prestigious neighborhoods, offering a perfect blend of luxury living, world-class amenities, and strategic location. This vibrant district has become a magnet for international investors seeking premium real estate opportunities with exceptional growth potential and rental yields.`,

    // Nearby Amenities
    amenities: [
      {
        name: "Dubai Mall",
        distance: "5 min",
        type: "Shopping",
        icon: ShoppingBag,
      },
      {
        name: "Metro Station",
        distance: "3 min",
        type: "Transport",
        icon: Train,
      },
      {
        name: "Beach Access",
        distance: "10 min",
        type: "Recreation",
        icon: Waves,
      },
      {
        name: "International Schools",
        distance: "8 min",
        type: "Education",
        icon: GraduationCap,
      },
      { name: "Healthcare", distance: "6 min", type: "Medical", icon: Heart },
      {
        name: "Business District",
        distance: "12 min",
        type: "Business",
        icon: Building2,
      },
      { name: "Airport", distance: "25 min", type: "Transport", icon: Plane },
      {
        name: "Golf Course",
        distance: "15 min",
        type: "Recreation",
        icon: Target,
      },
    ],

    // Featured Projects in Area
    featuredProjects: [
      {
        id: 1,
        name: `${area.area} Heights`,
        developer: "Emaar Properties",
        price: "AED 1,200,000",
        image:
          "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        bedrooms: "2 BR",
        bathrooms: 2,
        size: "1,000 sq ft",
        completion: "Q4 2025",
        roi: "8.5%",
      },
      {
        id: 2,
        name: `${area.area} Residences`,
        developer: "Dubai Properties",
        price: "AED 2,500,000",
        image:
          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        bedrooms: "3 BR",
        bathrooms: 3,
        size: "1,667 sq ft",
        completion: "Q2 2026",
        roi: "9.2%",
      },
      {
        id: 3,
        name: `${area.area} Towers`,
        developer: "Damac Properties",
        price: "AED 950,000",
        image:
          "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        bedrooms: "1 BR",
        bathrooms: 1,
        size: "704 sq ft",
        completion: "Q3 2025",
        roi: "8.8%",
      },
      {
        id: 4,
        name: `${area.area} Premium`,
        developer: "Nakheel",
        price: "AED 3,200,000",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        bedrooms: "4 BR",
        bathrooms: 4,
        size: "2,200 sq ft",
        completion: "Q1 2027",
        roi: "7.8%",
      },
      {
        id: 5,
        name: `${area.area} Elite`,
        developer: "Omniyat",
        price: "AED 1,800,000",
        image:
          "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        bedrooms: "2 BR",
        bathrooms: 2,
        size: "1,400 sq ft",
        completion: "Q4 2026",
        roi: "9.1%",
      },
      {
        id: 6,
        name: `${area.area} Luxury`,
        developer: "Sobha Group",
        price: "AED 4,500,000",
        image:
          "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        bedrooms: "5+ BR",
        bathrooms: 5,
        size: "3,500 sq ft",
        completion: "Q3 2026",
        roi: "7.5%",
      },
    ],
  };

  const handleBackToMarketInfo = () => {
    // Navigate back to home page and scroll to market info section
    onBack();
    // Small delay to ensure page transition completes before scrolling
    setTimeout(() => {
      // Check if document is available (client-side)
      if (typeof document === "undefined") return;

      const marketElement = document.getElementById("market-info");
      if (marketElement) {
        marketElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Main Navigation */}
      <Navbar
        onNavigate={onNavigate || (() => {})}
        onLogoClick={onLogoClick || (() => {})}
        currentPage="area-detail"
      />

      {/* Enhanced Breadcrumb Header */}
      <header className="bg-white border-b border-beige shadow-sm sticky top-16 z-40">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-warm-gray flex items-center">
                <Home className="w-4 h-4 mr-1" />
                <span>Home</span>
                <ChevronLeft className="w-3 h-3 mx-2 rotate-180" />
                <span>Market Info</span>
                <ChevronLeft className="w-3 h-3 mx-2 rotate-180" />
                <span className="text-[#8b7355] font-medium">{area.area}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="border-gold/30 text-gold hover:bg-gold/10"
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Save
              </Button>

              <Button className="bg-[#8b7355] hover:bg-[#8b7355]/90 text-white">
                <Download className="w-4 h-4 mr-2" />
                Area Guide
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Enhanced Back Navigation */}
      <section className="bg-beige py-20 relative">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center space-x-3 mb-6">
              <Badge className="bg-gold text-charcoal px-4 py-2">
                <MapPin className="w-4 h-4 mr-2" />
                Premium Location
              </Badge>
              <Badge
                variant="outline"
                className="border-[#8b7355]/30 text-[#8b7355] px-4 py-2"
              >
                Market Leader
              </Badge>
            </div>

            <h1 className="text-5xl lg:text-6xl mb-6 text-[#8b7355]">
              {area.area}
            </h1>

            <p className="text-xl text-warm-gray mb-8 leading-relaxed">
              {areaDetails.description}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl text-gold mb-2 font-bold">
                  {area.growth}
                </div>
                <div className="text-[#8b7355] text-sm">Price Growth</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-gold mb-2 font-bold">
                  {area.avgPrice}
                </div>
                <div className="text-[#8b7355] text-sm">Average Price</div>
              </div>
              <div className="text-center">
                <div className="text-3xl text-gold mb-2 font-bold">156</div>
                <div className="text-[#8b7355] text-sm">Active Projects</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container py-16 space-y-20">
        {/* Location & Amenities Section */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-gold/10 rounded-full px-6 py-3 mb-6">
              <MapPin className="w-5 h-5 text-gold" />
              <span className="text-[#8b7355] font-medium">
                Location & Connectivity
              </span>
            </div>
            <h2 className="text-3xl text-[#8b7355] mb-4">
              Nearby Amenities & Infrastructure
            </h2>
            <p className="text-warm-gray max-w-2xl mx-auto">
              World-class amenities and infrastructure within minutes of{" "}
              {area.area}, ensuring convenience and luxury living
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border border-beige shadow-[0_8px_32px_-4px_rgba(139,115,85,0.08)] overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-beige/30 to-ivory border-b border-beige/50 pb-6">
                <CardTitle className="text-[#8b7355] flex items-center text-xl">
                  <Navigation className="w-5 h-5 mr-3 text-gold" />
                  Strategic Location Benefits
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {areaDetails.amenities.map((amenity: any, index: number) => {
                    const IconComponent = amenity.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center space-x-4 p-4 bg-gradient-to-r from-beige/20 to-ivory/50 rounded-xl hover:from-beige/30 hover:to-ivory/70 transition-all duration-300 group"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-gold/20 to-gold/30 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-5 h-5 text-gold" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-[#8b7355] font-semibold">
                            {amenity.name}
                          </h4>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-warm-gray text-sm">
                              {amenity.type}
                            </p>
                            <div className="text-gold font-medium text-sm">
                              {amenity.distance}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Connectivity Highlights */}
                <div className="mt-8 p-6 bg-gradient-to-br from-gold/5 to-gold/10 rounded-xl border border-gold/20">
                  <h4 className="text-[#8b7355] font-semibold mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-gold" />
                    Quick Access Times
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-gold">5 min</div>
                      <div className="text-warm-gray text-sm">City Center</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gold">10 min</div>
                      <div className="text-warm-gray text-sm">Beach</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gold">15 min</div>
                      <div className="text-warm-gray text-sm">Airport</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gold">3 min</div>
                      <div className="text-warm-gray text-sm">Metro</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-[#8b7355]/10 rounded-full px-6 py-3 mb-6">
              <Building2 className="w-5 h-5 text-[#8b7355]" />
              <span className="text-[#8b7355] font-medium">
                Premium Developments
              </span>
            </div>
            <h2 className="text-3xl text-[#8b7355] mb-4">
              Featured Projects in {area.area}
            </h2>
            <p className="text-warm-gray max-w-2xl mx-auto">
              Exceptional developments currently available for investment in
              this prestigious location, offering world-class amenities and
              guaranteed returns
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {areaDetails.featuredProjects.map((project: any) => (
              <Card
                key={project.id}
                className="group cursor-pointer border border-beige hover:shadow-[0_12px_48px_-4px_rgba(139,115,85,0.15)] transition-all duration-500 hover:-translate-y-2 overflow-hidden rounded-xl bg-white"
                onClick={() => onProjectSelect(project)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Badge className="absolute top-4 left-4 bg-gold text-charcoal font-semibold">
                    ROI {project.roi}
                  </Badge>
                  <Badge className="absolute top-4 right-4 bg-[#8b7355] text-white border-0">
                    {project.completion}
                  </Badge>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8b7355]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end p-6">
                    <div className="text-white">
                      <div className="flex items-center text-sm">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        <span>View Details</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-xl text-[#8b7355] group-hover:text-gold transition-colors font-semibold mb-1">
                        {project.name}
                      </h4>
                      <p className="text-warm-gray text-sm">
                        {project.developer}
                      </p>
                    </div>

                    <div className="flex items-center justify-between py-2">
                      <div className="text-2xl font-bold text-gold">
                        {project.price}
                      </div>
                      <div className="text-[#8b7355] font-medium">
                        {project.bedrooms}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-b border-beige/50">
                      <div className="space-y-1">
                        <Bed className="w-5 h-5 mx-auto text-gold" />
                        <div className="text-xs text-warm-gray font-medium">
                          {project.bedrooms}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Bath className="w-5 h-5 mx-auto text-gold" />
                        <div className="text-xs text-warm-gray font-medium">
                          {project.bathrooms} Bath
                        </div>
                      </div>
                      <div className="space-y-1">
                        <Square className="w-5 h-5 mx-auto text-gold" />
                        <div className="text-xs text-warm-gray font-medium">
                          {project.size}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-sm text-warm-gray flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {project.completion}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gold/30 text-gold hover:bg-gold hover:text-charcoal transition-all duration-300"
                      >
                        View Details
                        <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
