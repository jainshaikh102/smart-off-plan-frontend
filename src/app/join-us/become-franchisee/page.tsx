"use client";

import { BecomeFranchiseePage } from "@/components/BecomeFranchiseePage";
import { useRouter } from "next/navigation";

export default function BecomeFranchiseeRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/join-us");
  };

  return <BecomeFranchiseePage onBack={handleBack} />;
}
