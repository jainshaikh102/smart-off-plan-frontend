"use client";

import { JoinAsPartnerPage } from "@/components/JoinAsPartnerPage";
import { useRouter } from "next/navigation";

export default function JoinAsPartnerRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/join-us");
  };

  return <JoinAsPartnerPage onBack={handleBack} />;
}
