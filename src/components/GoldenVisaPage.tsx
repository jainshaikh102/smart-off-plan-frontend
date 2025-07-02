import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Home,
  ChevronRight,
  Star,
  Users,
  Calendar,
  Shield,
  CheckCircle,
  TrendingUp,
  Globe,
  Award,
  UserCheck,
  Building2,
  Briefcase,
  Palette,
} from "lucide-react";

interface GoldenVisaPageProps {
  onBack: () => void;
}

export function GoldenVisaPage({ onBack }: GoldenVisaPageProps) {
  const visaTypes = [
    {
      title: "Investor Golden Visa",
      duration: "10 Years",
      investment: "AED 2 Million+",
      description: "For property investors and business owners",
      requirements: [
        "Property investment AED 2M+",
        "Property loan accepted",
        "No income proof required",
        "Family inclusion available",
      ],
      popular: true,
    },
    {
      title: "Entrepreneur Golden Visa",
      duration: "5 Years",
      investment: "Business Setup",
      description: "For business owners and entrepreneurs",
      requirements: [
        "Innovative business project",
        "AED 500K capital",
        "Previous business success",
        "UAE economic contribution",
      ],
      popular: false,
    },
    {
      title: "Skilled Professional",
      duration: "10 Years",
      investment: "Salary Based",
      description: "For highly skilled professionals",
      requirements: [
        "Salary AED 50K+ monthly",
        "PhD/Master's degree",
        "Specialized expertise",
        "10+ years experience",
      ],
      popular: false,
    },
  ];

  const benefits = [
    {
      icon: Calendar,
      title: "Long-term Residency",
      description: "10-year renewable visa with no sponsor required",
    },
    {
      icon: Users,
      title: "Family Inclusion",
      description: "Include spouse, children, and parents in your visa",
    },
    {
      icon: Globe,
      title: "Multiple Entry",
      description: "Unlimited entries to UAE with 6-month grace period",
    },
    {
      icon: Shield,
      title: "Business Freedom",
      description: "100% business ownership and investment flexibility",
    },
    {
      icon: TrendingUp,
      title: "Tax Benefits",
      description: "0% personal income tax and capital gains tax",
    },
    {
      icon: Award,
      title: "Premium Services",
      description: "Fast-track government services and VIP treatment",
    },
  ];

  const process = [
    {
      step: 1,
      title: "Eligibility Check",
      description: "Verify your qualification for Golden Visa categories",
    },
    {
      step: 2,
      title: "Document Preparation",
      description: "Gather and prepare all required documentation",
    },
    {
      step: 3,
      title: "Property Investment",
      description: "Complete qualifying property purchase or business setup",
    },
    {
      step: 4,
      title: "Application Submission",
      description: "Submit application through ICP or approved channels",
    },
    {
      step: 5,
      title: "Approval & Issuance",
      description: "Receive approval and get your Golden Visa issued",
    },
  ];

  const investmentOptions = [
    {
      type: "Off-Plan Property",
      amount: "AED 2M+",
      description: "Investment in approved off-plan developments",
      advantages: [
        "Lower purchase price",
        "Payment plans available",
        "High appreciation potential",
      ],
    },
    {
      type: "Ready Property",
      amount: "AED 2M+",
      description: "Investment in completed residential properties",
      advantages: [
        "Immediate possession",
        "Rental income potential",
        "Established locations",
      ],
    },
    {
      type: "Commercial Property",
      amount: "AED 2M+",
      description: "Investment in commercial real estate",
      advantages: [
        "Higher rental yields",
        "Business use potential",
        "Commercial advantages",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-ivory pt-20">
      {/* Hero Section */}
      <section className="relative section-padding overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-beige/50 via-ivory to-beige/30"></div>
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-gold/5 via-transparent to-transparent"></div>

        {/* Geometric Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-gold/10 to-gold/5 rounded-3xl rotate-12 hidden lg:block"></div>
        <div className="absolute bottom-20 right-40 w-20 h-20 bg-gradient-to-br from-[#8b7355]/10 to-[#8b7355]/5 rounded-2xl -rotate-12 hidden lg:block"></div>
        <div className="absolute top-40 right-60 w-16 h-16 bg-gradient-to-br from-gold/15 to-gold/8 rounded-xl rotate-45 hidden lg:block"></div>

        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gold/10 to-gold/5 rounded-full mb-6">
              <span className="text-[rgba(30,26,26,1)] text-sm font-medium">
                UAE Golden Visa
              </span>
            </div>

            <h1 className="text-[rgba(30,26,26,1)] mb-6 text-[48px]">
              UAE Golden Visa
            </h1>
            <p className="text-[rgba(30,26,26,1)] text-xl leading-relaxed mb-8">
              Secure your future in the UAE with a Golden Visa. Enjoy long-term
              residency, business opportunities, and world-class lifestyle
              benefits.
            </p>
          </div>
        </div>
      </section>

      {/* Golden Visa Types */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-6 text-[36px] text-[40px]">
              Golden Visa Categories
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto">
              Choose the Golden Visa category that best fits your profile and
              investment capacity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {visaTypes.map((visa, index) => (
              <Card
                key={index}
                className={`relative bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] hover:-translate-y-2 transition-all duration-300 rounded-2xl overflow-hidden border-0 ${
                  visa.popular ? "ring-2 ring-gold" : ""
                }`}
              >
                {visa.popular && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="bg-gold text-[#8b7355] text-center py-2 text-sm">
                      Most Popular
                    </div>
                  </div>
                )}
                <CardContent className={`p-8 ${visa.popular ? "pt-12" : ""}`}>
                  <div className="text-center mb-6">
                    <h3 className="text-[rgba(30,26,26,1)] mb-3 text-[24px]">
                      {visa.title}
                    </h3>
                    <div className="text-3xl text-gold mb-2 font-bold">
                      {visa.duration}
                    </div>
                    <p className="text-[rgba(30,26,26,0.8)] mb-4 text-[16px]">
                      {visa.description}
                    </p>
                    <Badge className="bg-beige text-[#8b7355]">
                      {visa.investment}
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-8">
                    {visa.requirements.map((requirement, reqIndex) => (
                      <div key={reqIndex} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-gold mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[rgba(30,26,26,0.7)]">
                          {requirement}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${
                      visa.popular
                        ? "bg-gold hover:bg-gold/90 text-[#8b7355]"
                        : "bg-[#8b7355] hover:bg-[#8b7355]/90 text-white"
                    } transition-all duration-300`}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding bg-beige">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-6 text-[36px] text-[40px]">
              Golden Visa Benefits
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto">
              Enjoy exclusive privileges and benefits that come with UAE Golden
              Visa status
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] group-hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] group-hover:-translate-y-1 transition-all duration-300">
                  <benefit.icon className="w-8 h-8 text-gold" />
                </div>
                <h4 className="text-[rgba(30,26,26,1)] mb-4">
                  {benefit.title}
                </h4>
                <p className="text-[rgba(30,26,26,0.8)] text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compact Eligibility & Benefits */}
      <section className="py-16 bg-gradient-to-br from-gold/5 to-gold/10">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-[rgba(30,26,26,1)] mb-4 text-[36px] text-[40px]">
              Eligibility & Key Benefits
            </h2>
            <p className="text-[rgba(30,26,26,1)] max-w-2xl mx-auto">
              Quick overview of who qualifies and the exclusive advantages of
              UAE Golden Visa
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Eligibility */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
              <div className="flex items-center mb-[24px] mt-[0px] mr-[0px] ml-[0px]">
                <div className="w-12 h-12 bg-gradient-to-br from-gold to-gold/80 rounded-xl flex items-center justify-center mr-4">
                  <UserCheck className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-[rgba(30,26,26,1)] text-[24px] text-[24px]">
                  Who is Eligible for a Golden Visa?
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-[rgba(30,26,26,1)] text-sm mb-1">
                      Investors & Business Owners
                    </div>
                    <div className="text-warm-gray text-xs">
                      Start a company or invest in the UAE
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-[rgba(30,26,26,1)] text-sm mb-1">
                      Real Estate Investors
                    </div>
                    <div className="text-warm-gray text-xs">
                      Buy property worth AED 2 million+
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-[rgba(30,26,26,1)] text-sm mb-1">
                      Highly Skilled Professionals
                    </div>
                    <div className="text-warm-gray text-xs">
                      Doctors, engineers, IT experts, and executives
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-[#8b7355] text-sm mb-1">
                      Exceptional Talents
                    </div>
                    <div className="text-warm-gray text-xs">
                      Artists, scientists, and inventors
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#8b7355] to-[#8b7355]/80 rounded-xl flex items-center justify-center mr-4">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-[rgba(30,26,26,1)] text-[24px]">
                  Golden Visa Benefits
                </h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8b7355] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-[rgba(30,26,26,1)] text-sm mb-1">
                      5 or 10-Year Residency
                    </div>
                    <div className="text-warm-gray text-xs">
                      No need for visa renewals every 2-3 years
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8b7355] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-[rgba(30,26,26,1)] text-sm mb-1">
                      No Local Sponsor Required
                    </div>
                    <div className="text-warm-gray text-xs">
                      Full independence to live and work in the UAE
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8b7355] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-[rgba(30,26,26,1)] text-sm mb-1">
                      Family Sponsorship
                    </div>
                    <div className="text-warm-gray text-xs">
                      Bring your spouse, children, and domestic staff
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#8b7355] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <div className="text-[rgba(30,26,26,1)] text-sm mb-1">
                      Easy Travel & Business Expansion
                    </div>
                    <div className="text-warm-gray text-xs">
                      Open bank accounts, set up businesses, and access global
                      opportunities
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Button className="bg-gold hover:bg-gold/90 text-[rgba(255,255,255,1)] px-8">
              Learn More About Golden Visa
            </Button>
          </div>
        </div>
      </section>

      {/* Investment Options */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-6 text-[36px]">
              Investment Options
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto">
              Multiple investment paths to qualify for your Golden Visa through
              real estate
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {investmentOptions.map((option, index) => (
              <Card
                key={index}
                className="bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] hover:-translate-y-1 transition-all duration-300 rounded-2xl border-0"
              >
                <CardContent className="p-8">
                  <h4 className="text-[rgba(30,26,26,1)] mb-3">
                    {option.type}
                  </h4>
                  <div className="text-2xl text-gold mb-4">{option.amount}</div>
                  <p className="text-[rgba(30,26,26,1)] mb-6">
                    {option.description}
                  </p>

                  <div className="space-y-2">
                    {option.advantages.map((advantage, advIndex) => (
                      <div key={advIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                        <span className="text-sm text-[rgba(30,26,26,0.8)]">
                          {advantage}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-beige">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-6 text-[36px] text-[40px]">
              Application Process
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto">
              Our streamlined process ensures a smooth application journey from
              start to finish
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {process.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 text-[#8b7355] text-xl shadow-lg">
                    {step.step}
                  </div>
                  <h4 className="text-[rgba(30,26,26,1)] mb-4 text-[24px]">
                    {step.title}
                  </h4>
                  <p className="text-[rgba(30,26,26,0.8)] text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Connecting Line */}
            <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-gold/30 -z-10"></div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#8b7355] text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-white mb-6 text-[36px] text-[40px]">
              Start Your Golden Visa Journey
            </h2>
            <p className="text-tan text-lg mb-8 leading-relaxed">
              Take the first step towards securing your future in the UAE. Our
              experts will guide you through every step of the Golden Visa
              application process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gold hover:bg-gold/90 text-[rgba(255,255,255,1)] px-8 py-3 text-lg text-[14px] text-[15px] text-[16px]">
                <Star className="w-5 h-5 mr-2" />
                Check Eligibility
              </Button>
              <Button
                variant="outline"
                className="border-white text-[rgba(30,26,26,1)] hover:bg-white hover:text-[#8b7355] px-8 py-3 text-lg text-[14px]"
              >
                Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
