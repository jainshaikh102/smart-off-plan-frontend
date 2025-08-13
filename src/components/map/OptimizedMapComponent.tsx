"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// Import marker cluster functionality
declare module "leaflet" {
  interface MarkerClusterGroupOptions {
    chunkedLoading?: boolean;
    chunkInterval?: number;
    chunkDelay?: number;
    maxClusterRadius?: number;
    spiderfyOnMaxZoom?: boolean;
    showCoverageOnHover?: boolean;
    zoomToBoundsOnClick?: boolean;
    removeOutsideVisibleBounds?: boolean;
  }

  interface MarkerClusterGroup extends LayerGroup {
    addLayer(layer: Layer): this;
    removeLayer(layer: Layer): this;
    clearLayers(): this;
  }

  function markerClusterGroup(
    options?: MarkerClusterGroupOptions
  ): MarkerClusterGroup;
}

interface Property {
  id: number;
  name: string;
  area: string;
  coordinates: string;
  developer: string;
  developer_logo?: string;
  min_price: number;
  max_price: number;
  price_currency: string;
}

interface OptimizedMapComponentProps {
  properties: Property[];
  onPropertyHover?: (property: Property | null) => void;
  onPropertyClick?: (property: Property) => void;
  hoveredProperty?: Property | null;
  className?: string;
  center?: [number, number];
  zoom?: number;
}

// Custom hook for marker clustering
const useMarkerClustering = (
  properties: Property[],
  onPropertyHover?: (property: Property | null) => void,
  onPropertyClick?: (property: Property) => void,
  hoveredProperty?: Property | null
) => {
  const map = useMap();
  const clusterGroupRef = useRef<any>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());

  // Parse coordinates safely
  const parseCoordinates = useCallback(
    (coordinates: string): [number, number] => {
      try {
        if (coordinates.includes(",")) {
          const [lat, lng] = coordinates
            .split(",")
            .map((coord) => parseFloat(coord.trim()));
          if (!isNaN(lat) && !isNaN(lng)) {
            return [lat, lng];
          }
        }

        const parsed = JSON.parse(coordinates);
        if (parsed.lat && parsed.lng) {
          return [parseFloat(parsed.lat), parseFloat(parsed.lng)];
        }

        throw new Error("Invalid coordinate format");
      } catch {
        return [25.2048, 55.2708]; // Fallback to Dubai center
      }
    },
    []
  );

  // Create custom marker icon
  const createMarkerIcon = useCallback(
    (property: Property, isHovered: boolean = false) => {
      const logoUrl = property.developer_logo || "/placeholder-developer.jpg";
      const size = isHovered ? 40 : 30;

      return L.divIcon({
        html: `
        <div class="custom-marker ${isHovered ? "hovered" : ""}" style="
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          border: 3px solid ${isHovered ? "#d4af37" : "#ffffff"};
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: all 0.2s ease;
          cursor: pointer;
        ">
          <img 
            src="${logoUrl}" 
            alt="${property.developer}"
            style="
              width: ${size - 8}px;
              height: ${size - 8}px;
              border-radius: 50%;
              object-fit: cover;
            "
            onerror="this.src='/placeholder-developer.jpg'"
          />
        </div>
      `,
        className: "custom-marker-container",
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
      });
    },
    []
  );

  // Update markers when properties or hover state changes
  useEffect(() => {
    if (!map) return;

    // Initialize cluster group if not exists
    if (!clusterGroupRef.current) {
      clusterGroupRef.current = (L as any).markerClusterGroup({
        chunkedLoading: true,
        chunkInterval: 200,
        chunkDelay: 50,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        removeOutsideVisibleBounds: true,
      });
      map.addLayer(clusterGroupRef.current);
    }

    const clusterGroup = clusterGroupRef.current;

    // Clear existing markers
    clusterGroup.clearLayers();
    markersRef.current.clear();

    // Add markers in batches to prevent blocking
    const addMarkersInBatches = (
      startIndex: number = 0,
      batchSize: number = 50
    ) => {
      const endIndex = Math.min(startIndex + batchSize, properties.length);

      for (let i = startIndex; i < endIndex; i++) {
        const property = properties[i];
        if (!property.coordinates) continue;

        const coords = parseCoordinates(property.coordinates);
        const isHovered = hoveredProperty?.id === property.id;
        const icon = createMarkerIcon(property, isHovered);

        const marker = L.marker(coords, { icon })
          .bindPopup(
            `
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">${
                property.name
              }</h3>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${
                property.area
              }</p>
              <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">Developer: ${
                property.developer
              }</p>
              <p style="margin: 0; font-size: 12px; font-weight: bold; color: #d4af37;">
                ${
                  property.price_currency
                } ${property.min_price?.toLocaleString()} - ${property.max_price?.toLocaleString()}
              </p>
            </div>
          `
          )
          .on("mouseover", () => onPropertyHover?.(property))
          .on("mouseout", () => onPropertyHover?.(null))
          .on("click", () => onPropertyClick?.(property));

        clusterGroup.addLayer(marker);
        markersRef.current.set(property.id, marker);
      }

      // Continue with next batch if there are more properties
      if (endIndex < properties.length) {
        setTimeout(() => addMarkersInBatches(endIndex, batchSize), 10);
      }
    };

    // Start adding markers in batches
    if (properties.length > 0) {
      addMarkersInBatches();
    }

    return () => {
      if (clusterGroupRef.current) {
        clusterGroupRef.current.clearLayers();
        markersRef.current.clear();
      }
    };
  }, [
    properties,
    hoveredProperty,
    map,
    parseCoordinates,
    createMarkerIcon,
    onPropertyHover,
    onPropertyClick,
  ]);

  // Update hovered marker icon
  useEffect(() => {
    if (!hoveredProperty) return;

    const marker = markersRef.current.get(hoveredProperty.id);
    if (marker) {
      const newIcon = createMarkerIcon(hoveredProperty, true);
      marker.setIcon(newIcon);
    }

    // Reset other markers
    markersRef.current.forEach((marker, id) => {
      if (id !== hoveredProperty.id) {
        const property = properties.find((p) => p.id === id);
        if (property) {
          const normalIcon = createMarkerIcon(property, false);
          marker.setIcon(normalIcon);
        }
      }
    });
  }, [hoveredProperty, createMarkerIcon, properties]);

  return null;
};

