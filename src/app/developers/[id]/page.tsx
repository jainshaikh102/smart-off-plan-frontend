"use client";

import { DeveloperDetailPage } from "@/components/DeveloperDetailPage";
import { Navbar } from "@/components/Navbar";
import { useRouter, useParams } from "next/navigation";

export default function DeveloperDetailRoute() {
  const router = useRouter();
  const params = useParams();
  const developerId = params.id as string;

  const handleBack = () => {
    router.push("/developers");
  };

  const handlePageNavigation = (page: string) => {
    router.push(`/${page}`);
  };

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleProjectSelect = (project: any) => {
    router.push(`/properties/${project.id}`);
  };

  // You would typically fetch the developer data here based on the ID
  // For now, we'll pass the ID to the component
  const mockDeveloper = {
    id: developerId,
    // Add other developer fields as needed
  };

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar
        onNavigate={handlePageNavigation}
        onLogoClick={handleLogoClick}
        currentPage="developers"
      />
      <DeveloperDetailPage 
        developer={mockDeveloper}
        onBack={handleBack}
        onProjectSelect={handleProjectSelect}
        onNavigate={handlePageNavigation}
        onLogoClick={handleLogoClick}
      />
    </div>
  );
}
