"use client";

import { JoinUsPage } from "@/components/JoinUsPage";
import { useRouter } from "next/navigation";

export default function JoinUsRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return <JoinUsPage onBack={handleBack} />;
}
