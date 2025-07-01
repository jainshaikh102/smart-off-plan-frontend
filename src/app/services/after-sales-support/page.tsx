"use client";

import { AfterSalesSupportPage } from "@/components/AfterSalesSupportPage";
import { useRouter } from "next/navigation";

export default function AfterSalesSupportRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/services");
  };

  return <AfterSalesSupportPage onBack={handleBack} />;
}
