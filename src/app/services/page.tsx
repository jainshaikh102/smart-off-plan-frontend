"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  TrendingUp,
  Home,
  Scale,
  Headphones,
  FileText,
  CreditCard,
  Award,
  ChevronRight,
} from "lucide-react";

export default function ServicesRoute() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push("/");
  };

  const services = [
    {
      title: "Off-Plan Investment",
      description:
        "Expert guidance on off-plan property investments with comprehensive market analysis.",
      icon: Building2,
      route: "/services/off-plan-investment",
    },
    {
      title: "Market Analysis",
      description:
        "In-depth market research and analysis to help you make informed investment decisions.",
      icon: TrendingUp,
      route: "/services/market-analysis",
    },
    {
      title: "Property Management",
      description:
        "Complete property management services for your real estate portfolio.",
      icon: Home,
      route: "/services/property-management",
    },
    {
      title: "Legal Assistance",
      description:
        "Professional legal support for all your property transactions and documentation.",
      icon: Scale,
      route: "/services/legal-assistance",
    },
    {
      title: "After Sales Support",
      description:
        "Comprehensive support services after your property purchase completion.",
      icon: Headphones,
      route: "/services/after-sales-support",
    },
    {
      title: "Company Formation",
      description: "Business setup and company formation services in the UAE.",
      icon: FileText,
      route: "/services/company-formation",
    },
    {
      title: "Mortgages",
      description:
        "Mortgage consultation and financing solutions for property purchases.",
      icon: CreditCard,
      route: "/services/mortgages",
    },
    {
      title: "Golden Visa",
      description:
        "UAE Golden Visa application assistance and consultation services.",
      icon: Award,
      route: "/services/golden-visa",
    },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      <Navbar onLogoClick={handleLogoClick} currentPage="services" />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="section-padding bg-gradient-to-br from-beige/50 via-ivory to-beige/30">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-[#8b7355] mb-6">
              Our Services
            </h1>
            <p className="text-lg text-[#8b7355]/80 max-w-3xl mx-auto">
              Comprehensive real estate services designed to support your
              property investment journey from start to finish.
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="section-padding">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service, index) => {
                const IconComponent = service.icon;
                return (
                  <Card
                    key={index}
                    className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-beige/20 hover:border-gold/30"
                    onClick={() => router.push(service.route)}
                  >
                    <CardHeader className="text-center">
                      <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-colors">
                        <IconComponent className="w-8 h-8 text-gold" />
                      </div>
                      <CardTitle className="text-[#8b7355] group-hover:text-gold transition-colors">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-[#8b7355]/70 text-sm mb-4">
                        {service.description}
                      </p>
                      <div className="flex items-center text-gold text-sm font-medium group-hover:translate-x-1 transition-transform">
                        Learn More
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
