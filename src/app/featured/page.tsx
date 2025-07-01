"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Home,
  ChevronRight,
  MapPin,
  Search,
  Grid3X3,
  List,
  Building2,
  Award,
  Calendar,
  ArrowRight,
  Loader2,
  Star,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useRouter } from "next/navigation";

interface Property {
  id: number;
  name: string;
  area: string;
  developer: string;
  min_price?: number;
  max_price?: number;
  price_currency: string;
  status: string;
  sale_status: string;
  cover_image_url?: string;
  is_partner_project: boolean;
  featured: boolean;
  completion_datetime?: string;
}

export default function FeaturedPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch all featured properties
  const fetchFeaturedProperties = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log("🌟 Fetching all featured properties...");

      const response = await axios.get("/api/properties/featured");
      const data = response.data;

      console.log("🌟 [FEATURED] API Response:", data);

      if (data.success && data.data) {
        const featuredProperties = Array.isArray(data.data) ? data.data : [];
        console.log(
          `🌟 Found ${featuredProperties.length} featured properties`
        );
        setProperties(featuredProperties);
      } else {
        console.log("⚠️ No featured properties data found in response");
        setProperties([]);
      }
    } catch (err) {
      console.error("❌ Error fetching featured properties:", err);
      if (axios.isAxiosError(err)) {
        setError(
          `Failed to fetch featured properties: ${
            err.response?.status || err.message
          }`
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch featured properties"
        );
      }
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeaturedProperties();
  }, []);

  // Filter properties based on search
  const filteredProperties = properties.filter(
    (property) =>
      property.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.developer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort properties
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return (a.min_price || 0) - (b.min_price || 0);
      case "price-high":
        return (
          (b.max_price || b.min_price || 0) - (a.max_price || a.min_price || 0)
        );
      case "name":
        return a.name.localeCompare(b.name);
      case "area":
        return a.area.localeCompare(b.area);
      case "newest":
      default:
        return b.id - a.id;
    }
  });

  // Format price display
  const formatPrice = (property: Property) => {
    if (property.min_price && property.max_price) {
      return `${property.price_currency} ${(
        property.min_price / 1000000
      ).toFixed(1)}M - ${(property.max_price / 1000000).toFixed(1)}M`;
    } else if (property.min_price) {
      return `${property.price_currency} ${(
        property.min_price / 1000000
      ).toFixed(1)}M+`;
    }
    return "Price on Request";
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

  const formatCompletionDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-beige shadow-sm">
        <div className="container py-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/")}
              className="text-warm-gray hover:text-gold"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <ChevronRight className="w-4 h-4 text-warm-gray" />
            <span className="text-[#8b7355]">Featured Properties</span>
          </div>

          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[#8b7355] mb-2 flex items-center">
                <Star className="w-8 h-8 mr-3 text-gold" />
                Featured Properties
              </h1>
              <p className="text-warm-gray">
                {loading
                  ? "Loading..."
                  : `${sortedProperties.length} premium properties selected by our experts`}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Filters and Search */}
      <div className="bg-white border-b border-beige">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-warm-gray w-4 h-4" />
              <Input
                placeholder="Search featured properties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-soft-gray/30"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="area">Area A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border border-soft-gray/30 rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="container py-8">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold mr-3" />
            <span className="text-[#8b7355]">
              Loading featured properties...
            </span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <Star className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-600 mb-4">
              Error Loading Featured Properties
            </h3>
            <p className="text-red-500 mb-6">{error}</p>
            <Button
              onClick={fetchFeaturedProperties}
              className="bg-gold hover:bg-gold/90 text-white"
            >
              Try Again
            </Button>
          </div>
        ) : sortedProperties.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                : "space-y-6"
            }
          >
            {sortedProperties.map((property) => (
              <Card
                key={property.id}
                className={`group cursor-pointer hover:shadow-xl transition-all duration-300 ${
                  viewMode === "list" ? "flex flex-row" : "flex flex-col"
                }`}
                onClick={() => router.push(`/properties/${property.id}`)}
              >
                <div
                  className={`relative overflow-hidden ${
                    viewMode === "list" ? "w-64 h-48" : "h-48"
                  }`}
                >
                  <ImageWithFallback
                    src={getImageUrl(property.cover_image_url)}
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-gold text-white text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                  {property.completion_datetime && (
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-emerald-500 text-white text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatCompletionDate(property.completion_datetime)}
                      </Badge>
                    </div>
                  )}
                  {property.is_partner_project && (
                    <div className="absolute bottom-3 left-3">
                      <Badge className="bg-deep-blue text-white text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        Partner
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent
                  className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}
                >
                  <h3 className="text-xl font-semibold text-[#8b7355] mb-2 group-hover:text-gold transition-colors">
                    {property.name}
                  </h3>
                  <div className="flex items-center text-warm-gray text-sm mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {property.area}
                  </div>
                  <div className="text-lg font-semibold text-[#8b7355] mb-3">
                    {formatPrice(property)}
                  </div>
                  <div className="flex items-center justify-between text-sm text-warm-gray mb-4">
                    <span className="flex items-center">
                      <Building2 className="w-4 h-4 mr-1" />
                      {property.developer}
                    </span>
                    <span>{property.sale_status}</span>
                  </div>
                  <Button
                    className="w-full bg-deep-blue hover:bg-deep-blue/90 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/properties/${property.id}`);
                    }}
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Star className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-600 mb-4">
              No Featured Properties Found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? `No featured properties match "${searchQuery}"`
                : "No featured properties are currently available."}
            </p>
            {searchQuery ? (
              <Button
                onClick={() => setSearchQuery("")}
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-white"
              >
                Clear Search
              </Button>
            ) : (
              <Button
                onClick={fetchFeaturedProperties}
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-white"
              >
                Refresh
              </Button>
            )}
          </div>
        )}
      </main>
    </>
  );
}
