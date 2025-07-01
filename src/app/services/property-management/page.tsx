"use client";

import { PropertyManagementPage } from "@/components/PropertyManagementPage";
import { useRouter } from "next/navigation";

export default function PropertyManagementRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/services");
  };

  return <PropertyManagementPage onBack={handleBack} />;
}
