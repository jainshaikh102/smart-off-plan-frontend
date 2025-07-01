"use client";

import dynamic from "next/dynamic";

// Dynamically import the map component to avoid SSR issues
const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function TestLeafletPage() {
  return (
    <div className="h-screen w-full">
      <h1 className="text-2xl font-bold p-4">Leaflet Test Page</h1>
      <div className="h-96 w-full">
        <LeafletMap />
      </div>
    </div>
  );
}
