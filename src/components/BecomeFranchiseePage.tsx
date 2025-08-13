import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  ArrowLeft,
  Store,
  Crown,
  Globe,
  TrendingUp,
  Award,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Users,
  Building2,
  Target,
  Shield,
  Briefcase,
  CirclePlus,
  Building,
  MessageCircle,
} from "lucide-react";

interface BecomeFranchiseePageProps {
  onBack: () => void;
}

export function BecomeFranchiseePage({ onBack }: BecomeFranchiseePageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    investment: "",
    experience: "",
    timeline: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Clear error when user starts typing
    if (error) {
      setError(null);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Frontend validation matching backend rules

      // Validate name (2-100 characters)
      if (
        !formData.name.trim() ||
        formData.name.trim().length < 2 ||
        formData.name.trim().length > 100
      ) {
        setError("Name must be between 2 and 100 characters");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
        setError("Please provide a valid email address");
        return;
      }

      // Validate phone (8-20 characters)
      if (
        !formData.phone.trim() ||
        formData.phone.trim().length < 8 ||
        formData.phone.trim().length > 20
      ) {
        setError("Phone number must be between 8 and 20 characters");
        return;
      }

      // Validate location (2-200 characters)
      if (
        !formData.location.trim() ||
        formData.location.trim().length < 2 ||
        formData.location.trim().length > 200
      ) {
        setError("Location must be between 2 and 200 characters");
        return;
      }

      // Validate investment (2-100 characters)
      if (
        !formData.investment.trim() ||
        formData.investment.trim().length < 2 ||
        formData.investment.trim().length > 100
      ) {
        setError("Investment amount must be between 2 and 100 characters");
        return;
      }

      // Validate experience (1-500 characters) - Fixed validation rule
      if (
        !formData.experience.trim() ||
        formData.experience.trim().length < 1 ||
        formData.experience.trim().length > 500
      ) {
        setError("Experience must be between 1 and 500 characters");
        return;
      }

      // Validate timeline (2-100 characters) - Fixed validation rule
      if (
        !formData.timeline.trim() ||
        formData.timeline.trim().length < 2 ||
        formData.timeline.trim().length > 100
      ) {
        setError("Timeline must be between 2 and 100 characters");
        return;
      }

      // Validate message (10-2000 characters)
      if (
        !formData.message.trim() ||
        formData.message.trim().length < 10 ||
        formData.message.trim().length > 2000
      ) {
        setError("Message must be between 10 and 2000 characters");
        return;
      }

      // console.log("📧 Submitting franchisee application:", formData);

      // Call the Become Franchisee API
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(
        `${backendUrl}/api/email/become-franchisee`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            location: formData.location.trim(),
            investment: formData.investment.trim(),
            experience: formData.experience.trim(),
            timeline: formData.timeline.trim(),
            message: formData.message.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        // Success - show success message and reset form
        setError(null);

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          location: "",
          investment: "",
          experience: "",
          timeline: "",
          message: "",
        });

        // Show success message (you can replace this with a better UI component)
        alert(
          "Thank you for your application! Our franchise team will review it and contact you within 72 hours."
        );
      } else {
        // Handle validation errors from backend
        if (result.details && Array.isArray(result.details)) {
          const errorMessages = result.details
            .map((error: any) => error.msg)
            .join(", ");
          setError(`Please check your input: ${errorMessages}`);
        } else {
          setError(
            result.message || "Failed to send application. Please try again."
          );
        }
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle smooth scrolling to franchise application form
  const handleScrollToApplication = () => {
    // Check if document is available (client-side)
    if (typeof document === "undefined") return;

    const applicationSection = document.getElementById("franchise-application");
    if (applicationSection) {
      applicationSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // WhatsApp and Call helper functions
  const handleWhatsAppMessage = (message: string) => {
    // Check if window is available (client-side)
    if (typeof window === "undefined") return;

    const phoneNumber = "+971543218123";
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleFranchiseFeeInquiry = () => {
    const message = `Hello! I'm interested in learning more about the Smart Off Plan franchise opportunity and would like to inquire about the franchise fee details.

I would like to know:
- Franchise fee structure and payment terms
- Initial investment requirements
- Ongoing royalty fees and percentages
- Territory licensing costs
- Setup and training costs
- Marketing and support fees
- Return on investment projections
- Payment schedule options

Could you please provide detailed information about the franchise fee and investment requirements? I'm serious about this opportunity and would appreciate a comprehensive breakdown.

Thank you for your time.`;

    handleWhatsAppMessage(message);
  };

  const handleCallFranchiseTeam = () => {
    const phoneNumber = "+971543218123";
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleScheduleDiscoveryCall = () => {
    const message = `Hello! I'm interested in the Smart Off Plan franchise opportunity and would like to schedule a discovery call to learn more.

I would like to discuss:
- Franchise business model and opportunities
- Territory availability and rights
- Investment requirements and franchise fees
- Training and support programs
- Marketing and operational support
- Expected ROI and business projections
- Timeline for setup and launch
- Ongoing partnership benefits

Could you please help me schedule a convenient time for a detailed discovery call? I'm excited to explore this franchise opportunity with your team.

Thank you for your consideration.`;

    handleWhatsAppMessage(message);
  };

  const franchiseBenefits = [
    {
      icon: Crown,
      title: "Exclusive Territory Rights",
      description:
        "Protected territory with exclusive rights to operate under Smart Off Plan brand",
    },
    {
      icon: Building2,
      title: "Proven Business Model",
      description:
        "Access to our successful, tested business framework and operational systems",
    },
    {
      icon: Globe,
      title: "Brand Recognition",
      description:
        "Leverage the Smart Off Plan brand reputation and market presence",
    },
    {
      icon: Users,
      title: "Comprehensive Training",
      description:
        "6-week intensive training program covering all aspects of the business",
    },
    {
      icon: Target,
      title: "Marketing Support",
      description:
        "National advertising campaigns and local marketing assistance",
    },
    {
      icon: Shield,
      title: "Ongoing Support",
      description:
        "Continuous operational, technical, and business development support",
    },
    {
      icon: CirclePlus,
      title: "Additional Services",
      description:
        "Rights to offer company setup, Golden Visa assistance, and other value-added services.",
    },

    {
      icon: Building,
      title: "Property Management",
      description:
        "Full property-management services for your clients, with 50/50 revenue share.",
    },
  ];

  const investmentDetails = [
    {
      title: "Franchise Fee",
      amount: "Inquire",
      description: "One-time franchise licensing fee",
    },
  ];

  const requirements = [
    "Minimum liquid capital of AED 750,000",
    "Business management experience (5+ years)",
    "Commitment to full-time operation",
    "Strong local market knowledge",
    "Excellent communication skills",
    "Passion for real estate and customer service",
  ];

  const supportServices = [
    {
      icon: Briefcase,
      title: "Business Operations",
      description: "Comprehensive operations manual, policies, and procedures",
    },
    {
      icon: Users,
      title: "Staff Training",
      description: "Initial and ongoing training programs for your team",
    },
    {
      icon: Target,
      title: "Lead Generation",
      description: "Access to national lead generation and referral systems",
    },
    {
      icon: TrendingUp,
      title: "Performance Analytics",
      description: "Advanced reporting tools and business intelligence systems",
    },
  ];

  const processSteps = [
    {
      step: "1",
      title: "Initial Application",
      description: "Submit your franchise application and investment details",
    },
    {
      step: "2",
      title: "Review & Interview",
      description: "Application review and personal interview with our team",
    },
    {
      step: "3",
      title: "Discovery Process",
      description:
        "Visit existing franchises and review detailed business information",
    },
    {
      step: "4",
      title: "Final Approval",
      description: "Final approval and franchise agreement signing",
    },
    {
      step: "5",
      title: "Training & Launch",
      description: "Complete training program and grand opening support",
    },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="section-padding bg-[#8b7355] text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center">
                <Store className="w-8 h-8 text-[#8b7355]" />
              </div>
            </div>
            <h1 className="text-white mb-6 text-[48px]">Become a Franchisee</h1>
            <p className="text-tan text-xl leading-relaxed">
              Own your own Smart Off Plan franchise and capitalize on Dubai's
              booming real estate market with our proven business model and
              brand support.
            </p>
          </div>
        </div>
      </section>

      {/* Franchise Benefits */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[#8b7355] mb-6 text-[36px]">
              Why Choose Our Franchise?
            </h2>
            <p className="text-warm-gray text-lg max-w-3xl mx-auto">
              Join a proven business model with comprehensive support, exclusive
              territory rights, and the backing of Dubai's leading off-plan
              property specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {franchiseBenefits.map((benefit, index) => (
              <Card
                key={index}
                className="bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_12px_40px_-4px_rgba(139,115,85,0.15),0_6px_20px_-4px_rgba(139,115,85,0.1)] hover:-translate-y-2 transition-all duration-300 border-0 overflow-hidden group"
              >
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className="w-16 h-16 bg-gradient-to-br from-beige to-ivory rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="w-8 h-8 text-gold" />
                  </div>

                  <h4 className="text-[#8b7355] mb-4 group-hover:text-gold transition-colors">
                    {benefit.title}
                  </h4>

                  <p className="text-warm-gray text-sm leading-relaxed flex-grow">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Investment & Process */}
      <section className="section-padding bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Investment Details */}
            <div>
              <h3 className="text-[#8b7355] mb-8">Investment Requirements</h3>
              <div className="space-y-6">
                {investmentDetails.map((detail, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-[#8b7355]">{detail.title}</h5>
                      <Button
                        variant={"default"}
                        className="bg-[#8b7355] hover:bg-[#8b7355]/90 text-white px-6"
                        onClick={handleFranchiseFeeInquiry}
                      >
                        {detail.amount}
                      </Button>
                    </div>
                    <p className="text-warm-gray text-sm">
                      {detail.description}
                    </p>
                  </div>
                ))}

                <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="text-[#8b7355]">ROI Split</h5>
                  </div>
                  <p className="text-warm-gray text-sm">
                    50/50 revenue share on all services.
                  </p>
                </div>
              </div>

              <div className="mt-8 bg-gradient-to-r from-gold/10 via-gold/5 to-gold/10 rounded-2xl p-6 border border-gold/20">
                <h4 className="text-[#8b7355] mb-3">ROI Potential</h4>
                <p className="text-warm-gray text-sm mb-4">
                  Our existing franchisees typically see break-even within 12-18
                  months with potential annual revenues of AED 2-5 million.
                </p>
              </div>
            </div>

            {/* Process Steps */}
            <div>
              <h3 className="text-[#8b7355] mb-8">How It Works</h3>
              <div className="space-y-6">
                {processSteps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-[#8b7355] font-semibold mr-4 flex-shrink-0">
                      {step.step}
                    </div>
                    <div>
                      <h5 className="text-[#8b7355] mb-2">{step.title}</h5>
                      <p className="text-warm-gray text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements & Support */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Requirements */}
            <div>
              <h3 className="text-[#8b7355] mb-8">Franchisee Requirements</h3>
              <div className="space-y-4 mb-8">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-gold mt-1 mr-3 flex-shrink-0" />
                    <span className="text-warm-gray">{requirement}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
                <h4 className="text-[#8b7355] mb-4">Territory Available</h4>
                <p className="text-warm-gray text-sm mb-4">
                  We're currently seeking qualified franchisees for key markets
                  across the UAE and select international locations.
                </p>
                <Button
                  className="bg-gold hover:bg-gold/90 text-[#8b7355]"
                  onClick={handleScrollToApplication}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Check Territory Availability
                </Button>
              </div>
            </div>

            {/* Support Services */}
            <div>
              <h3 className="text-[#8b7355] mb-8">Ongoing Support</h3>
              <div className="space-y-6">
                {supportServices.map((service, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-beige rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <service.icon className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h5 className="text-[#8b7355] mb-2">{service.title}</h5>
                        <p className="text-warm-gray text-sm leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section
        id="franchise-application"
        className="section-padding bg-gradient-to-br from-beige to-ivory"
      >
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-[#8b7355] mb-6 text-[40px]">
                Franchise Application
              </h2>
              <p className="text-warm-gray text-lg max-w-2xl mx-auto">
                Take the first step towards owning your Smart Off Plan
                franchise. Complete the confidential application below.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)]">
              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <div className="w-5 h-5 text-red-600 mr-2 flex-shrink-0">
                      ⚠️
                    </div>
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm text-[#8b7355] mb-2"
                    >
                      Full Name *
                      <span className="text-xs text-warm-gray ml-2">
                        ({formData.name.length}/100)
                      </span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name (2-100 characters)"
                      maxLength={100}
                      className={`w-full py-3 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold ${
                        formData.name.length > 0 &&
                        (formData.name.length < 2 || formData.name.length > 100)
                          ? "border-red-300 focus:border-red-500"
                          : formData.name.length >= 2 &&
                            formData.name.length <= 100
                          ? "border-green-300 focus:border-green-500"
                          : ""
                      }`}
                    />
                    {formData.name.length > 0 && formData.name.length < 2 && (
                      <p className="text-red-500 text-xs mt-1">
                        Name must be at least 2 characters
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-[#8b7355] mb-2"
                    >
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      className="w-full py-3 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm text-[#8b7355] mb-2"
                    >
                      Phone Number *
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+971 50 123 4567"
                      className="w-full py-3 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm text-[#8b7355] mb-2"
                    >
                      Preferred Territory *
                    </label>
                    <Input
                      id="location"
                      name="location"
                      type="text"
                      required
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="e.g., Abu Dhabi, Sharjah"
                      className="w-full py-3 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="investment"
                      className="block text-sm text-[#8b7355] mb-2"
                    >
                      Available Investment Capital *
                    </label>
                    <Input
                      id="investment"
                      name="investment"
                      type="text"
                      required
                      value={formData.investment}
                      onChange={handleInputChange}
                      placeholder="e.g., AED 1,000,000"
                      className="w-full py-3 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="timeline"
                      className="block text-sm text-[#8b7355] mb-2"
                    >
                      Desired Timeline *
                      <span className="text-xs text-warm-gray ml-2">
                        ({formData.timeline.length}/100)
                      </span>
                    </label>
                    <Input
                      id="timeline"
                      name="timeline"
                      type="text"
                      required
                      value={formData.timeline}
                      onChange={handleInputChange}
                      placeholder="e.g., 3-6 months (3-100 characters)"
                      maxLength={100}
                      className={`w-full py-3 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold ${
                        formData.timeline.length > 0 &&
                        (formData.timeline.length < 3 ||
                          formData.timeline.length > 100)
                          ? "border-red-300 focus:border-red-500"
                          : formData.timeline.length >= 3 &&
                            formData.timeline.length <= 100
                          ? "border-green-300 focus:border-green-500"
                          : ""
                      }`}
                    />
                    {formData.timeline.length > 0 &&
                      formData.timeline.length < 3 && (
                        <p className="text-red-500 text-xs mt-1">
                          Timeline must be at least 3 characters
                        </p>
                      )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="experience"
                    className="block text-sm text-[#8b7355] mb-2"
                  >
                    Business/Real Estate Experience *
                  </label>
                  <Input
                    id="experience"
                    name="experience"
                    type="text"
                    required
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Describe your relevant experience"
                    className="w-full py-3 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-[#8b7355] mb-2"
                  >
                    Why do you want to become a Smart Off Plan franchisee? *
                    <span className="text-xs text-warm-gray ml-2">
                      ({formData.message.length}/2000)
                    </span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us about your motivation, goals, and what you can bring to our franchise network... (10-2000 characters)"
                    rows={6}
                    maxLength={2000}
                    className={`w-full p-4 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold resize-none ${
                      formData.message.length > 0 &&
                      (formData.message.length < 10 ||
                        formData.message.length > 2000)
                        ? "border-red-300 focus:border-red-500"
                        : formData.message.length >= 10 &&
                          formData.message.length <= 2000
                        ? "border-green-300 focus:border-green-500"
                        : ""
                    }`}
                  />
                  {formData.message.length > 0 &&
                    formData.message.length < 10 && (
                      <p className="text-red-500 text-xs mt-1">
                        Message must be at least 10 characters
                      </p>
                    )}
                  {formData.message.length > 2000 && (
                    <p className="text-red-500 text-xs mt-1">
                      Message must not exceed 2000 characters
                    </p>
                  )}
                </div>

                <div className="text-center">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gold hover:bg-gold/90 disabled:bg-gold/50 disabled:cursor-not-allowed text-[#8b7355] px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-[0_4px_16px_-2px_rgba(212,175,55,0.3)] hover:scale-105 disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 mr-2 border-2 border-[#8b7355]/30 border-t-[#8b7355] rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Store className="w-5 h-5 mr-2" />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#8b7355] text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-white mb-6 text-[40px]">
              Ready to Own Your Future?
            </h2>
            <p className="text-tan text-lg mb-8 leading-relaxed">
              Join the Smart Off Plan franchise family and build a successful
              business in Dubai's thriving real estate market with our proven
              support system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gold hover:bg-gold/90 text-[#8b7355] px-8 py-3 text-lg"
                onClick={handleCallFranchiseTeam}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Franchise Team
              </Button>
              <Button
                className="bg-white text-[rgba(30,26,26,1)] hover:bg-white/90 hover:text-[#8b7355] border-solid border-[1px] border-white px-8 py-4 text-lg rounded-xl text-[14px]"
                onClick={handleScheduleDiscoveryCall}
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Schedule Discovery Call
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
