"use client";

import { MarketAnalysisPage } from "@/components/MarketAnalysisPage";
import { useRouter } from "next/navigation";

export default function MarketAnalysisRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/services");
  };

  return <MarketAnalysisPage onBack={handleBack} />;
}
