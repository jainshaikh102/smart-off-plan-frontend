"use client";

import { CompanyFormationPage } from "@/components/CompanyFormationPage";
import { useRouter } from "next/navigation";

export default function CompanyFormationRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/services");
  };

  return <CompanyFormationPage onBack={handleBack} />;
}
