import { useState, useRef } from "react";
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
  Home,
  ChevronRight,
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
  Briefcase,
  Globe,
  Scale,
  BookOpen,
  Zap,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CompanyFormationPageProps {
  onBack: () => void;
}

export function CompanyFormationPage({ onBack }: CompanyFormationPageProps) {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedCompanyType, setSelectedCompanyType] = useState<string | null>(
    null
  );
  const companyTypesRef = useRef<HTMLElement>(null);

  const advantages = [
    {
      icon: Globe,
      title: "Global Business Hub",
      description:
        "Dubai's strategic location connects East and West, making it ideal for international business operations.",
      highlight: "Strategic Location",
      color: "text-gold",
    },
    {
      icon: DollarSign,
      title: "Tax Advantages",
      description:
        "0% corporate tax for qualifying activities, no personal income tax, and minimal business setup costs.",
      highlight: "Tax Benefits",
      color: "text-[#8b7355]",
    },
    {
      icon: Scale,
      title: "100% Foreign Ownership",
      description:
        "Complete business ownership for foreign investors in designated free zones and mainland.",
      highlight: "Full Ownership",
      color: "text-gold",
    },
    {
      icon: Zap,
      title: "Fast Setup Process",
      description:
        "Quick and efficient company registration process with minimal bureaucracy and digital solutions.",
      highlight: "Quick Setup",
      color: "text-[#8b7355]",
    },
    {
      icon: Shield,
      title: "Business-Friendly Laws",
      description:
        "Robust legal framework protecting business interests with modern commercial laws.",
      highlight: "Legal Protection",
      color: "text-gold",
    },
    {
      icon: Building2,
      title: "World-Class Infrastructure",
      description:
        "State-of-the-art facilities, modern offices, and excellent connectivity for businesses.",
      highlight: "Infrastructure",
      color: "text-[#8b7355]",
    },
  ];

  const companyTypes = [
    {
      type: "Free Zone Company",
      description:
        "100% foreign ownership, tax exemptions, and streamlined processes",
      benefits: [
        "0% corporate tax",
        "100% profit repatriation",
        "No currency restrictions",
        "Simplified setup",
      ],
      timeframe: "7-14 days",
      minCapital: "No minimum",
      suitableFor: "Trading, consulting, e-commerce, technology",
    },
    {
      type: "Mainland LLC",
      description:
        "Local market access with UAE national partner or service agent",
      benefits: [
        "Direct UAE market access",
        "Government contract eligibility",
        "Local banking advantages",
        "Visa sponsorship",
      ],
      timeframe: "14-21 days",
      minCapital: "AED 300,000",
      suitableFor: "Local trading, contracting, professional services",
    },
    {
      type: "Offshore Company",
      description:
        "International business operations with asset protection benefits",
      benefits: [
        "Privacy protection",
        "Asset security",
        "International business",
        "Flexible ownership",
      ],
      timeframe: "3-7 days",
      minCapital: "No minimum",
      suitableFor: "Holding companies, international trading, investment",
    },
  ];

  // WhatsApp helper functions
  const handleWhatsAppMessage = (message: string) => {
    const phoneNumber = "+971543218123";
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleLearnMoreWhatsApp = (companyType: string) => {
    const selectedType = companyTypes.find((type) => type.type === companyType);
    if (selectedType) {
      const message = `Hello! I'm interested in learning more about ${selectedType.type} formation in Dubai.

Key details I'd like to know more about:
- Setup timeframe: ${selectedType.timeframe}
- Minimum capital: ${selectedType.minCapital}
- Suitable for: ${selectedType.suitableFor}

Could you please provide more detailed information and guidance on the formation process?`;

      handleWhatsAppMessage(message);
    }
  };

  const handleFreeConsultationWhatsApp = () => {
    const message = `Hello! I'm interested in starting my business in Dubai and would like to schedule a free consultation.

I would like to discuss:
- Company formation options
- Legal requirements
- Setup process and timeline
- Costs and documentation needed

Could you please help me get started with the consultation process?`;

    handleWhatsAppMessage(message);
  };

  const scrollToCompanyTypes = () => {
    if (companyTypesRef.current) {
      companyTypesRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const setupSteps = [
    {
      step: "1",
      title: "Business Plan & Name Reservation",
      description:
        "Define your business activities and reserve your preferred company name",
      duration: "1-2 days",
      requirements: [
        "Business activity selection",
        "Name availability check",
        "Initial approvals",
      ],
    },
    {
      step: "2",
      title: "Document Preparation",
      description: "Prepare and authenticate all required legal documents",
      duration: "3-5 days",
      requirements: [
        "Passport copies",
        "Educational certificates",
        "Experience letters",
        "Bank statements",
      ],
    },
    {
      step: "3",
      title: "License Application",
      description: "Submit application to relevant authorities and free zone",
      duration: "5-7 days",
      requirements: [
        "Completed application",
        "Fee payment",
        "Document submission",
        "Authority review",
      ],
    },
    {
      step: "4",
      title: "Registration & Setup",
      description: "Complete registration and setup business operations",
      duration: "3-5 days",
      requirements: [
        "License issuance",
        "Bank account opening",
        "Visa processing",
        "Office setup",
      ],
    },
  ];

  const documents = [
    "Passport copy (notarized)",
    "Educational certificates (attested)",
    "Experience certificates",
    "Bank reference letter",
    "No objection certificate (if employed)",
    "Passport photos",
    "Tenancy contract (for mainland)",
    "Memorandum of Association",
  ];

  const faqs = [
    {
      question: "How long does it take to set up a company in Dubai?",
      answer:
        "The timeframe varies by company type. Free zone companies typically take 7-14 days, mainland LLCs take 14-21 days, and offshore companies can be set up in 3-7 days. The process depends on document readiness and chosen jurisdiction.",
    },
    {
      question: "What is the minimum capital requirement?",
      answer:
        "Capital requirements vary by company type and jurisdiction. Free zone companies often have no minimum capital requirement, mainland LLCs typically require AED 300,000, while offshore companies usually have no minimum capital requirement.",
    },
    {
      question: "Can I own 100% of my company in Dubai?",
      answer:
        "Yes, in designated free zones and for certain mainland activities. The new UAE commercial companies law allows 100% foreign ownership for many business activities, eliminating the previous requirement for UAE national partners.",
    },
    {
      question: "What are the ongoing compliance requirements?",
      answer:
        "Annual license renewal, bookkeeping and accounting, annual audit (for certain company types), VAT registration if applicable, and maintaining registered office address. Requirements vary by company type and business activities.",
    },
    {
      question:
        "Do I need to be physically present in Dubai for company setup?",
      answer:
        "Physical presence is generally required for final signatures, bank account opening, and biometric procedures. However, much of the preliminary work can be done remotely with proper documentation and power of attorney arrangements.",
    },
    {
      question: "What business activities can I conduct with my Dubai company?",
      answer:
        "Dubai allows a wide range of business activities including trading, consulting, technology, e-commerce, manufacturing, and professional services. The specific activities depend on your chosen license type and jurisdiction.",
    },
  ];

  return (
    <div className="min-h-screen bg-ivory pt-20">
      {/* Simplified Hero Section */}
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
                Dubai Business Setup
              </span>
            </div>

            <h1 className="text-[rgba(30,26,26,1)] mb-6 text-[48px]">
              Company Formation in Dubai
            </h1>
            <p className="text-[rgba(30,26,26,1)] text-xl leading-relaxed mb-8">
              Establish your business in Dubai with expert guidance. From free
              zone companies to mainland LLCs, we provide comprehensive support
              for a seamless company formation process.
            </p>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="section-padding bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-8 text-[36px] text-[40px]">
              Why Choose Dubai for Your Business
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto leading-relaxed">
              Dubai offers unparalleled advantages for businesses looking to
              establish and expand their operations in one of the world's most
              dynamic business environments.
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

      {/* Company Types Section */}
      <section ref={companyTypesRef} className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-8 text-[36px] text-[40px]">
              Choose Your Company Type
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto leading-relaxed">
              Select the most suitable business structure for your operations in
              Dubai. Each type offers unique benefits tailored to different
              business needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {companyTypes.map((type, index) => (
              <Card
                key={index}
                className="bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] transition-all duration-300 border-0 group"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-[rgba(30,26,26,1)] group-hover:text-gold transition-colors">
                        {type.type}
                      </h4>
                      <Badge className="bg-gold/10 text-gold border-gold/20 text-xs">
                        {type.timeframe}
                      </Badge>
                    </div>
                    <p className="text-[rgba(30,26,26,1)] text-sm leading-relaxed mb-4">
                      {type.description}
                    </p>
                  </div>

                  <div className="space-y-4 flex-grow">
                    <div>
                      <h5 className="text-[rgba(30,26,26,1)] text-sm mb-3">
                        Key Benefits
                      </h5>
                      <div className="space-y-2">
                        {type.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start">
                            <CheckCircle className="w-4 h-4 text-gold mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-[rgba(30,26,26,0.8)] text-xs">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#8b7355]/10">
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-[rgba(30,26,26,1)]">
                          Min. Capital:
                        </span>
                        <span className="text-[#8b7355] font-medium">
                          {type.minCapital}
                        </span>
                      </div>
                      <div className="text-xs text-[rgba(30,26,26,0.8)]">
                        <span className="font-medium">Best for:</span>{" "}
                        {type.suitableFor}
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full mt-6 bg-beige hover:bg-gold text-[#8b7355] rounded-xl group-hover:bg-[#8b7355] group-hover:text-white transition-all duration-300"
                    onClick={() => handleLearnMoreWhatsApp(type.type)}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Setup Process Timeline */}
      <section className="section-padding bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-8 text-[36px]">
              Company Formation Process
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto leading-relaxed">
              Our streamlined process ensures efficient and compliant company
              formation with expert guidance at every step.
            </p>
          </div>

          <div className="space-y-8">
            {setupSteps.map((step, index) => (
              <Card
                key={index}
                className="bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] transition-all duration-300 border-0 overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-gold to-gold/80 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-2xl">{step.step}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-[rgba(30,26,26,1)] text-xl">
                          {step.title}
                        </h4>
                        <Badge className="bg-gold/10 text-gold border-gold/20 text-xs">
                          {step.duration}
                        </Badge>
                      </div>
                      <p className="text-[rgba(30,26,26,0.8)] mb-4 leading-relaxed">
                        {step.description}
                      </p>
                      <div className="space-y-2">
                        <h5 className="text-[rgba(30,26,26,1)] text-sm mb-2">
                          Requirements:
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {step.requirements.map((req, idx) => (
                            <div key={idx} className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-gold mr-2 flex-shrink-0" />
                              <span className="text-[rgba(30,26,26,0.8)] text-sm">
                                {req}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-[rgba(30,26,26,1)] mb-8 text-[36px] text-[40px]">
                Required Documents
              </h2>
              <p className="text-[rgba(30,26,26,1)] text-lg leading-relaxed mb-8">
                Ensure you have all necessary documents prepared and properly
                attested for a smooth company formation process.
              </p>

              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={index} className="flex items-start">
                    <FileText className="w-5 h-5 text-gold mt-1 mr-4 flex-shrink-0" />
                    <span className="text-[rgba(30,26,26,0.8)]">{doc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gold to-[#8b7355] rounded-3xl p-8 text-white">
              <h3 className="text-white mb-6 text-2xl">Expert Assistance</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-white mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <div className="text-white mb-1">Document Preparation</div>
                    <div className="text-white/80 text-sm">
                      Professional assistance with all paperwork
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-white mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <div className="text-white mb-1">Attestation Support</div>
                    <div className="text-white/80 text-sm">
                      Help with document authentication
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-white mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <div className="text-white mb-1">Process Management</div>
                    <div className="text-white/80 text-sm">
                      End-to-end process coordination
                    </div>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-white mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <div className="text-white mb-1">Legal Compliance</div>
                    <div className="text-white/80 text-sm">
                      Ensuring full regulatory compliance
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
              Get answers to common questions about company formation in Dubai.
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
                    <p className="text-[rgba(30,26,26,0.8)] leading-relaxed">
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
            <h2 className="text-white mb-8">
              Ready to Start Your Business in Dubai?
            </h2>
            <p className="text-white/90 text-lg mb-10 leading-relaxed">
              Take the first step towards establishing your company in one of
              the world's most business-friendly environments. Our experts are
              ready to guide you through every aspect of the formation process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-white text-[rgba(30,26,26,1)] hover:bg-white/90 px-8 py-4 text-lg rounded-xl text-[14px]"
                onClick={scrollToCompanyTypes}
              >
                <Briefcase className="w-5 h-5 mr-2" />
                Start Company Formation
              </Button>
              <Button
                className="bg-white text-[rgba(30,26,26,1)] hover:bg-transparent border-solid border-[1px] border-white px-8 py-4 text-lg rounded-xl text-[14px]"
                onClick={handleFreeConsultationWhatsApp}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
