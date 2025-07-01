import { Button } from "./ui/button";
import { Home, ChevronRight } from "lucide-react";
import { DevelopersListing } from "./DevelopersListing";

interface DevelopersPageProps {
  onBack: () => void;
  onDeveloperSelect: (developer: any) => void;
}

export function DevelopersPage({
  onBack,
  onDeveloperSelect,
}: DevelopersPageProps) {
  return (
    <div className="min-h-screen bg-ivory pt-20">
      {/* Enhanced Hero Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-beige/50 via-ivory to-beige/30"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-gold/5 via-transparent to-transparent"></div>

        {/* Geometric Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-gold/10 to-gold/5 rounded-3xl rotate-12 hidden lg:block"></div>
        <div className="absolute bottom-20 right-40 w-20 h-20 bg-gradient-to-br from-[#8b7355]/10 to-[#8b7355]/5 rounded-2xl -rotate-12 hidden lg:block"></div>
        <div className="absolute top-40 right-60 w-16 h-16 bg-gradient-to-br from-gold/15 to-gold/8 rounded-xl rotate-45 hidden lg:block"></div>

        <div className="container relative z-10">
          {/* Elegant Breadcrumb Navigation */}

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gold/10 to-gold/5 rounded-full mb-6">
              <span className="text-[rgba(30,26,26,1)] text-sm font-medium">
                Dubai's Premier Developers
              </span>
            </div>

            <h1 className="text-[rgba(30,26,26,1)] mb-6 text-[48px]">
              Our Developer Partners
            </h1>
            <p className="text-[rgba(30,26,26,1)] text-xl leading-relaxed mb-8">
              Discover Dubai's leading property developers and their exceptional
              portfolio of luxury developments. Each partner is carefully
              selected for their proven track record and commitment to
              excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Developers Listing */}
      <DevelopersListing onPartnerSelect={onDeveloperSelect} />
    </div>
  );
}
