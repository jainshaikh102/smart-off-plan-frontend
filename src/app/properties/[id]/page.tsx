"use client";

import { PropertyDetailPage } from "@/components/PropertyDetailPage";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PropertyDetailRoute() {
  const router = useRouter();
  const params = useParams();
  const propertyId = params.id as string;

  // State for property data
  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch property data using axios
  const fetchPropertyData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`/api/properties/${propertyId}`);
      const data = response.data;

      if (data.success && data.data) {
        setPropertyData(data.data);
      } else {
        console.error("❌ API Response Error:", data);
        setError("Failed to load property data");
      }
    } catch (err) {
      console.error("❌ Error fetching property data:", err);
      if (axios.isAxiosError(err)) {
        setError(
          `Failed to fetch property: ${err.response?.status || err.message}`
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch property"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (propertyId) {
      fetchPropertyData();
    }
  }, [propertyId]);

  const handleBack = () => {
    router.push("/properties");
  };

  const handlePageNavigation = (page: string) => {
    router.push(`/${page}`);
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  // Helper function to get image URL from API response
  const getImageUrl = (coverImageUrl?: string) => {
    if (!coverImageUrl) return "/placeholder-property.jpg";

    try {
      const parsed = JSON.parse(coverImageUrl);
      return parsed.url || "/placeholder-property.jpg";
    } catch {
      return "/placeholder-property.jpg";
    }
  };

  // Helper function to format price
  const formatPrice = (data: any) => {
    if (!data) return "Price on Request";

    const currency = data.price_currency || "AED";

    if (data.min_price && data.max_price) {
      if (data.min_price === data.max_price) {
        return `${currency} ${data.min_price.toLocaleString()}`;
      }
      return `${currency} ${data.min_price.toLocaleString()} - ${data.max_price.toLocaleString()}`;
    }

    if (data.min_price) {
      return `From ${currency} ${data.min_price.toLocaleString()}`;
    }

    if (data.max_price) {
      return `Up to ${currency} ${data.max_price.toLocaleString()}`;
    }

    return "Price on Request";
  };

  // Helper function to format price range
  const formatPriceRange = (
    minPrice: number | null,
    maxPrice: number | null,
    currency: string = "AED"
  ) => {
    if (!minPrice && !maxPrice) return "Price on Request";
    if (minPrice && maxPrice && minPrice !== maxPrice) {
      return `${currency} ${minPrice.toLocaleString()} - ${maxPrice.toLocaleString()}`;
    }
    if (minPrice) {
      return `Starting from ${currency} ${minPrice.toLocaleString()}`;
    }
    if (maxPrice) {
      return `Up to ${currency} ${maxPrice.toLocaleString()}`;
    }
    return "Price on Request";
  };

  // Helper function to format completion date
  const formatCompletionDate = (completionDateTime: string | null) => {
    if (!completionDateTime) return "TBA";
    try {
      const date = new Date(completionDateTime);
      const year = date.getFullYear();
      const month = date.toLocaleDateString("en-US", { month: "short" });
      return `${month} ${year}`;
    } catch {
      return "TBA";
    }
  };

  // Helper function to get location from area
  const getLocationFromArea = (area: string | null) => {
    if (!area) return "Dubai";
    // Clean up area name for display
    return area.replace(/,.*$/, "").trim(); // Remove everything after first comma
  };

  // Create property object with comprehensive API data mapping
  const mockProperty = {
    // Core identification
    id: propertyData?.externalId || propertyData?.id || "",
    name: propertyData?.name || "Loading...",

    // Location and area information
    location: getLocationFromArea(propertyData?.area),
    area: propertyData?.area || "Loading...",
    area_unit: propertyData?.area_unit || "sqft",
    address: propertyData?.address || propertyData?.area || "",
    coordinates: propertyData?.coordinates
      ? propertyData.coordinates
          .split(",")
          .map((coord: string) => parseFloat(coord.trim()))
      : null,

    // Pricing information
    price: formatPriceRange(
      propertyData?.min_price,
      propertyData?.max_price,
      propertyData?.price_currency
    ),
    min_price: propertyData?.min_price || 0,
    max_price: propertyData?.max_price || 0,
    price_currency: propertyData?.price_currency || "AED",

    // Property details
    developer: propertyData?.developer || "Loading...",
    status: propertyData?.sale_status || propertyData?.status || "Available",
    completion: formatCompletionDate(propertyData?.completion_datetime),
    completion_datetime: propertyData?.completion_datetime || null,

    // Property specifications
    description:
      propertyData?.completePropertyData?.overview ||
      propertyData?.description ||
      "",
    bedrooms: propertyData?.bedrooms || 0,
    bathrooms: propertyData?.bathrooms || 0,
    size_sqft: propertyData?.size_sqft || 0,
    size_sqm: propertyData?.size_sqm || 0,
    normalized_type: propertyData?.normalized_type || "Apartment",

    // Images and media
    cover_image_url: propertyData?.cover_image_url || null,
    image: propertyData?.cover_image_url || "/placeholder-property.jpg", // Fallback for compatibility

    // Business logic fields
    is_partner_project: propertyData?.is_partner_project || false,
    featured: propertyData?.featured || false,
    pendingReview: propertyData?.pendingReview || false,
    featureReason: propertyData?.featureReason || [],
    reelly_status: propertyData?.reelly_status || true,
    lastFeaturedAt: propertyData?.lastFeaturedAt || null,
    sale_status: propertyData?.sale_status || "Available",

    // Cache and metadata
    cacheExpiresAt: propertyData?.cacheExpiresAt || null,
    lastFetchedAt: propertyData?.lastFetchedAt || null,
    source: propertyData?.source || "realty_api",

    // Complete API data for advanced features
    apiData: propertyData?.completePropertyData || propertyData,

    // Additional fields from completePropertyData if available
    ...(propertyData?.completePropertyData && {
      // Override with more detailed data from completePropertyData if available
      description:
        propertyData.completePropertyData.description ||
        propertyData?.description ||
        "",
      bedrooms:
        propertyData.completePropertyData.bedrooms ||
        propertyData?.bedrooms ||
        0,
      bathrooms:
        propertyData.completePropertyData.bathrooms ||
        propertyData?.bathrooms ||
        0,
      size_sqft:
        propertyData.completePropertyData.size_sqft ||
        propertyData?.size_sqft ||
        0,
      size_sqm:
        propertyData.completePropertyData.size_sqm ||
        propertyData?.size_sqm ||
        0,
    }),
  };

  return <PropertyDetailPage project={mockProperty} onBack={handleBack} />;
}
