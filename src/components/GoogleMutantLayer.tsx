"use client";

import { useEffect } from "react";
import { useMap } from "react-leaflet";
import dynamic from "next/dynamic";

const isServer = typeof window === "undefined";
let L: any;
if (!isServer) {
  L = require("leaflet");
  require("leaflet.gridlayer.googlemutant"); // registers L.gridLayer.googleMutant
}

type MapType = "roadmap" | "satellite" | "terrain" | "hybrid";

interface Props {
  mapTypeId?: MapType;
  styles?: google.maps.MapTypeStyle[] | any; // keep as any to avoid TS complaints before google is loaded
  maxZoom?: number;
}

function GoogleMutantLayer({
  mapTypeId = "roadmap",
  styles,
  maxZoom = 24,
}: Props) {
  const map = useMap();

  useEffect(() => {
    if (!map || isServer) return;
    // Ensure Google is loaded
    if (!(window as any).google || !L?.gridLayer?.googleMutant) return;

    const layer = (L.gridLayer as any).googleMutant({
      type: mapTypeId, // roadmap | satellite | terrain | hybrid
      styles,
      maxZoom,
    });

    layer.addTo(map);

    return () => {
      try {
        layer.remove();
      } catch {}
    };
  }, [map, mapTypeId, maxZoom, styles]);

  return null;
}

export default dynamic(() => Promise.resolve(GoogleMutantLayer), {
  ssr: false,
});
