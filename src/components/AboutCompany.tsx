import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Check,
  ArrowRight,
  Users,
  Shield,
  Download,
  HeadphonesIcon,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const benefits = [
  {
    icon: Shield,
    title: "Expert Developer Access",
    description:
      "Direct partnerships with Dubai's most trusted developers ensuring authentic project information.",
  },
  {
    icon: Download,
    title: "Instant Brochure Downloads",
    description:
      "Access detailed project brochures, floor plans, and pricing instantly without delays.",
  },
  {
    icon: HeadphonesIcon,
    title: "1:1 Investment Consultations",
    description:
      "Personalized investment advice from our certified real estate consultants.",
  },
  {
    icon: Users,
    title: "End-to-End Support",
    description:
      "From property selection to post-purchase services, we guide you through every step.",
  },
];

export function AboutCompany() {
  return (
    <section id="about" className="section-padding bg-[#F5F1EB]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="order-2 lg:order-1">
            <div className="relative">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80"
                alt="Modern Dubai office building"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]"
              />

              {/* Overlay Card */}
              <Card className="absolute -bottom-6 -right-6 bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] rounded-2xl border-0 p-6 max-w-xs">
                <CardContent className="p-0">
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 bg-gold rounded-full mr-2"></div>
                    <span className="text-sm text-[#8b7355]">
                      Live Support Available
                    </span>
                  </div>
                  <p className="text-xs text-warm-gray">
                    Connect with our experts 24/7 for instant assistance
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2">
            <div className="max-w-xl">
              {/* Header */}
              <h2 className="mb-6 text-[rgba(30,26,26,1)] text-nowrap">
                Why Choose Smart Off Plan?
              </h2>

              {/* Description */}
              <p className="text-[rgba(30,26,26,1)] text-lg leading-relaxed mb-8">
                With over a decade of experience in Dubai's property market, we
                provide unparalleled access to verified projects and investment
                opportunities. Our commitment to transparency and excellence has
                made us the trusted choice for international investors.
              </p>

              {/* Key Points */}
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <Check className="w-6 h-6 text-gold mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="mb-1 text-[#8b7355]">
                      Verified Project Portfolio
                    </h4>
                    <p className="text-sm text-[rgba(30,26,26,1)]">
                      Every project in our portfolio is personally vetted and
                      verified by our team
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="w-6 h-6 text-gold mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="mb-1 text-[#8b7355]">Transparent Pricing</h4>
                    <p className="text-sm text-[rgba(30,26,26,1)]">
                      No hidden fees, no surprises - just honest, upfront
                      pricing information
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Check className="w-6 h-6 text-gold mt-1 mr-3 flex-shrink-0" />
                  <div>
                    <h4 className="mb-1 text-[#8b7355]">
                      Post-Purchase Support
                    </h4>
                    <p className="text-sm text-[rgba(30,26,26,1)]">
                      Ongoing assistance with property management, rentals, and
                      resale
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                size="lg"
                className="bg-[rgba(139,115,85,1)] hover:bg-gold text-white hover:text-[#8b7355] mb-8 transition-all duration-300"
              >
                Meet Our Team
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h3 className="text-center mb-12 text-[rgba(30,26,26,1)]">
            Our Core Services
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <Card
                  key={index}
                  className="text-center shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] hover:-translate-y-1 transition-all duration-300 rounded-2xl border-0 group bg-white"
                >
                  <CardContent className="p-8">
                    {/* Icon */}
                    <div className="mb-6 flex justify-center">
                      <div className="relative w-20 h-20 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 cursor-pointer">
                        {/* Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gold via-light-gold to-beige rounded-full shadow-[0_8px_32px_-4px_rgba(212,175,55,0.25),0_4px_16px_-4px_rgba(212,175,55,0.15)] group-hover:shadow-[0_12px_48px_-4px_rgba(212,175,55,0.35),0_8px_24px_-4px_rgba(212,175,55,0.25)] transition-all duration-500"></div>

                        {/* Icon Container */}
                        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-white via-white/95 to-white/90 flex items-center justify-center shadow-inner">
                          <IconComponent className="w-9 h-9 text-[#8b7355] group-hover:text-gold transition-colors duration-300" />
                        </div>

                        {/* Glow Effect */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="mb-3 text-[rgba(30,26,26,1)] group-hover:text-gold transition-colors text-[20px] text-[20px]">
                      {benefit.title}
                    </h4>

                    {/* Description */}
                    <p className="text-[rgba(0,0,0,1)] text-sm leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-3xl text-[#8b7355] mb-2 group-hover:text-gold transition-colors">
                15+
              </div>
              <p className="text-[rgba(0,0,0,1)]">Years Experience</p>
            </div>
            <div className="group">
              <div className="text-3xl text-[#8b7355] mb-2 group-hover:text-gold transition-colors">
                5,000+
              </div>
              <p className="text-[rgba(0,0,0,1)]">Properties Sold</p>
            </div>
            <div className="group">
              <div className="text-3xl text-[#8b7355] mb-2 group-hover:text-gold transition-colors">
                98%
              </div>
              <p className="text-[rgba(0,0,0,1)]">Client Satisfaction</p>
            </div>
            <div className="group">
              <div className="text-3xl text-[#8b7355] mb-2 group-hover:text-gold transition-colors">
                AED 2.5B+
              </div>
              <p className="text-[rgba(0,0,0,1)]">Transaction Value</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
