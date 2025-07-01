"use client";

import { GoldenVisaPage } from "@/components/GoldenVisaPage";
import { useRouter } from "next/navigation";

export default function GoldenVisaRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/services");
  };

  return <GoldenVisaPage onBack={handleBack} />;
}
