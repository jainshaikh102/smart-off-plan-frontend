"use client";

import { useState, useEffect } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { HeroSection } from "@/components/HeroSection";
import { FeaturedProjects } from "@/components/FeaturedProjects";
// import { PropertyFilters } from "@/components/PropertyFilters";
import dynamic from "next/dynamic";

// Dynamically import PropertyFiltersTesting to avoid SSR issues with Leaflet
const PropertyFiltersTesting = dynamic(
  () =>
    import("@/components/PropertyFiltersTesting").then((mod) => ({
      default: mod.PropertyFiltersTesting,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="section-padding bg-white">
        <div className="container">
          <div className="text-center py-12">
            <div className="text-warm-gray mb-4">
              Loading map and filters...
            </div>
          </div>
        </div>
      </div>
    ),
  }
);
import { DevelopersListing } from "@/components/DevelopersListing";
import { PropertyListings } from "@/components/PropertyListings";
import { MarketInfo } from "@/components/MarketInfo";
import { AboutCompany } from "@/components/AboutCompany";
import { Testimonials } from "@/components/Testimonials";
import { ContactUs } from "@/components/ContactUs";
import { ContactUsPage } from "@/components/ContactUsPage";
import { ContactInfoPage } from "@/components/ContactInfoPage";
import { PropertyDetailPage } from "@/components/PropertyDetailPage";
import { DeveloperDetailPage } from "@/components/DeveloperDetailPage";
import { AllPropertiesPage } from "@/components/AllPropertiesPage";
import { OffPlanInvestmentPage } from "@/components/OffPlanInvestmentPage";
import { MarketAnalysisPage } from "@/components/MarketAnalysisPage";
import { PropertyManagementPage } from "@/components/PropertyManagementPage";
import { LegalAssistancePage } from "@/components/LegalAssistancePage";
import { AfterSalesSupportPage } from "@/components/AfterSalesSupportPage";
import { CompanyFormationPage } from "@/components/CompanyFormationPage";
import { MortgagesPage } from "@/components/MortgagesPage";
import { GoldenVisaPage } from "@/components/GoldenVisaPage";
import { JoinUsPage } from "@/components/JoinUsPage";
import { JoinAsPartnerPage } from "@/components/JoinAsPartnerPage";
import { BecomeFranchiseePage } from "@/components/BecomeFranchiseePage";
import { AboutUsPage } from "@/components/AboutUsPage";
import { DevelopersPage } from "@/components/DevelopersPage";
import { PrivacyPolicyPage } from "@/components/PrivacyPolicyPage";
import { TermsOfServicePage } from "@/components/TermsOfServicePage";
import { CookiePolicyPage } from "@/components/CookiePolicyPage";
import { AreaDetailPage } from "@/components/AreaDetailPage";

export default function HomePage() {
  // Enhanced splash screen state management for smooth transitions
  const [showSplash, setShowSplash] = useState(true);
  const [splashExiting, setSplashExiting] = useState(false);
  const [isMainContentReady, setIsMainContentReady] = useState(false);
  const [isLogoClickSplash, setIsLogoClickSplash] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  // Existing app state
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [selectedDeveloper, setSelectedDeveloper] = useState<any>(null);
  const [selectedArea, setSelectedArea] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState("home");

  // Session management for splash screen
  useEffect(() => {
    console.log("🏠 HomePage: Initializing splash screen state");

    // Check if user has already seen splash screen in this session
    const hasSeenSplash = sessionStorage.getItem("smart-off-plan-splash-seen");
    console.log("🏠 HomePage: Has seen splash?", hasSeenSplash);

    if (hasSeenSplash) {
      console.log("🏠 HomePage: Skipping splash screen");
      // Skip splash screen for this session with immediate content display
      setShowSplash(false);
      setSplashExiting(false);
      setIsMainContentReady(true);
      setContentVisible(true);
    } else {
      console.log("🏠 HomePage: Showing splash screen");
      // Pre-render main content immediately for faster transition
      setIsMainContentReady(true);
    }
  }, []);

  // Enhanced splash screen completion with perfect timing
  const handleSplashComplete = () => {
    console.log("🏠 HomePage: handleSplashComplete called");

    // Mark splash as seen for this session (unless it's a logo click splash)
    if (!isLogoClickSplash) {
      console.log("🏠 HomePage: Marking splash as seen in session");
      sessionStorage.setItem("smart-off-plan-splash-seen", "true");
    }

    console.log("🏠 HomePage: Starting splash exit sequence");

    // If it was a logo click splash, reset navigation states
    if (isLogoClickSplash) {
      setCurrentPage("home");
      setSelectedProject(null);
      setSelectedDeveloper(null);
      setSelectedArea(null);
      setIsLogoClickSplash(false);
    }

    // Simplified transition - show content immediately
    setContentVisible(true);
    setSplashExiting(true);

    // Hide splash after a short delay
    setTimeout(() => {
      console.log("🏠 HomePage: Hiding splash screen");
      setShowSplash(false);
      setSplashExiting(false);
    }, 800);
  };

  // Enhanced logo click handler with proper state management
  const handleLogoClick = () => {
    // Set flag to indicate this is a logo click splash
    setIsLogoClickSplash(true);

    // Reset all transition states for fresh animation
    setContentVisible(false);
    setSplashExiting(false);

    // Pre-render content for smooth transition
    setIsMainContentReady(true);

    // Show splash screen again
    setShowSplash(true);

    // Don't update session storage for logo clicks - cinematic experience every time
  };

  // Existing navigation handlers - preserved exactly as they were
  const handleProjectSelect = (project: any) => {
    setSelectedProject(project);
    setSelectedDeveloper(null);
    setSelectedArea(null);
    setCurrentPage("property-detail");
  };

  const handleDeveloperSelect = (developer: any) => {
    setSelectedDeveloper(developer);
    setSelectedProject(null);
    setSelectedArea(null);
    setCurrentPage("developer-properties");
  };

  const handleAreaSelect = (area: any) => {
    setSelectedArea(area);
    setSelectedProject(null);
    setSelectedDeveloper(null);
    setCurrentPage("area-detail");
  };

  const handlePageNavigation = (page: string) => {
    // Handle contact navigation - always go to dedicated contact page
    if (page === "contact") {
      setCurrentPage("contact-info");
      setSelectedProject(null);
      setSelectedDeveloper(null);
      setSelectedArea(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Handle regular navigation
    setCurrentPage(page);
    setSelectedProject(null);
    setSelectedDeveloper(null);
    setSelectedArea(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
    setSelectedProject(null);
    setSelectedDeveloper(null);
    setSelectedArea(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Main application content generator
  const mainContent = () => {
    // Render different pages based on current state - preserved exactly as before
    switch (currentPage) {
      case "all-properties":
        return (
          <AllPropertiesPage
            onProjectSelect={handleProjectSelect}
            onBack={handleBackToHome}
          />
        );

      case "developer-properties":
        if (selectedDeveloper) {
          return (
            <AllPropertiesPage
              onProjectSelect={handleProjectSelect}
              onBack={handleBackToHome}
              selectedDeveloper={selectedDeveloper}
            />
          );
        }
        break;

      case "area-detail":
        if (selectedArea) {
          return (
            <AreaDetailPage
              area={selectedArea}
              onBack={handleBackToHome}
              onProjectSelect={handleProjectSelect}
              onNavigate={handlePageNavigation}
              onLogoClick={handleLogoClick}
            />
          );
        }
        break;

      case "property-detail":
        if (selectedProject) {
          return (
            <PropertyDetailPage
              project={selectedProject}
              onBack={handleBackToHome}
            />
          );
        }
        break;

      case "developer-detail":
        if (selectedDeveloper) {
          return (
            <DeveloperDetailPage
              developer={selectedDeveloper}
              onBack={handleBackToHome}
            />
          );
        }
        break;

      case "contact-page":
        return <ContactUsPage onBack={handleBackToHome} />;

      case "contact-info":
        return <ContactInfoPage onBack={handleBackToHome} />;

      case "off-plan-investment":
        return <OffPlanInvestmentPage onBack={handleBackToHome} />;

      case "market-analysis":
        return <MarketAnalysisPage onBack={handleBackToHome} />;

      case "property-management":
        return <PropertyManagementPage onBack={handleBackToHome} />;

      case "legal-assistance":
        return <LegalAssistancePage onBack={handleBackToHome} />;

      case "after-sales-support":
        return <AfterSalesSupportPage onBack={handleBackToHome} />;

      case "company-formation":
        return <CompanyFormationPage onBack={handleBackToHome} />;

      case "mortgages":
        return <MortgagesPage onBack={handleBackToHome} />;

      case "golden-visa":
        return <GoldenVisaPage onBack={handleBackToHome} />;

      case "join-us":
        return <JoinUsPage onBack={handleBackToHome} />;

      case "join-as-partner":
        return <JoinAsPartnerPage onBack={handleBackToHome} />;

      case "become-franchisee":
        return <BecomeFranchiseePage onBack={handleBackToHome} />;

      case "about-us":
        return <AboutUsPage onBack={handleBackToHome} />;

      case "developers":
        return (
          <DevelopersPage
            onBack={handleBackToHome}
            onDeveloperSelect={handleDeveloperSelect}
          />
        );

      case "privacy-policy":
        return <PrivacyPolicyPage onBack={handleBackToHome} />;

      case "terms-of-service":
        return <TermsOfServicePage onBack={handleBackToHome} />;

      case "cookie-policy":
        return <CookiePolicyPage onBack={handleBackToHome} />;

      default:
        // Default home page view - preserved exactly as before
        return (
          <main>
            {/* Hero Section */}
            <HeroSection />

            {/* Featured Projects */}
            <FeaturedProjects onProjectSelect={handleProjectSelect} />

            {/* Property Filters & Map */}
            {/* <PropertyFilters onPropertySelect={handleProjectSelect} /> */}
            <PropertyFiltersTesting onPropertySelect={handleProjectSelect} />

            {/* Partners Section */}
            <DevelopersListing
              onPartnerSelect={handleDeveloperSelect}
              displayMode="simple"
              maxItems={8}
            />

            {/* Property Listings */}
            <PropertyListings
              onProjectSelect={handleProjectSelect}
              onLoadMore={() => handlePageNavigation("all-properties")}
            />

            {/* Market Information */}
            <MarketInfo onAreaSelect={handleAreaSelect} />

            {/* About Company */}
            <AboutCompany />

            {/* Testimonials */}
            <Testimonials />

            {/* Contact Us */}
            <ContactUs />
          </main>
        );
    }

    // Fallback to home page
    return <HeroSection />;
  };

  // Determine which classes to apply for smooth transitions
  const getContentClasses = () => {
    const baseClasses = "app-content";

    if (!contentVisible && showSplash) {
      return `${baseClasses} app-content-hidden`;
    } else if (contentVisible && showSplash) {
      return `${baseClasses} app-content-entering`;
    } else if (!showSplash) {
      return `${baseClasses} app-content-visible`;
    }

    return baseClasses;
  };

  return (
    <div className="app-container">
      {/* Splash screen with enhanced exit coordination */}
      {showSplash && (
        <div
          className={`splash-overlay ${
            splashExiting ? "splash-overlay-exiting" : ""
          }`}
        >
          <SplashScreen onComplete={handleSplashComplete} />
        </div>
      )}

      {/* Main content with smooth entrance animation */}
      {isMainContentReady && (
        <div className={getContentClasses()}>{mainContent()}</div>
      )}
    </div>
  );
}
