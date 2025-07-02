"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { MapPin } from "lucide-react";
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

export function PropertyCard({ property }: PropertyCardProps) {
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

  // Format price display
  const formatPrice = (property: any) => {
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

  return (
    <Card
      className="group cursor-pointer border border-beige hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden rounded-xl"
      onClick={() => router.push(`/properties/${property?.id}`)}
    >
      {/* Property Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={getImageUrl(property.cover_image_url)}
          alt={property.name || "Property"}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Badge className="absolute top-4 right-4 bg-black/70 text-white border-0">
          {property.status || property.sale_status || "Available"}
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
              <span className="text-sm">{property.area || "Location"}</span>
            </div>
          </div>

          {/* Price and Status */}
          <div className="flex items-center justify-between">
            <div className="text-2xl text-gold">{formatPrice(property)}</div>
            <Badge
              variant="outline"
              className="text-xs border-gold/30 text-gold"
            >
              {property.sale_status || property.status || "Available"}
            </Badge>
          </div>

          {/* Developer */}
          <div className="pt-4 border-t border-beige">
            <div className="text-sm text-warm-gray">
              {property.developer || "Developer"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
