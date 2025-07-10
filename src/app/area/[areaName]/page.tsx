"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PropertyCard } from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Building2 } from "lucide-react";
import Link from "next/link";
import axios from "axios";

// Property interface for area page
interface Property {
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
}

interface AreaPageProps {}

export default function AreaPage({}: AreaPageProps) {
  const params = useParams();
  const areaName = decodeURIComponent(params.areaName as string);

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAreaProperties = async () => {
      try {
        setLoading(true);
        console.log("🏙️ Fetching properties for area:", areaName);

        // Use the new /all endpoint with area filtering for better performance
        const response = await axios.get(
          `/api/properties/all?area=${encodeURIComponent(areaName)}`
        );

        if (response.data.success) {
          setProperties(response.data.data);
          console.log(
            `✅ Found ${response.data.data.length} properties in ${areaName}`
          );
        } else {
          setError("Failed to fetch properties");
        }
      } catch (err) {
        console.error("❌ Error fetching area properties:", err);
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    };

    if (areaName) {
      fetchAreaProperties();
    }
  }, [areaName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-warm-gray">Loading properties...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cream">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-600">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button
              variant="ghost"
              className="mb-4 text-warm-gray hover:text-gold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>

          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="w-6 h-6 text-gold" />
            <h1 className="text-3xl font-bold text-warm-gray">{areaName}</h1>
          </div>

          <div className="flex items-center space-x-2 text-warm-gray/70">
            <Building2 className="w-4 h-4" />
            <span>{properties.length} Properties Available</span>
          </div>
        </div>

        {/* Properties Grid */}
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Building2 className="w-16 h-16 text-warm-gray/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-warm-gray mb-2">
              No Properties Found
            </h3>
            <p className="text-warm-gray/70">
              There are currently no properties available in {areaName}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
