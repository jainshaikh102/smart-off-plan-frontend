"use client";

import { MortgagesPage } from "@/components/MortgagesPage";
import { useRouter } from "next/navigation";

export default function MortgagesRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/services");
  };

  return <MortgagesPage onBack={handleBack} />;
}
