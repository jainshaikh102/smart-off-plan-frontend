"use client";

import { AllPropertiesPage } from "@/components/AllPropertiesPage";
import { useRouter } from "next/navigation";

export default function PropertiesPage() {
  const router = useRouter();

  const handleProjectSelect = (project: any) => {
    // console.log("Project selected:", project);
    // Navigate to project detail page using the correct ID field
    const propertyId = project?.externalId || project?.id;
    router.push(`/properties/${propertyId}`);
  };

  const handleBack = () => {
    router.push("/");
  };

  return (
    <AllPropertiesPage
      onProjectSelect={handleProjectSelect}
      onBack={handleBack}
    />
  );
}
