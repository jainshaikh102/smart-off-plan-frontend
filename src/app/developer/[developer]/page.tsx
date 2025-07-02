"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Building2, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

interface Property {
  id: number;
  name: string;
  area: string;
  developer: string;
  min_price?: number;
  max_price?: number;
  price_currency: string;
  cover_image_url?: string;
  sale_status: string;
  completion_datetime?: string;
  is_partner_project: boolean;
  featured: boolean;
  reelly_status: boolean;
}

export default function DeveloperPage() {
  const params = useParams();
  const router = useRouter();
  const developerName = decodeURIComponent(params.developer as string);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties by developer
  const fetchPropertiesByDeveloper = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🏢 Fetching properties for developer: ${developerName}`);

      const response = await axios.get(
        `/api/properties/by-developer/${encodeURIComponent(developerName)}`
      );
      const data = response.data;

      console.log("🏢 [DEVELOPER] API Response:", data);

      if (data.success && data.data) {
        const developerProperties = Array.isArray(data.data) ? data.data : [];
        console.log(
          `🏢 Found ${developerProperties.length} properties for ${developerName}`
        );
        setProperties(developerProperties);
      } else {
        console.log("⚠️ No properties data found in response");
        setProperties([]);
      }
    } catch (err) {
      console.error("❌ Error fetching properties by developer:", err);
      if (axios.isAxiosError(err)) {
        setError(
          `Failed to fetch properties: ${err.response?.status || err.message}`
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch properties"
        );
      }
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (developerName) {
      fetchPropertiesByDeveloper();
    }
  }, [developerName]);

  const formatPrice = (property: Property) => {
    const currency = property.price_currency || "AED";

    if (property.min_price && property.max_price) {
      if (property.min_price === property.max_price) {
        return `${currency} ${property.min_price.toLocaleString()}`;
      }
      return `${currency} ${property.min_price.toLocaleString()} - ${property.max_price.toLocaleString()}`;
    }

    if (property.min_price) {
      return `From ${currency} ${property.min_price.toLocaleString()}`;
    }

    if (property.max_price) {
      return `Up to ${currency} ${property.max_price.toLocaleString()}`;
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

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-br from-beige to-ivory py-16">
        <div className="container">
          {/* <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="mr-4 text-[#8b7355] hover:text-gold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div> */}

          <div className="flex items-center">
            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mr-6">
              <Building2 className="w-8 h-8 text-gold" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-[#8b7355] mb-2">
                {developerName}
              </h1>
              <p className="text-lg text-warm-gray">
                {loading
                  ? "Loading..."
                  : `${properties.length} Properties Available`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container py-16">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gold mr-3" />
            <span className="text-[#8b7355]">Loading properties...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-600 mb-4">
              Error Loading Properties
            </h3>
            <p className="text-red-500 mb-6">{error}</p>
            <Button
              onClick={fetchPropertiesByDeveloper}
              className="bg-gold hover:bg-gold/90 text-white"
            >
              Try Again
            </Button>
          </div>
        ) : properties.length > 0 ? (
          <>
            {/* Properties Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property) => (
                <Card
                  key={property.id}
                  className="group cursor-pointer border border-beige hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden rounded-xl"
                  onClick={() => router.push(`/properties/${property.id}`)}
                >
                  {/* Property Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ImageWithFallback
                      src={getImageUrl(property.cover_image_url)}
                      alt={property.name || "Property"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Badge className="absolute top-4 right-4 bg-black/70 text-white border-0">
                      {property.sale_status || "Available"}
                    </Badge>
                  </div>

                  {/* Property Details */}
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Title and Location */}
                      <div>
                        <h3 className="text-xl text-[#8b7355] group-hover:text-gold transition-colors">
                          {property.name || "Property Title"}
                        </h3>
                        <div className="flex items-center text-warm-gray mt-1">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            {property.area || "Location"}
                          </span>
                        </div>
                      </div>

                      {/* Price and Status */}
                      <div className="flex items-center justify-between">
                        <div className="text-2xl text-gold">
                          {formatPrice(property)}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs border-gold/30 text-gold"
                        >
                          {property.sale_status || "Available"}
                        </Badge>
                      </div>

                      {/* Developer */}
                      <div className="pt-4 border-t border-beige">
                        <div className="text-sm text-warm-gray">
                          {developerName || "Developer"}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 mx-auto mb-6 text-gray-400" />
            <h3 className="text-xl font-medium text-gray-600 mb-4">
              No Properties Found
            </h3>
            <p className="text-gray-500 mb-6">
              No properties are currently available for {developerName}.
            </p>
            <Button
              onClick={fetchPropertiesByDeveloper}
              variant="outline"
              className="border-gold text-gold hover:bg-gold hover:text-white"
            >
              Refresh
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
