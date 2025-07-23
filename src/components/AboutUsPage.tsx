import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import {
  ArrowLeft,
  Building2,
  TrendingUp,
  DollarSign,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  Users,
  FileText,
  ArrowRight,
  Clock,
  Target,
  Award,
  MessageCircle,
  Phone,
  Timer,
  BarChart3,
  CreditCard,
  Settings,
  ShieldCheck,
  Star,
  TrendingDown,
  MapPin,
  ChevronRight,
  Home,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AboutUsPageProps {
  onBack: () => void;
}

export function AboutUsPage({ onBack }: AboutUsPageProps) {
  const [activeTimelineStep, setActiveTimelineStep] = useState(0);
  const router = useRouter();

  // WhatsApp helper functions
  const handleWhatsAppMessage = (message: string) => {
    const phoneNumber = "+971543218123";
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleGetExpertConsultation = () => {
    const message = `Hello! I'm interested in getting expert consultation about off-plan property investment in Dubai.

I would like to discuss:
- Investment opportunities and market insights
- Property selection and evaluation
- Legal and financial guidance
- Risk assessment and mitigation
- Investment strategy and planning
- Market trends and future prospects

Could you please connect me with one of your real estate experts for a detailed consultation? I'm looking forward to professional guidance for my investment journey.`;

    handleWhatsAppMessage(message);
  };

  const handleScheduleConsultation = () => {
    const message = `Hello! I would like to schedule a consultation to discuss off-plan property investment opportunities.

I'm interested in:
- Understanding the Dubai off-plan market
- Investment options and recommendations
- Legal and financial requirements
- Property selection guidance
- Investment timeline and process
- Risk management strategies

Could you please help me schedule a convenient time for a detailed consultation with your team? Thank you!`;

    handleWhatsAppMessage(message);
  };

  const advantages = [
    {
      icon: DollarSign,
      title: "Lower Entry Prices",
      description:
        "Off-plan properties are typically priced 20-30% below market value, offering significant savings compared to ready properties.",
      highlight: "20-30% Savings",
      color: "text-gold",
    },
    {
      icon: TrendingUp,
      title: "Capital Appreciation",
      description:
        "Properties often appreciate 15-25% from launch to completion, providing substantial returns on investment.",
      highlight: "15-25% Growth",
      color: "text-[#8b7355]",
    },
    {
      icon: Calendar,
      title: "Flexible Payment Plans",
      description:
        "Spread payments over construction period with minimal initial deposits, improving cash flow management.",
      highlight: "Flexible Terms",
      color: "text-gold",
    },
    {
      icon: Building2,
      title: "Latest Designs & Technology",
      description:
        "Brand new properties with modern amenities, smart home features, and contemporary architectural designs.",
      highlight: "Modern Living",
      color: "text-[#8b7355]",
    },
    {
      icon: Target,
      title: "Prime Location Access",
      description:
        "Secure units in highly sought-after developments before they're completed and prices increase.",
      highlight: "Prime Locations",
      color: "text-gold",
    },
    {
      icon: Award,
      title: "Developer Incentives",
      description:
        "Exclusive offers, payment plan benefits, and special terms available only during pre-launch phases.",
      highlight: "Exclusive Deals",
      color: "text-[#8b7355]",
    },
  ];

  const risks = [
    {
      icon: Timer,
      title: "Construction Delays",
      description:
        "Projects may face delays due to market conditions, permits, or unforeseen circumstances.",
      mitigation: "Choose established developers with proven track records",
      iconColor: "text-orange-500",
      bgColor: "from-orange-100 to-orange-50",
    },
    {
      icon: BarChart3,
      title: "Market Fluctuations",
      description:
        "Property values may change during the construction period due to market dynamics.",
      mitigation: "Research market trends and choose prime locations",
      iconColor: "text-red-500",
      bgColor: "from-red-100 to-red-50",
    },
    {
      icon: CreditCard,
      title: "Developer Financial Issues",
      description:
        "Developer financial difficulties could impact project completion.",
      mitigation: "Verify developer credentials and financial stability",
      iconColor: "text-purple-500",
      bgColor: "from-purple-100 to-purple-50",
    },
    {
      icon: Settings,
      title: "Specification Changes",
      description:
        "Final specifications may differ slightly from initial marketing materials.",
      mitigation:
        "Review contracts carefully and document agreed specifications",
      iconColor: "text-blue-500",
      bgColor: "from-blue-100 to-blue-50",
    },
  ];

  const timelineSteps = [
    {
      phase: "Research & Selection",
      duration: "1-2 Weeks",
      description:
        "Property research, location analysis, and developer verification",
      icon: FileText,
      color: "bg-gold",
    },
    {
      phase: "Booking & Reservation",
      duration: "1-3 Days",
      description:
        "Unit reservation with booking fee and initial documentation",
      icon: CheckCircle,
      color: "bg-[#8b7355]",
    },
    {
      phase: "Contract Signing",
      duration: "1-2 Weeks",
      description: "Sales purchase agreement review and contract execution",
      icon: FileText,
      color: "bg-gold",
    },
    {
      phase: "Payment Schedule",
      duration: "24-36 Months",
      description: "Installment payments linked to construction milestones",
      icon: Calendar,
      color: "bg-[#8b7355]",
    },
    {
      phase: "Construction Phase",
      duration: "24-36 Months",
      description: "Property construction with regular progress updates",
      icon: Building2,
      color: "bg-gold",
    },
    {
      phase: "Pre-Handover",
      duration: "3-6 Months",
      description: "Final inspections, snagging, and completion preparations",
      icon: Shield,
      color: "bg-[#8b7355]",
    },
    {
      phase: "Handover & Ownership",
      duration: "1-2 Weeks",
      description:
        "Key handover, title deed transfer, and property registration",
      icon: Award,
      color: "bg-gold",
    },
  ];

  const faqs = [
    {
      question: "What exactly is an off-plan property?",
      answer:
        "An off-plan property is a real estate investment where you purchase a property before it's built or completed. You're essentially buying based on architectural plans, 3D renderings, and developer specifications. Payment is typically made in installments during the construction phase.",
    },
    {
      question: "How much deposit do I need for off-plan property in Dubai?",
      answer:
        "Deposits for off-plan properties in Dubai typically range from 5-20% of the total property value. The exact amount depends on the developer, project type, and payment plan. Many developers offer flexible payment schedules with low initial deposits.",
    },
    {
      question: "Is off-plan investment safe in Dubai?",
      answer:
        "Dubai has robust regulations protecting off-plan investors. The Dubai Land Department (DLD) regulates all developments, and funds are held in escrow accounts. Additionally, developers must obtain permits and approvals before selling units, providing investor protection.",
    },
    {
      question: "Can foreigners buy off-plan properties in Dubai?",
      answer:
        "Yes, foreigners can purchase off-plan properties in designated freehold areas of Dubai. This includes popular areas like Dubai Marina, Downtown Dubai, Palm Jumeirah, and many other prime locations. Foreign ownership is 100% freehold in these areas.",
    },
    {
      question: "What happens if the developer faces financial difficulties?",
      answer:
        "Dubai's regulatory framework includes several protections: escrow accounts for buyer funds, developer registration requirements, and project insurance. If issues arise, the DLD can facilitate solutions, including project transfers to other developers.",
    },
    {
      question: "How long does off-plan construction typically take?",
      answer:
        "Construction timelines vary by project size and complexity, typically ranging from 18 months to 4 years. Apartments and townhouses usually take 2-3 years, while larger developments with amenities may take 3-4 years. Developers provide estimated completion dates in contracts.",
    },
    {
      question: "Can I get a mortgage for off-plan properties?",
      answer:
        "Yes, many UAE banks offer off-plan mortgages. However, terms may differ from ready property mortgages. Typically, you'll need to pay the initial installments yourself, and the mortgage begins closer to completion. Down payments for off-plan mortgages are usually higher.",
    },
    {
      question: "What are the additional costs when buying off-plan?",
      answer:
        "Additional costs include Dubai Land Department registration fees (4% of property value), real estate agent commission (2%), mortgage processing fees (if applicable), and legal fees. These costs are typically paid upon completion or during the process.",
    },
  ];

  const gettingStartedSteps = [
    {
      step: "1",
      title: "Define Your Investment Goals",
      description:
        "Determine your budget, investment timeline, and whether you're buying for capital appreciation, rental income, or personal use.",
    },
    {
      step: "2",
      title: "Research Developers & Projects",
      description:
        "Investigate developer track records, project locations, amenities, and payment plans. Focus on established developers with successful completions.",
    },
    {
      step: "3",
      title: "Secure Financing (If Needed)",
      description:
        "Explore mortgage options, get pre-approved if necessary, and understand the payment schedule alignment with your financial capacity.",
    },
    {
      step: "4",
      title: "Professional Consultation",
      description:
        "Engage with real estate experts, legal advisors, and financial consultants to ensure informed decision-making.",
    },
    {
      step: "5",
      title: "Make Your Investment",
      description:
        "Complete due diligence, review all documentation, and proceed with booking your chosen off-plan property.",
    },
  ];

  const heroStats = [
    {
      icon: Building2,
      value: "500+",
      label: "Off-Plan Projects",
      color: "text-gold",
    },
    {
      icon: TrendingUp,
      value: "25%",
      label: "Average ROI",
      color: "text-[#8b7355]",
    },
    {
      icon: Users,
      value: "10,000+",
      label: "Satisfied Investors",
      color: "text-gold",
    },
    {
      icon: Star,
      value: "4.9",
      label: "Client Rating",
      color: "text-[#8b7355]",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory to-beige">
      {/* Enhanced Breadcrumb Navigation */}
      {/* <div className="bg-white border-b border-[#8b7355]/10">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={onBack}
                    className="flex items-center gap-2 text-[#8b7355] hover:text-gold transition-colors duration-300 cursor-pointer"
                  >
                    <Home className="w-4 h-4" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-warm-gray" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-[#8b7355] font-medium">
                    About Us
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="text-[#8b7355] hover:text-gold hover:bg-beige/50 transition-all duration-300 rounded-xl px-3 py-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div> */}

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gold/10 to-gold/5 rounded-full">
                  <Building2 className="w-5 h-5 text-gold mr-2" />
                  <span className="text-[rgba(30,26,26,1)] text-sm font-medium">
                    Dubai Property Investment Guide
                  </span>
                </div>

                <h1 className="text-[rgba(30,26,26,1)] leading-tight text-[40px]">
                  What is <span className="text-gold">Off-Plan</span>{" "}
                  Investment?
                </h1>

                <p className="text-[rgba(30,26,26,1)] text-xl leading-relaxed">
                  Discover the world of off-plan property investment in Dubai -
                  from understanding the basics to maximizing your returns in
                  one of the world's most dynamic real estate markets.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  className="bg-gold hover:bg-gold/90 text-[rgba(255,255,255,1)] px-8 py-4 rounded-xl group"
                  onClick={() => router.push("/properties")}
                >
                  <Building2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Browse Off-Plan Properties
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button
                  variant="outline"
                  className="border-[#8b7355] text-[rgba(30,26,26,1)] hover:bg-[#8b7355] hover:text-white px-8 py-4 rounded-xl group"
                  onClick={handleGetExpertConsultation}
                >
                  <MessageCircle className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Speak with Expert
                </Button>
              </div>

              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 gap-6 pt-8 border-t border-[#8b7355]/10">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
                    <span className="text-[#8b7355] text-2xl">2-4 Years</span>
                  </div>
                  <p className="text-[rgba(30,26,26,1)] text-sm">
                    Typical Construction Period
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-[#8b7355] rounded-full mr-3"></div>
                    <span className="text-[#8b7355] text-2xl">5-20%</span>
                  </div>
                  <p className="text-[rgba(30,26,26,1)] text-sm">
                    Initial Deposit Range
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual Area */}
            <div className="relative">
              {/* Main Stats Grid */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {heroStats.map((stat, index) => (
                  <Card
                    key={index}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_12px_40px_-4px_rgba(139,115,85,0.15),0_6px_20px_-4px_rgba(139,115,85,0.1)] hover:-translate-y-2 transition-all duration-300 border-0 group"
                  >
                    <CardContent className="p-6 text-center">
                      <div
                        className={`w-12 h-12 ${
                          stat.color === "text-gold"
                            ? "bg-gold/10"
                            : "bg-[#8b7355]/10"
                        } rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <stat.icon className={`w-6 h-6 ${stat.color}`} />
                      </div>
                      <div className={`text-2xl mb-2 ${stat.color}`}>
                        {stat.value}
                      </div>
                      <p className="text-[rgba(30,26,26,1)] text-sm">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Feature Highlight Card */}
              <Card className="bg-gradient-to-br from-gold via-gold/90 to-gold/80 text-white rounded-3xl shadow-[0_8px_32px_-4px_rgba(212,175,55,0.3),0_4px_16px_-4px_rgba(212,175,55,0.2)] border-0 overflow-hidden group">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                      Market Leader
                    </Badge>
                  </div>

                  <h4 className="text-white mb-4 text-xl">
                    Dubai's #1 Off-Plan Platform
                  </h4>
                  <p className="text-white/90 text-sm leading-relaxed mb-6">
                    Trusted by thousands of investors worldwide for premium
                    off-plan opportunities in Dubai's most sought-after
                    developments.
                  </p>

                  <div className="flex items-center">
                    <div className="flex items-center mr-6">
                      <MapPin className="w-4 h-4 text-white/80 mr-2" />
                      <span className="text-white/90 text-sm">Dubai, UAE</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-white/80 mr-2" />
                      <span className="text-white/90 text-sm">
                        4.9/5 Rating
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-gold/20 rounded-full animate-pulse"></div>
              <div
                className="absolute -bottom-4 -left-4 w-6 h-6 bg-[#8b7355]/20 rounded-full animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Off-Plan Section */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-[rgba(30,26,26,1)] mb-8 text-[36px] text-[40px]">
                Understanding Off-Plan Investment
              </h2>
              <div className="space-y-6">
                <p className="text-[rgba(30,26,26,1)] text-lg leading-relaxed">
                  Off-plan property investment involves purchasing real estate
                  before construction is completed, often during the planning or
                  early construction phases. This investment strategy has become
                  increasingly popular in Dubai's dynamic property market.
                </p>
                <p className="text-[rgba(30,26,26,1)] text-lg leading-relaxed">
                  Investors purchase based on architectural plans, 3D
                  renderings, and showroom displays, with payments typically
                  structured over the construction period. This approach offers
                  unique advantages including lower entry costs and potential
                  for significant capital appreciation.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-beige rounded-2xl p-6">
                    <div className="text-2xl text-gold mb-2">2-4 Years</div>
                    <div className="text-[rgba(30,26,26,1)] text-sm">
                      Typical Construction Period
                    </div>
                  </div>
                  <div className="bg-beige rounded-2xl p-6">
                    <div className="text-2xl text-gold mb-2">5-20%</div>
                    <div className="text-[rgba(30,26,26,1)] text-sm">
                      Initial Deposit Range
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-gold to-[#8b7355] rounded-3xl p-8 text-white">
                <h3 className="text-white mb-6 text-2xl">
                  Key Characteristics
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-white mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <div className="text-white mb-1">
                        Pre-Construction Purchase
                      </div>
                      <div className="text-white/80 text-sm">
                        Buy before the property is built
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-white mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <div className="text-white mb-1">
                        Installment Payments
                      </div>
                      <div className="text-white/80 text-sm">
                        Pay in stages during construction
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-white mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <div className="text-white mb-1">
                        Below Market Pricing
                      </div>
                      <div className="text-white/80 text-sm">
                        Access to pre-launch discounts
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-white mt-1 mr-4 flex-shrink-0" />
                    <div>
                      <div className="text-white mb-1">New & Modern</div>
                      <div className="text-white/80 text-sm">
                        Latest designs and technology
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="section-padding bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-8 text-[36px] text-[40px]">
              Advantages of Off-Plan Investment
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto leading-relaxed">
              Off-plan investment offers compelling benefits that make it an
              attractive option for both seasoned investors and first-time
              buyers in Dubai's property market.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <Card
                key={index}
                className="bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_12px_40px_-4px_rgba(139,115,85,0.15),0_6px_20px_-4px_rgba(139,115,85,0.1)] hover:-translate-y-2 transition-all duration-300 border-0 overflow-hidden group"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <advantage.icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-gold/10 text-gold border-gold/20 text-xs px-3 py-1"
                    >
                      {advantage.highlight}
                    </Badge>
                  </div>

                  <h4 className="text-[rgba(30,26,26,1)] mb-4 group-hover:text-gold transition-colors">
                    {advantage.title}
                  </h4>

                  <p className="text-[rgba(30,26,26,0.8)] text-sm leading-relaxed flex-grow">
                    {advantage.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Construction Timeline */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-8 text-[36px] text-[40px]">
              Off-Plan Investment Journey
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto leading-relaxed">
              Follow the complete journey from property selection to handover.
              Understanding each phase helps you plan and track your investment
              progress.
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-gold via-[#8b7355] to-gold hidden lg:block"></div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
              {timelineSteps.map((step, index) => (
                <div key={index} className="relative">
                  <Card
                    className={`bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] transition-all duration-300 border-0 cursor-pointer group ${
                      activeTimelineStep === index ? "ring-2 ring-gold" : ""
                    }`}
                    onClick={() => setActiveTimelineStep(index)}
                  >
                    <CardContent className="p-6 text-center">
                      {/* Timeline Dot */}
                      <div
                        className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 relative`}
                      >
                        <step.icon className="w-6 h-6 text-white" />
                        {/* Timeline connector line for mobile */}
                        {index < timelineSteps.length - 1 && (
                          <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gradient-to-b from-gold to-[#8b7355] lg:hidden"></div>
                        )}
                      </div>

                      <h4 className="text-[rgba(30,26,26,1)] mb-2 text-sm group-hover:text-gold transition-colors">
                        {step.phase}
                      </h4>

                      <div className="text-gold text-xs mb-3">
                        {step.duration}
                      </div>

                      <p className="text-[rgba(30,26,26,0.8)] text-xs leading-relaxed">
                        {step.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Details */}
          {activeTimelineStep !== null && (
            <div className="mt-12 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 rounded-3xl p-8 border border-gold/20">
              <div className="text-center">
                <h4 className="text-[rgba(30,26,26,1)] mb-4 text-2xl">
                  {timelineSteps[activeTimelineStep].phase}
                </h4>
                <p className="text-[rgba(30,26,26,1)] mb-6 max-w-2xl mx-auto leading-relaxed">
                  {timelineSteps[activeTimelineStep].description}
                </p>
                <Badge
                  className="bg-gold text-white px-4 py-2"
                  onClick={() => router.push("/properties")}
                >
                  Duration: {timelineSteps[activeTimelineStep].duration}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Risks & Considerations */}
      <section className="section-padding bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-8 text-[36px] text-[40px]">
              Understanding the Risks
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto leading-relaxed">
              While off-plan investment offers great opportunities, it's
              important to understand potential risks and how to mitigate them
              through informed decision-making.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {risks.map((risk, index) => {
              const IconComponent = risk.icon;
              return (
                <Card
                  key={index}
                  className="bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] hover:-translate-y-1 transition-all duration-300 border-0"
                >
                  <CardContent className="p-8">
                    <div className="flex items-start mb-6">
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${risk.bgColor} rounded-xl flex items-center justify-center mr-4 flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}
                      >
                        <IconComponent
                          className={`w-6 h-6 ${risk.iconColor}`}
                        />
                      </div>
                      <div>
                        <h4 className="text-[rgba(30,26,26,1)] mb-2 group-hover:text-gold transition-colors">
                          {risk.title}
                        </h4>
                        <p className="text-[rgba(30,26,26,0.7)] text-sm leading-relaxed mb-4">
                          {risk.description}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100/50">
                      <div className="flex items-start">
                        <ShieldCheck className="w-5 h-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                        <div>
                          <div className="text-green-800 text-sm mb-1">
                            Risk Mitigation
                          </div>
                          <div className="text-green-700 text-xs leading-relaxed">
                            {risk.mitigation}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
              <h4 className="text-[rgba(30,26,26,1)] mb-4">
                Professional Guidance is Key
              </h4>
              <p className="text-[rgba(30,26,26,1)] mb-6 max-w-2xl mx-auto">
                Working with experienced real estate professionals, legal
                advisors, and established developers significantly reduces risks
                and enhances your investment success.
              </p>
              <Button
                className="bg-gold hover:bg-gold/90 text-[rgba(255,255,255,1)] px-8"
                onClick={handleGetExpertConsultation}
              >
                Get Expert Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How to Get Started */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-8 text-[36px] text-[40px]">
              How to Get Started
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto leading-relaxed">
              Ready to begin your off-plan investment journey? Follow these
              essential steps to make informed decisions and maximize your
              investment potential.
            </p>
          </div>

          <div className="space-y-8">
            {gettingStartedSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] transition-all duration-300 border-0 overflow-hidden">
                  <CardContent className="p-8">
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/80 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0">
                        <span className="text-white text-2xl">{step.step}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[rgba(30,26,26,1)] mb-4 text-xl">
                          {step.title}
                        </h4>
                        <p className="text-[rgba(30,26,26,0.7)] leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Connector Line */}
                {index < gettingStartedSteps.length - 1 && (
                  <div className="flex justify-center my-4">
                    <div className="w-1 h-8 bg-gradient-to-b from-gold to-[#8b7355]"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-8 text-[36px] text-[40px]">
              Frequently Asked Questions
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto leading-relaxed">
              Get answers to the most common questions about off-plan property
              investment in Dubai.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-2xl border-0 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]"
                >
                  <AccordionTrigger className="px-8 py-6 text-left hover:no-underline [&[data-state=open]]:text-gold">
                    <span className="hover:text-gold transition-colors pr-4 text-[rgba(30,26,26,0.8)]">
                      {faq.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="px-8 pb-6">
                    <p className="text-[rgba(30,26,26,0.7)] leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-[#8b7355] to-gold text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-white mb-8 text-[36px] text-[40px]">
              Ready to Start Your Off-Plan Investment Journey?
            </h2>
            <p className="text-white/90 text-lg mb-10 leading-relaxed">
              Take the first step towards building your property portfolio in
              Dubai. Our experts are ready to guide you through every aspect of
              off-plan investment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-[#8b7355] hover:bg-white/90 px-8 py-4 text-lg rounded-xl text-[14px]"
                onClick={handleScheduleConsultation}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Schedule Consultation
              </Button>
              <Button
                className="bg-white text-[rgba(30,26,26,1)] hover:bg-transparent border-solid border-[1px] border-white px-8 py-4 text-lg rounded-xl text-[14px]"
                onClick={() => router.push("/properties")}
              >
                <Building2 className="w-5 h-5 mr-2" />
                View Available Projects
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
