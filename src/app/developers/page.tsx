"use client";

import { DevelopersPage } from "@/components/DevelopersPage";
import { useRouter } from "next/navigation";

export default function DevelopersRoute() {
  const router = useRouter();

  const handleDeveloperSelect = (developer: any) => {
    console.log("Developer selected:", developer);
    if (developer && developer.name) {
      // Navigate to developer detail page using developer name
      const developerName = encodeURIComponent(developer.name);
      router.push(`/developer/${developerName}`);
    } else {
      console.error("Developer name not found:", developer);
    }
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <DevelopersPage
      onDeveloperSelect={handleDeveloperSelect}
      onBack={handleBack}
    />
  );
}
