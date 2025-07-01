"use client";

import { LegalAssistancePage } from "@/components/LegalAssistancePage";
import { useRouter } from "next/navigation";

export default function LegalAssistanceRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/services");
  };

  return <LegalAssistancePage onBack={handleBack} />;
}