// Map clustering component
const MapClustering: React.FC<{
  properties: Property[];
  onPropertyHover?: (property: Property | null) => void;
  onPropertyClick?: (property: Property) => void;
  hoveredProperty?: Property | null;
}> = ({ properties, onPropertyHover, onPropertyClick, hoveredProperty }) => {
  useMarkerClustering(
    properties,
    onPropertyHover,
    onPropertyClick,
    hoveredProperty
  );
  return null;
};

export const OptimizedMapComponent: React.FC<OptimizedMapComponentProps> = ({
  properties,
  onPropertyHover,
  onPropertyClick,
  hoveredProperty,
  className = "",
  center = [25.2048, 55.2708],
  zoom = 10,
}) => {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoize filtered properties to prevent unnecessary re-renders
  const validProperties = useMemo(() => {
    return properties.filter((property) => property.coordinates);
  }, [properties]);

  // Performance monitoring
  useEffect(() => {
    if (validProperties.length > 500) {
      console.warn(
        `⚠️ Large number of properties (${validProperties.length}) may impact performance`
      );
    }
  }, [validProperties.length]);

  if (!isClient) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-gray-100`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        ref={mapRef}
        preferCanvas={true} // Use canvas for better performance
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={18}
          subdomains="abcd"
        />

        <MapClustering
          properties={validProperties}
          onPropertyHover={onPropertyHover}
          onPropertyClick={onPropertyClick}
          hoveredProperty={hoveredProperty}
        />
      </MapContainer>

      {/* Performance indicator */}
      {validProperties.length > 0 && (
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600 z-[1000]">
          {validProperties.length} properties
        </div>
      )}
    </div>
  );
};
