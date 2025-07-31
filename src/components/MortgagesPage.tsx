import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Home,
  ChevronRight,
  Calculator,
  TrendingUp,
  Shield,
  CheckCircle,
  Users,
  FileText,
  Clock,
  CreditCard,
  Percent,
  DollarSign,
  Award,
  Globe,
  UserCheck,
  Building2,
  Heart,
  Banknote,
  Calendar,
  MessageCircle,
} from "lucide-react";

interface MortgagesPageProps {
  onBack: () => void;
}

export function MortgagesPage({ onBack }: MortgagesPageProps) {
  // Mortgage calculator state
  const [propertyValue, setPropertyValue] = useState<string>("");
  const [downPaymentPercent, setDownPaymentPercent] = useState<string>("");
  const [interestRate, setInterestRate] = useState<string>("");
  const [loanTerm, setLoanTerm] = useState<string>("");

  // Ref for mortgage calculator section
  const mortgageCalculatorRef = useRef<HTMLElement>(null);

  // Calculate mortgage values
  const calculateMortgage = () => {
    const propValue = parseFloat(propertyValue.replace(/,/g, "")) || 0;
    const downPercent = parseFloat(downPaymentPercent) || 0;
    const rate = parseFloat(interestRate) || 0;
    const term = parseFloat(loanTerm) || 0;

    const downPaymentAmount = (propValue * downPercent) / 100;
    const loanAmount = propValue - downPaymentAmount;

    // Monthly payment calculation using standard mortgage formula
    const monthlyRate = rate / 100 / 12;
    const numberOfPayments = term * 12;

    let monthlyPayment = 0;
    if (monthlyRate > 0 && numberOfPayments > 0) {
      monthlyPayment =
        (loanAmount *
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    }

    return {
      monthlyPayment: monthlyPayment,
      downPaymentAmount: downPaymentAmount,
      loanAmount: loanAmount,
    };
  };

  const mortgageResults = calculateMortgage();

  // Format number with commas
  const formatNumber = (num: number) => {
    return Math.round(num).toLocaleString();
  };

  // Handle input formatting for property value
  const handlePropertyValueChange = (value: string) => {
    // Remove non-numeric characters except commas
    const numericValue = value.replace(/[^\d,]/g, "");
    // Remove existing commas and add them back
    const cleanValue = numericValue.replace(/,/g, "");
    if (cleanValue) {
      const formattedValue = parseInt(cleanValue).toLocaleString();
      setPropertyValue(formattedValue);
    } else {
      setPropertyValue("");
    }
  };

  // WhatsApp helper functions
  const handleWhatsAppMessage = (message: string) => {
    const phoneNumber = "+971543218123";
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleMortgageApplyNow = (mortgageType: string) => {
    const selectedType = mortgageTypes.find(
      (type) => type.title === mortgageType
    );
    if (selectedType) {
      const message = `Hello! I'm interested in applying for a ${
        selectedType.title
      }.

Key details:
- Down Payment: ${selectedType.downPayment}
- Interest Rate: ${selectedType.rate}
- Max Tenure: ${selectedType.maxTenure}
- Features: ${selectedType.features.join(", ")}

Could you please help me with the application process and provide more information about the requirements and next steps?`;

      handleWhatsAppMessage(message);
    }
  };

  const handleBankQuote = (
    bankName: string,
    rate: string,
    processing: string
  ) => {
    const message = `Hello! I'm interested in getting a mortgage quote from ${bankName}.

Current rates I saw:
- Interest Rate: ${rate}
- Processing Fee: ${processing}

Could you please provide me with a detailed quote including:
- Exact interest rates for my profile
- All fees and charges
- Loan terms and conditions
- Required documentation
- Application process timeline

I'm looking forward to hearing from you.`;

    handleWhatsAppMessage(message);
  };

  const handleSpeakToAdvisor = () => {
    const message = `Hello! I'm interested in speaking with a mortgage advisor about financing options for Dubai property.

I would like to discuss:
- Available mortgage products
- Interest rates and terms
- Eligibility requirements
- Application process
- Documentation needed
- Pre-approval process

Could you please connect me with a mortgage specialist? Thank you!`;

    handleWhatsAppMessage(message);
  };

  const scrollToMortgageCalculator = () => {
    if (mortgageCalculatorRef.current) {
      mortgageCalculatorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const mortgageTypes = [
    {
      title: "UAE Resident Mortgage",
      description: "Competitive rates for UAE residents",
      downPayment: "20%",
      maxTenure: "25 years",
      rate: "From 3.5%",
      features: [
        "No income ceiling",
        "Up to 80% financing",
        "Flexible repayment",
        "Quick approval",
      ],
      popular: true,
    },
    {
      title: "Non-Resident Mortgage",
      description: "International buyers mortgage solutions",
      downPayment: "30%",
      maxTenure: "20 years",
      rate: "From 4.2%",
      features: [
        "International income accepted",
        "Up to 70% financing",
        "Multi-currency options",
        "Remote processing",
      ],
      popular: false,
    },
    {
      title: "Islamic Mortgage",
      description: "Sharia-compliant home financing",
      downPayment: "20%",
      maxTenure: "25 years",
      rate: "From 3.8%",
      features: [
        "Sharia compliant",
        "No interest charges",
        "Flexible structure",
        "Ethical financing",
      ],
      popular: false,
    },
  ];

  const lenders = [
    { name: "Emirates NBD", rate: "3.49%", processing: "0.25%" },
    { name: "ADCB", rate: "3.55%", processing: "0.30%" },
    { name: "FAB", rate: "3.65%", processing: "0.25%" },
    { name: "ENBD", rate: "3.75%", processing: "0.35%" },
    { name: "HSBC", rate: "3.85%", processing: "0.40%" },
    { name: "Mashreq", rate: "3.95%", processing: "0.30%" },
  ];

  const eligibilityUAE = [
    { requirement: "Minimum salary", details: "AED 15,000 - 20,000/month" },
    { requirement: "Loan-to-Value", details: "Up to 80% of property value" },
    { requirement: "Emirates ID", details: "Valid UAE Emirates ID" },
    {
      requirement: "Salary certificate",
      details: "From employer or business license",
    },
    { requirement: "Bank statements", details: "Last 6 months' statements" },
    {
      requirement: "Property documents",
      details: "NOC, valuation, sale agreement",
    },
  ];

  const eligibilityForeign = [
    { requirement: "Loan-to-Value", details: "50% - 60% of property value" },
    { requirement: "Passport copy", details: "Valid international passport" },
    {
      requirement: "Proof of income",
      details: "Employment letter or business docs",
    },
    {
      requirement: "Bank statements",
      details: "Last 6 months from home country",
    },
    {
      requirement: "Credit report",
      details: "From home country credit bureau",
    },
    {
      requirement: "Property valuation",
      details: "UAE bank approved valuation",
    },
  ];

  const costsAndFees = [
    {
      icon: Percent,
      title: "Down Payment",
      range: "20% - 50%",
      description: "Varies by residence status and property type",
      color: "text-gold",
    },
    {
      icon: FileText,
      title: "Mortgage Registration Fee",
      range: "0.25% + AED 290",
      description: "Dubai Land Department registration charges",
      color: "text-[#8b7355]",
    },
    {
      icon: CreditCard,
      title: "Processing Fee",
      range: "0.5% - 1%",
      description: "Bank processing and administrative costs",
      color: "text-gold",
    },
    {
      icon: Building2,
      title: "Valuation Fee",
      range: "AED 2,500 - 3,500",
      description: "Professional property assessment",
      color: "text-[#8b7355]",
    },
  ];

  const enhancedBenefits = [
    {
      icon: TrendingUp,
      title: "Competitive Interest Rates",
      description:
        "Access to the most competitive mortgage rates in the UAE market, starting from 3.49% for qualified applicants.",
      highlight: "From 3.49%",
    },
    {
      icon: DollarSign,
      title: "High Rental Yields",
      description:
        "Dubai properties offer attractive rental yields of 6-12% annually, helping offset mortgage payments.",
      highlight: "6-12% Returns",
    },
    {
      icon: Calendar,
      title: "Flexible Repayment Terms",
      description:
        "Extended repayment periods up to 25 years with options for early settlement without penalties.",
      highlight: "Up to 25 Years",
    },
    {
      icon: Shield,
      title: "Regulated Market Security",
      description:
        "Invest with confidence in Dubai's well-regulated property market with strong legal protections.",
      highlight: "100% Secure",
    },
    {
      icon: Heart,
      title: "Life Insurance Coverage",
      description:
        "Comprehensive life insurance protection included with mortgage packages for peace of mind.",
      highlight: "Full Coverage",
    },
    {
      icon: Globe,
      title: "International Support",
      description:
        "Multi-language support and international banking relationships for seamless overseas transactions.",
      highlight: "Global Access",
    },
  ];

  const benefits = [
    {
      icon: Calculator,
      title: "Best Rates",
      description: "Access to competitive mortgage rates from top UAE banks",
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description:
        "Professional mortgage advisors to guide you through the process",
    },
    {
      icon: Clock,
      title: "Fast Processing",
      description: "Quick pre-approval and streamlined application process",
    },
    {
      icon: Shield,
      title: "Secure Process",
      description: "Bank-grade security and complete transparency throughout",
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
                UAE Mortgage Solutions
              </span>
            </div>

            <h1 className="text-[rgba(30,26,26,1)] mb-6 text-[48px]">
              UAE Mortgage Solutions
            </h1>
            <p className="text-[rgba(30,26,26,1)] text-xl leading-relaxed mb-8">
              Secure the best mortgage rates and terms for your Dubai property
              investment. Professional guidance from application to completion.
            </p>
          </div>
        </div>
      </section>

      {/* Mortgage Calculator */}
      <section ref={mortgageCalculatorRef} className="section-padding">
        <div className="container">
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] mb-16">
            <div className="text-center mb-8">
              <h2 className="text-[rgba(30,26,26,1)] mb-4 text-[36px]">
                Mortgage Calculator
              </h2>
              <p className="text-[rgba(30,26,26,1)]">
                Calculate your monthly payments and see what you can afford
              </p>
            </div>

            {/* Option 1: Embedded Calculator */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 rounded-xl  border border-gold/20 mb-6">
                <div className="relative w-full h-[800px] rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    src="https://smartoffplan.useholo.com/en/wlp-mortgage-calculator"
                    className="w-full h-full border-0"
                    title="Mortgage Calculator"
                    loading="lazy"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation allow-top-navigation-by-user-activation allow-downloads allow-downloads-without-user-activation allow-modals allow-orientation-lock allow-pointer-lock allow-presentation allow-storage-access-by-user-activation"
                    allow="accelerometer; autoplay; camera; clipboard-read; clipboard-write; encrypted-media; fullscreen; geolocation; gyroscope; magnetometer; microphone; midi; payment; picture-in-picture; publickey-credentials-get; screen-wake-lock; sync-xhr; usb; web-share; xr-spatial-tracking"
                    referrerpolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compact Eligibility & Requirements */}
      <section className="py-16 bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-[rgba(30,26,26,1)] mb-4 text-[36px]">
              Eligibility & Requirements
            </h2>
            <p className="text-[rgba(30,26,26,1)] max-w-2xl mx-auto">
              Quick overview of requirements for UAE residents and foreign
              investors
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] overflow-hidden">
            <Tabs defaultValue="uae-residents" className="w-full">
              <TabsList className="grid w-full grid-cols-2 h-16 bg-beige/50 rounded-none">
                <TabsTrigger
                  value="uae-residents"
                  className="flex items-center space-x-3 data-[state=active]:bg-white data-[state=active]:text-[#8b7355] text-warm-gray h-full rounded-none"
                >
                  <UserCheck className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-[rgba(30,26,26,1)]">
                      UAE Residents
                    </div>
                    <div className="text-xs opacity-70 text-[rgba(30,26,26,0.8)]">
                      Up to 80% LTV
                    </div>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="foreign-investors"
                  className="flex items-center space-x-3 data-[state=active]:bg-white data-[state=active]:text-[#8b7355] text-warm-gray h-full rounded-none"
                >
                  <Globe className="w-5 h-5" />
                  <div className="text-left">
                    <div className="font-medium text-[rgba(30,26,26,1)]">
                      Foreign Investors
                    </div>
                    <div className="text-xs opacity-70 text-[rgba(30,26,26,0.8)]">
                      50-60% LTV
                    </div>
                  </div>
                </TabsTrigger>
              </TabsList>

              <div className="p-8">
                <TabsContent value="uae-residents" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[rgba(30,26,26,1)] mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-gold mr-2" />
                        Requirements
                      </h4>
                      <div className="space-y-3">
                        {eligibilityUAE.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="text-[rgba(30,26,26,0.8)] text-sm">
                                {item.requirement}
                              </div>
                              <div className="text-[rgba(30,26,26,0.7)] text-xs">
                                {item.details}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[rgba(30,26,26,1)] mb-4 flex items-center text-[20px]">
                        <Award className="w-5 h-5 text-gold mr-2" />
                        Key Benefits
                      </h4>
                      <div className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-xl p-4 border border-gold/20">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-gray">
                              LTV Ratio
                            </span>
                            <span className="text-gold font-medium">
                              Up to 80%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-gray">
                              Interest Rate
                            </span>
                            <span className="text-gold font-medium">
                              From 3.49%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-gray">
                              Approval Time
                            </span>
                            <span className="text-gold font-medium">
                              3-5 Days
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="foreign-investors" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-[rgba(30,26,26,1)] mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 text-[#8b7355] mr-2" />
                        Requirements
                      </h4>
                      <div className="space-y-3">
                        {eligibilityForeign.map((item, index) => (
                          <div key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-[#8b7355] rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <div className="flex-1">
                              <div className="text-[rgba(30,26,26,0.8)] text-sm">
                                {item.requirement}
                              </div>
                              <div className="text-[rgba(30,26,26,0.7)] text-xs">
                                {item.details}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[rgba(30,26,26,1)] mb-4 flex items-center">
                        <Banknote className="w-5 h-5 text-[#8b7355] mr-2" />
                        Investment Benefits
                      </h4>
                      <div className="bg-gradient-to-br from-[#8b7355]/10 to-[#8b7355]/5 rounded-xl p-4 border border-[#8b7355]/20">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-gray">
                              LTV Ratio
                            </span>
                            <span className="text-[#8b7355] font-medium">
                              50-60%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-gray">
                              Interest Rate
                            </span>
                            <span className="text-[#8b7355] font-medium">
                              From 4.2%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-warm-gray">
                              Remote Processing
                            </span>
                            <span className="text-[#8b7355] font-medium">
                              Available
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Costs & Fees */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-6 text-[36px] text-[40px]">
              Costs & Fees Breakdown
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto">
              Transparent pricing with no hidden charges. Plan your investment
              with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {costsAndFees.map((cost, index) => (
              <Card
                key={index}
                className="bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_12px_40px_-4px_rgba(139,115,85,0.15),0_6px_20px_-4px_rgba(139,115,85,0.1)] hover:-translate-y-2 transition-all duration-300 border-0 overflow-hidden group"
              >
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className="w-16 h-16 bg-gradient-to-br from-beige to-ivory rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <cost.icon className={`w-8 h-8 ${cost.color}`} />
                  </div>

                  <h4 className="text-[rgba(30,26,26,1)] mb-4 group-hover:text-gold transition-colors text-[16px]">
                    {cost.title}
                  </h4>

                  <div
                    className={`text-2xl ${cost.color} mb-4 group-hover:scale-105 transition-transform`}
                  >
                    {cost.range}
                  </div>

                  <p className="text-[rgba(30,26,26,0.8)] text-sm leading-relaxed flex-grow">
                    {cost.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* <div className="mt-12 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 rounded-3xl p-8 border border-gold/20">
            <div className="text-center">
              <h4 className="text-[rgba(30,26,26,1)] mb-4">
                Total Investment Planning
              </h4>
              <p className="text-[rgba(30,26,26,1)] text-sm mb-6 max-w-2xl mx-auto">
                Our experts will help you calculate the total cost of ownership
                including all fees, taxes, and ongoing expenses to ensure
                complete transparency in your investment.
              </p>
              <Button className="bg-gold hover:bg-gold/90 text-[rgba(255,255,255,1)] px-8">
                Get Detailed Cost Analysis
              </Button>
            </div>
          </div> */}
        </div>
      </section>

      {/* Enhanced Benefits Section */}
      <section className="section-padding bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-6 text-[36px] text-[40px]">
              Investment Benefits & Advantages
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto">
              Discover why Dubai property investment with mortgage financing
              offers exceptional returns and security
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {enhancedBenefits.map((benefit, index) => (
              <Card
                key={index}
                className="bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_12px_40px_-4px_rgba(139,115,85,0.15),0_6px_20px_-4px_rgba(139,115,85,0.1)] hover:-translate-y-2 transition-all duration-300 border-0 overflow-hidden group"
              >
                <CardContent className="p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold/80 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <benefit.icon className="w-7 h-7 text-white" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="bg-gold/10 text-gold border-gold/20 text-xs px-3 py-1"
                    >
                      {benefit.highlight}
                    </Badge>
                  </div>

                  <h4 className="text-[rgba(30,26,26,1)] mb-4 group-hover:text-gold transition-colors">
                    {benefit.title}
                  </h4>

                  <p className="text-[rgba(30,26,26,0.7)] text-sm leading-relaxed flex-grow">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mortgage Types */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-6 text-[36px] text-[40px]">
              Mortgage Options
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto">
              Choose from various mortgage products designed for residents and
              international buyers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mortgageTypes.map((type, index) => (
              <Card
                key={index}
                className={`relative bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] hover:-translate-y-2 transition-all duration-300 rounded-2xl overflow-hidden border-0 ${
                  type.popular ? "ring-2 ring-gold" : ""
                }`}
              >
                {type.popular && (
                  <div className="absolute top-0 left-0 right-0">
                    <div className="bg-gold text-[#8b7355] text-center py-2 text-sm">
                      Most Popular
                    </div>
                  </div>
                )}
                <CardContent className={`p-8 ${type.popular ? "pt-12" : ""}`}>
                  <h3 className="text-[rgba(30,26,26,1)] mb-3 text-[24px]">
                    {type.title}
                  </h3>
                  <p className="text-[rgba(30,26,26,0.8)] mb-6 text-[16px]">
                    {type.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-[rgba(30,26,26,0.8)]">
                        Down Payment
                      </div>
                      <div className="text-lg text-[#8b7355]">
                        {type.downPayment}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-[rgba(30,26,26,0.8)]">
                        Rate
                      </div>
                      <div className="text-lg text-[#8b7355]">{type.rate}</div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {type.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                        <span className="text-sm text-[rgba(30,26,26,0.7)]">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${
                      type.popular
                        ? "bg-gold hover:bg-gold/90 text-[#8b7355]"
                        : "bg-[#8b7355] hover:bg-[#8b7355]/90 text-white"
                    } transition-all duration-300`}
                    onClick={() => handleMortgageApplyNow(type.title)}
                  >
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bank Rates */}
      <section className="section-padding bg-beige">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-6 text-[36px] text-[40px]">
              Current Bank Rates
            </h2>
            <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto">
              Compare rates from leading UAE banks and choose the best option
              for your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lenders.map((lender, index) => (
              <Card
                key={index}
                className="bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] transition-all duration-300 rounded-2xl border-0"
              >
                <CardContent className="p-6">
                  <h4 className="text-[rgba(30,26,26,1)] mb-4">
                    {lender.name}
                  </h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[rgba(30,26,26,0.8)]">
                      Interest Rate
                    </span>
                    <span className="text-lg text-gold">{lender.rate}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[rgba(30,26,26,0.8)]">
                      Processing Fee
                    </span>
                    <span className="text-sm text-[#8b7355]">
                      {lender.processing}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-gold text-gold hover:bg-gold hover:text-[#8b7355]"
                    onClick={() =>
                      handleBankQuote(
                        lender.name,
                        lender.rate,
                        lender.processing
                      )
                    }
                  >
                    Get Quote
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Original Benefits */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[rgba(30,26,26,1)] mb-6 text-[36px] text-[40px]">
              Why Choose Our Mortgage Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* CTA Section */}
      <section className="section-padding bg-[#8b7355] text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-white mb-6 text-[36px] text-[40px]">
              Ready to Secure Your Mortgage?
            </h2>
            <p className="text-tan text-lg mb-8 leading-relaxed">
              Get pre-approved today and take the first step towards owning your
              dream property in Dubai.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gold hover:bg-gold/90 text-[rgba(255,255,255,1)] px-8 py-3 text-lg text-[14px]"
                onClick={scrollToMortgageCalculator}
              >
                <Calculator className="w-5 h-5 mr-2" />
                Get Pre-Approved
              </Button>
              <Button
                className="bg-white text-[rgba(30,26,26,1)] hover:bg-white/90 hover:text-[#8b7355] border-solid border-[1px] border-white px-8 py-4 text-lg rounded-xl text-[14px]"
                onClick={handleSpeakToAdvisor}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Speak to Advisor
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
