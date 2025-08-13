import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  ArrowLeft,
  Handshake,
  Heart,
  Users,
  TrendingUp,
  Globe,
  Award,
  CheckCircle,
  Phone,
  Mail,
  Calendar,
  Building,
  Target,
  DollarSign,
  MessageCircle,
} from "lucide-react";

interface JoinAsPartnerPageProps {
  onBack: () => void;
}

export function JoinAsPartnerPage({ onBack }: JoinAsPartnerPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    experience: "",
    portfolio: "",
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

      // Validate company (2-200 characters)
      if (
        !formData.company.trim() ||
        formData.company.trim().length < 2 ||
        formData.company.trim().length > 200
      ) {
        setError("Company name must be between 2 and 200 characters");
        return;
      }

      // Validate experience (1-500 characters)
      if (
        !formData.experience.trim() ||
        formData.experience.trim().length < 1 ||
        formData.experience.trim().length > 500
      ) {
        setError("Experience must be between 1 and 500 characters");
        return;
      }

      // Validate portfolio URL (optional, but if provided must be valid)
      if (formData.portfolio.trim()) {
        try {
          new URL(formData.portfolio.trim());
        } catch {
          setError("Please provide a valid portfolio URL");
          return;
        }
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

      // Call the Join Partner API
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/email/join-partner`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          company: formData.company.trim(),
          experience: formData.experience.trim(),
          portfolio: formData.portfolio.trim(),
          message: formData.message.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success - show success message and reset form
        setError(null);

        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          company: "",
          experience: "",
          portfolio: "",
          message: "",
        });

        // Show success message (you can replace this with a better UI component)
        alert(
          "Thank you for your application! We will review it and contact you within 48 hours."
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

  // WhatsApp, Call, and Email helper functions
  const handleWhatsAppMessage = (message: string) => {
    const phoneNumber = "+971543218123";
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleScheduleInterview = () => {
    const message = `Hello! I'm interested in joining Smart Off Plan as a partner and would like to schedule an interview.

I would like to discuss:
- Partnership opportunities and requirements
- Commission structure and benefits
- Training and support programs
- Territory and market allocation
- Partnership agreement terms
- Next steps in the application process

Could you please help me schedule a convenient time for an interview? I'm excited about the opportunity to join your exclusive partner network.

Thank you for your time and consideration.`;

    handleWhatsAppMessage(message);
  };

  const handleCallPartnershipTeam = () => {
    const phoneNumber = "+971543218123";
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmailUs = () => {
    const emailAddress = "accounts@smartoffplan.com";
    const subject = "Partnership Inquiry - Join as Partner";
    const body = `Hello Smart Off Plan Team,

I am interested in joining your partner network and would like to learn more about the partnership opportunities available.

I would appreciate information about:
- Partnership requirements and qualifications
- Commission structure and benefits
- Training and support programs
- Application process and timeline
- Territory availability
- Partnership agreement terms

Please let me know the best way to proceed with my application.

Thank you for your time and consideration.

Best regards,`;

    const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const partnerBenefits = [
    {
      icon: DollarSign,
      title: "Competitive Commission",
      description:
        "Earn up to 20% commission on every successful deal you close",
    },
    {
      icon: TrendingUp,
      title: "Market Leading Support",
      description:
        "Access to exclusive off-plan projects and marketing materials",
    },
    {
      icon: Award,
      title: "Professional Recognition",
      description: "Join an elite network of certified real estate partners",
    },
    {
      icon: Users,
      title: "Team Support",
      description: "Dedicated account manager and 24/7 technical support",
    },
    {
      icon: Globe,
      title: "International Reach",
      description: "Access to global investor networks and referral systems",
    },
    {
      icon: Building,
      title: "Premium Projects",
      description:
        "Exclusive access to luxury developments before public launch",
    },
  ];

  const requirements = [
    "Licensed real estate broker or agent",
    "Minimum 2 years experience in property sales",
    "Proven track record in luxury real estate",
    "Strong network of high-net-worth individuals",
    "Commitment to professional excellence",
    "Fluency in English and Arabic preferred",
  ];

  const supportItems = [
    {
      icon: Target,
      title: "Marketing Support",
      description:
        "Professional marketing materials, brochures, and digital assets",
    },
    // {
    //   icon: Users,
    //   title: "Training Program",
    //   description:
    //     "Comprehensive training on Dubai market and our exclusive projects",
    // },
    {
      icon: Phone,
      title: "Dedicated Support",
      description: "Personal account manager and priority customer service",
    },
    // {
    //   icon: Globe,
    //   title: "Lead Generation",
    //   description: "Access to qualified leads and referral opportunities",
    // },
  ];

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <section className="section-padding bg-[#8b7355] text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center">
                <Handshake className="w-8 h-8 text-[#8b7355]" />
              </div>
            </div>
            <h1 className="text-white mb-6 text-[48px]">Join As A Partner</h1>
            <p className="text-tan text-xl leading-relaxed">
              Partner with Smart Off Plan and unlock exclusive opportunities in
              Dubai's thriving off-plan property market. Build your business
              with our premium support.
            </p>
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[#8b7355] mb-6 text-[40px]">
              Why Partner With Us?
            </h2>
            <p className="text-warm-gray text-lg max-w-3xl mx-auto">
              Join Dubai's most trusted off-plan property platform and grow your
              business with exclusive access to premium developments and
              comprehensive support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partnerBenefits.map((benefit, index) => (
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

      {/* Requirements & Support */}
      <section className="section-padding bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Requirements */}
            <div>
              <h3 className="text-[#8b7355] mb-8">Partner Requirements</h3>
              <div className="space-y-4">
                {requirements.map((requirement, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-gold mt-1 mr-3 flex-shrink-0" />
                    <span className="text-warm-gray">{requirement}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-white rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
                <h4 className="text-[#8b7355] mb-4">Ready to Get Started?</h4>
                <p className="text-warm-gray text-sm mb-4">
                  Complete the application form and our team will review your
                  profile within 48 hours.
                </p>
                <Button
                  className="bg-gold hover:bg-gold/90 text-[#8b7355]"
                  onClick={handleScheduleInterview}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Schedule Interview
                </Button>
              </div>
            </div>

            {/* Support Services */}
            <div>
              <h3 className="text-[#8b7355] mb-8">What We Provide</h3>
              <div className="space-y-6">
                {supportItems.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-beige rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <item.icon className="w-6 h-6 text-gold" />
                      </div>
                      <div>
                        <h5 className="text-[#8b7355] mb-2">{item.title}</h5>
                        <p className="text-warm-gray text-sm leading-relaxed">
                          {item.description}
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
      <section className="section-padding">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-[#8b7355] mb-6 text-[40px]">
                Partner Application
              </h2>
              <p className="text-warm-gray text-lg max-w-2xl mx-auto">
                Ready to join our exclusive partner network? Complete the
                application below and take the first step towards a profitable
                partnership.
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
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      className="w-full py-3 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                    />
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
                      htmlFor="company"
                      className="block text-sm text-[#8b7355] mb-2"
                    >
                      Company/Agency Name *
                    </label>
                    <Input
                      id="company"
                      name="company"
                      type="text"
                      required
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Your company name"
                      className="w-full py-3 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="experience"
                      className="block text-sm text-[#8b7355] mb-2"
                    >
                      Years of Experience *
                    </label>
                    <Input
                      id="experience"
                      name="experience"
                      type="text"
                      required
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 years"
                      className="w-full py-3 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="portfolio"
                      className="block text-sm text-[#8b7355] mb-2"
                    >
                      Portfolio/Website (Optional)
                    </label>
                    <Input
                      id="portfolio"
                      name="portfolio"
                      type="text"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      placeholder="e.g., instagram.com/username, or https://yoursite.com"
                      className="w-full py-3 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                    />
                    <p className="text-xs text-warm-gray mt-1">
                      Share your website, social media, or portfolio link
                    </p>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm text-[#8b7355] mb-2"
                  >
                    Tell Us About Your Experience *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Describe your real estate experience, specializations, and why you'd like to partner with us..."
                    rows={6}
                    className="w-full p-4 border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold resize-none"
                  />
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
                        <Heart className="w-5 h-5 mr-2" />
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
              Questions About Partnership?
            </h2>
            <p className="text-tan text-lg mb-8 leading-relaxed">
              Our partnership team is ready to discuss opportunities and answer
              any questions you may have about joining our exclusive network.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gold hover:bg-gold/90 text-[#8b7355] px-8 py-3 text-lg"
                onClick={handleCallPartnershipTeam}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Partnership Team
              </Button>
              <Button
                className="bg-white text-[rgba(30,26,26,1)] hover:bg-white/90 hover:text-[#8b7355] border-solid border-[1px] border-white px-8 py-4 text-lg rounded-xl text-[14px]"
                onClick={handleEmailUs}
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
