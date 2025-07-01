"use client";

import { DevelopersPage } from "@/components/DevelopersPage";
import { useRouter } from "next/navigation";

export default function DevelopersRoute() {
  const router = useRouter();

  const handleDeveloperSelect = (developer: any) => {
    console.log("Developer selected:", developer);
    // Navigate to developer detail page
    router.push(`/developers/${developer.id}`);
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
