"use client";

import { OffPlanInvestmentPage } from "@/components/OffPlanInvestmentPage";
import { useRouter } from "next/navigation";

export default function OffPlanInvestmentRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/services");
  };

  return <OffPlanInvestmentPage onBack={handleBack} />;
}
