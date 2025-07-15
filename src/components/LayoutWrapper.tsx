"use client";

import { useRouter, usePathname } from "next/navigation";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { BottomNavigation } from "./BottomNavigation";
import { WhatsAppButton } from "./WhatsAppButton";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Determine current page based on pathname
  const getCurrentPage = () => {
    if (pathname === "/") return "home";
    if (pathname.startsWith("/properties")) return "properties";
    if (pathname.startsWith("/developers")) return "developers";
    if (pathname.startsWith("/services")) return "services";
    if (pathname.startsWith("/about")) return "about";
    if (pathname.startsWith("/contact")) return "contact";
    if (pathname.startsWith("/join-us")) return "join-us";

    // Extract the first segment for other pages
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] || "home";
  };

  // Handle navigation
  const handlePageNavigation = (page: string) => {
    switch (page) {
      case "home":
        router.push("/");
        break;
      case "properties":
      case "all-properties":
        router.push("/properties");
        break;
      case "developers":
        router.push("/developers");
        break;
      case "services":
        router.push("/services");
        break;
      case "about":
      case "about-us":
        router.push("/about");
        break;
      case "contact":
      case "contact-us":
        router.push("/contact");
        break;
      case "join-us":
        router.push("/join-us");
        break;
      // Services sub-pages
      case "off-plan-investment":
        router.push("/services/off-plan-investment");
        break;
      case "market-analysis":
        router.push("/services/market-analysis");
        break;
      case "property-management":
        router.push("/services/property-management");
        break;
      case "legal-assistance":
        router.push("/services/legal-assistance");
        break;
      case "after-sales-support":
        router.push("/services/after-sales-support");
        break;
      case "company-formation":
        router.push("/services/company-formation");
        break;
      case "mortgages":
        router.push("/services/mortgages");
        break;
      case "golden-visa":
        router.push("/services/golden-visa");
        break;
      // Join Us sub-pages
      case "join-as-partner":
        router.push("/join-us/partner");
        break;
      case "become-franchisee":
        router.push("/join-us/franchisee");
        break;
      // Legal pages
      case "privacy-policy":
        router.push("/privacy-policy");
        break;
      case "terms-of-service":
        router.push("/terms-of-service");
        break;
      case "cookie-policy":
        router.push("/cookie-policy");
        break;
      default:
        router.push(`/${page}`);
    }
  };

  // Handle logo click
  const handleLogoClick = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col overflow-x-hidden">
      <Navbar
        onNavigate={handlePageNavigation}
        onLogoClick={handleLogoClick}
        currentPage={getCurrentPage()}
      />

      <main className="flex-1 pt-20">{children}</main>

      <Footer />

      {/* Bottom Navigation for mobile and tablet */}
      <BottomNavigation onNavigate={handlePageNavigation} />

      {/* WhatsApp Floating Button */}
      <WhatsAppButton />
    </div>
  );
}
