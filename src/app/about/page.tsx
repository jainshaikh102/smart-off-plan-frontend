"use client";

import { AboutUsPage } from "@/components/AboutUsPage";
import { useRouter } from "next/navigation";

export default function AboutRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return <AboutUsPage onBack={handleBack} />;
}
