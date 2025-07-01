import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface TermsOfServicePageProps {
  onBack?: () => void;
}

export function TermsOfServicePage({ onBack }: TermsOfServicePageProps) {
  return (
    <div className="min-h-screen bg-ivory pt-20">
      {/* Page Header */}
      <section className="section-padding bg-[#8b7355] text-white">
        <div className="container">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-white mb-6">Terms of Service</h1>
            <p className="text-tan text-xl leading-relaxed">
              Read our terms of service to understand the rules and guidelines
              for using Smart Off Plan's services.
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
