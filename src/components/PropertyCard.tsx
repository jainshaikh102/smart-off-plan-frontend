"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  MapPin,
  Bath,
  Bed,
  Heart,
  TrendingUp,
  Clock,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Extended Property interface that includes all possible fields
interface PropertyCardProps {
  property: {
    id: number | string;
    name: string;
    area: string;
    developer: string;
    min_price?: number;
    max_price?: number;
    price_currency: string;
    cover_image_url?: string;
    sale_status?: string;
    status?: string;
    completion_datetime?: string;
    is_partner_project?: boolean;
    featured?: boolean;
    reelly_status?: boolean;
    bedrooms?: string;
    bathrooms?: string;
    size?: string;
    roi?: string;
    coordinates?: [number, number];
    description?: string;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const router = useRouter();

  // Helper function to safely parse image URL
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return "/placeholder-property.jpg";
    
    try {
      const parsed = JSON.parse(imageUrl);
      return parsed.url || "/placeholder-property.jpg";
    } catch {
      return imageUrl || "/placeholder-property.jpg";
    }
  };

  return (
    <Card
      className="bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group cursor-pointer rounded-xl border-0 h-full"
      onClick={() => router.push(`/properties/${property?.id}`)}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <ImageWithFallback
          src={getImageUrl(property.cover_image_url)}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-gold text-[#8b7355] px-2 py-1 text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {property.completion_datetime
              ? new Date(property.completion_datetime).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                  }
                )
              : "TBD"}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            size="sm"
            variant="ghost"
            className="bg-white/90 hover:bg-white text-[#8b7355] p-1.5 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              // Handle favorite logic
            }}
          >
            <Heart className="w-3 h-3" />
          </Button>
        </div>
        <div className="absolute bottom-3 left-3">
          <Badge
            variant="outline"
            className="bg-white/90 border-white text-[#8b7355] text-xs"
          >
            {property.sale_status || property.status || "Available"}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardContent className="p-4">
        <div className="mb-3">
          <h3 className="text-lg text-[rgba(30,26,26,1)] mb-1 group-hover:text-gold transition-colors line-clamp-1">
            {property.name}
          </h3>
          <div className="flex items-center text-warm-gray text-sm mb-2">
            <MapPin className="w-3 h-3 mr-1" />
            {property.area}
          </div>
          <div className="text-lg text-[#8b7355]">
            {property.min_price && property.max_price
              ? `${property.price_currency} ${(
                  property.min_price / 1000000
                ).toFixed(1)}M - ${(property.max_price / 1000000).toFixed(
                  1
                )}M`
              : property.min_price
              ? `${property.price_currency} ${(
                  property.min_price / 1000000
                ).toFixed(1)}M+`
              : "Price on Request"}
          </div>
        </div>

        {/* Property Details Grid */}
        {(property.bedrooms || property.bathrooms || property.roi) && (
          <div className="grid grid-cols-3 gap-2 mb-3 text-center">
            <div>
              <div className="flex items-center justify-center mb-1">
                <Bed className="w-3 h-3 text-gold mr-1" />
                <span className="text-xs text-warm-gray">Beds</span>
              </div>
              <div className="text-[#8b7355] text-sm">{property.bedrooms || "N/A"}</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <Bath className="w-3 h-3 text-gold mr-1" />
                <span className="text-xs text-warm-gray">Baths</span>
              </div>
              <div className="text-[#8b7355] text-sm">{property.bathrooms || "N/A"}</div>
            </div>
            <div>
              <div className="flex items-center justify-center mb-1">
                <TrendingUp className="w-3 h-3 text-emerald-500 mr-1" />
                <span className="text-xs text-warm-gray">ROI</span>
              </div>
              <div className="text-emerald-500 text-sm">{property.roi || "N/A"}</div>
            </div>
          </div>
        )}

        <div className="text-center">
          <div className="text-xs text-[rgba(30,26,26,0.6)] mb-2">
            By {property.developer}
          </div>

          <Button
            className="bg-gold hover:bg-gold/90 text-[rgba(255,255,255,1)] px-4 py-1 text-sm w-full"
            onClick={() => router.push(`/properties/${property?.id}`)}
          >
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
