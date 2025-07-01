"use client";

import { ContactInfoPage } from "@/components/ContactInfoPage";
import { useRouter } from "next/navigation";

export default function ContactRoute() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/");
  };

  return <ContactInfoPage onBack={handleBack} />;
}
