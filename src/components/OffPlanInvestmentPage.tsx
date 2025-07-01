import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface OffPlanInvestmentPageProps {
  onBack?: () => void;
}

export function OffPlanInvestmentPage({ onBack }: OffPlanInvestmentPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory to-beige">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-[#8b7355]/10">
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-[#8b7355] hover:text-gold hover:bg-beige/50 transition-all duration-300 rounded-xl px-3 py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <span className="text-warm-gray">•</span>
            <span className="text-[#8b7355]">Off-Plan Investment</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <section className="section-padding bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-[#8b7355] mb-6">Off-Plan Investment</h1>
            <p className="text-warm-gray text-xl leading-relaxed">
              Discover the advantages of investing in Dubai's off-plan
              properties with guaranteed returns and flexible payment plans.
            </p>
          </div>
        </div>
      </section>

      {/* Content will be added here in future */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center">
            <p className="text-warm-gray text-lg">Content coming soon...</p>
          </div>
        </div>
      </section>
    </div>
  );
}
