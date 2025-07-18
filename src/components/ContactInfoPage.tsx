import { useState } from "react";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Calendar,
  Users,
  Building2,
  Smartphone,
  Send,
  CheckCircle,
  Star,
  Globe,
  ChevronRight,
  Home,
  AlertCircle,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface ContactInfoPageProps {
  onBack: () => void;
}

export function ContactInfoPage({ onBack }: ContactInfoPageProps) {
  const [selectedOffice, setSelectedOffice] = useState("main");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    preferredContact: "",
    inquiryType: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const offices = [
    {
      id: "main",
      name: "Business Bay Headquarters",
      shortName: "Business Bay",
      address: "240 London Road, Bagshot, GU19 5EZ, UK",
      phone: "‪+971543218123",
      email: "invest@smartoffplan.com",
      hours: "Mon-Fri: 9:00 AM - 7:00 PM, Sat: 10:00 AM - 4:00 PM",
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop&crop=center",
      type: "Headquarters",
      color: "from-gold to-gold/80",
    },
  ];

  const contactMethods = [
    {
      icon: Phone,
      title: "Call Us",
      description: "Speak directly with our property experts",
      value: "+971 54 321 8123",
      action: "tel:+971 54 321 8123",
      color: "text-gold",
      bgColor: "from-gold/10 to-gold/5",
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us your inquiries anytime",
      value: "invest@smartoffplan.com",
      action: "mailto:invest@smartoffplan.com",
      color: "text-[#8b7355]",
      bgColor: "from-[#8b7355]/10 to-[#8b7355]/5",
    },
    {
      icon: MessageSquare,
      title: "WhatsApp",
      description: "Chat with us instantly",
      value: "+971 54 321 8123",
      action:
        "https://web.whatsapp.com/send?phone=971543218123&text=Hello%20Smart%20Off%20Plan!%20I'm%20interested%20in%20learning%20more%20about%20your%20property%20investment%20opportunities.%20Could%20you%20please%20help%20me%20get%20started?",
      color: "text-green-600",
      bgColor: "from-green-100/50 to-green-50",
    },
    {
      icon: Calendar,
      title: "Book Meeting",
      description: "Schedule a consultation",
      value: "Free 30-min session",
      action: "https://calendly.com/smartoffplan/consultation",
      color: "text-gold",
      bgColor: "from-gold/10 to-gold/5",
    },
  ];

  const services = [
    {
      name: "Property Investment Consultation",
      time: "30-45 min",
      icon: Building2,
    },
    { name: "Off-Plan Project Tours", time: "2-3 hours", icon: MapPin },
    { name: "Market Analysis Sessions", time: "45-60 min", icon: Star },
    { name: "Legal & Documentation Support", time: "60 min", icon: Users },
    { name: "Financial Planning Consultation", time: "45 min", icon: Calendar },
    { name: "After-Sales Support", time: "30 min", icon: MessageSquare },
  ];

  // Phone number validation function
  const validatePhoneNumber = (phone: string) => {
    // Remove all non-digit characters for validation
    const digitsOnly = phone.replace(/\D/g, "");

    // Must have at least 7 digits and at most 15 digits
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      return false;
    }

    // UAE numbers: +971 followed by 8-9 digits, or local format starting with 0
    const uaePattern = /^(\+971|971|0)[0-9]{8,9}$/;

    // Pakistani numbers: +92 followed by 10 digits, or local format starting with 0
    const pakistanPattern = /^(\+92|92|0)[0-9]{10,11}$/;

    // US/Canada: +1 followed by 10 digits
    const usCanadaPattern = /^(\+1|1)?[0-9]{10}$/;

    // UK: +44 followed by 10-11 digits
    const ukPattern = /^(\+44|44|0)[0-9]{10,11}$/;

    // India: +91 followed by 10 digits
    const indiaPattern = /^(\+91|91|0)?[0-9]{10}$/;

    // General international pattern for other countries
    // Accepts numbers with country codes (+XX) followed by 7-12 digits
    const generalInternationalPattern = /^(\+[1-9]\d{0,3})?[0-9]{7,12}$/;

    return (
      uaePattern.test(phone) ||
      pakistanPattern.test(phone) ||
      usCanadaPattern.test(phone) ||
      ukPattern.test(phone) ||
      indiaPattern.test(phone) ||
      generalInternationalPattern.test(phone)
    );
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters except + at the beginning
    let cleaned = value.replace(/[^\d+]/g, "");

    // Ensure + only appears at the beginning
    if (cleaned.includes("+")) {
      const plusIndex = cleaned.indexOf("+");
      if (plusIndex === 0) {
        cleaned = "+" + cleaned.slice(1).replace(/\+/g, "");
      } else {
        cleaned = cleaned.replace(/\+/g, "");
      }
    }

    // Limit length to reasonable phone number length
    if (cleaned.length > 15) {
      cleaned = cleaned.slice(0, 15);
    }

    return cleaned;
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear error when user starts typing
    if (error) {
      setError(null);
    }

    // Special handling for phone number
    if (field === "phone") {
      const formattedPhone = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [field]: formattedPhone }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.subject.trim() ||
        !formData.message.trim() ||
        !formData.inquiryType
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate name length (2-100 characters)
      if (
        formData.name.trim().length < 2 ||
        formData.name.trim().length > 100
      ) {
        throw new Error("Name must be between 2 and 100 characters");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error("Please provide a valid email address");
      }

      // Validate subject length (5-200 characters)
      if (
        formData.subject.trim().length < 5 ||
        formData.subject.trim().length > 200
      ) {
        throw new Error("Subject must be between 5 and 200 characters");
      }

      // Validate message length (10-2000 characters)
      if (
        formData.message.trim().length < 10 ||
        formData.message.trim().length > 2000
      ) {
        throw new Error("Message must be between 10 and 2000 characters");
      }

      // Validate inquiry type
      const validInquiryTypes = [
        "investment",
        "property",
        "financing",
        "legal",
        "general",
        "partnership",
      ];
      if (!validInquiryTypes.includes(formData.inquiryType)) {
        throw new Error("Please select a valid inquiry type");
      }

      // Validate phone number if provided (8-20 characters)
      if (formData.phone && formData.phone.trim()) {
        if (
          formData.phone.trim().length < 8 ||
          formData.phone.trim().length > 20
        ) {
          throw new Error("Phone number must be between 8 and 20 characters");
        }
        if (!validatePhoneNumber(formData.phone)) {
          throw new Error(
            "Please enter a valid phone number (e.g., +971501234567, +923313693668, 0501234567)"
          );
        }
      }

      console.log("📧 Submitting detailed message form:", formData);

      // Call the Message Us API
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/email/message-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          subject: formData.subject.trim(),
          message: formData.message.trim(),
          inquiryType: formData.inquiryType,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (result.details && Array.isArray(result.details)) {
          const errorMessages = result.details
            .map((detail: any) => detail.msg)
            .join(", ");
          throw new Error(errorMessages);
        }
        throw new Error(result.message || "Failed to send message");
      }

      console.log("✅ Message form submitted successfully:", result);

      // Show success message
      setIsSubmitted(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          preferredContact: "",
          inquiryType: "",
        });
      }, 5000);
    } catch (error) {
      console.error("❌ Error submitting message form:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedOfficeData =
    offices.find((office) => office.id === selectedOffice) || offices[0];

  // WhatsApp helper functions
  const handleWhatsAppMessage = (message: string) => {
    const phoneNumber = "+923454954954";
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleBookFreeConsultation = () => {
    const message = `Hello! I would like to book a free consultation with Smart Off Plan.

I'm interested in:
- Off-plan property investment opportunities in Dubai
- Market insights and investment guidance
- Property selection and evaluation
- Legal and financial consultation
- Investment strategy planning
- Current market trends and projections

Could you please help me schedule a convenient time for a free consultation with one of your property experts? I'm looking forward to discussing my investment goals with your team.

Thank you!`;

    handleWhatsAppMessage(message);
  };

  return (
    <div className="bg-gradient-to-br from-ivory to-beige">
      {/* Header Section */}
      <section className="py-12 bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <div className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-gold/10 to-gold/5 rounded-full mb-4">
              <Building2 className="w-4 h-4 text-gold mr-2" />
              <span className="text-[#8b7355] text-sm">
                Premium Real Estate Services
              </span>
            </div>

            <h1 className="text-[rgba(30,26,26,1)] mb-4 text-[48px]">
              Contact Our Experts
            </h1>
            <p className="text-[rgba(30,26,26,1)] leading-relaxed mb-8">
              Connect with our Dubai property specialists and discover your
              perfect off-plan investment opportunity.
            </p>

            {/* Quick Contact Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {contactMethods.map((method, index) => (
                <Card
                  key={index}
                  className="group cursor-pointer bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.15)] transition-all duration-300 border-0 hover:-translate-y-1 overflow-hidden "
                  onClick={() => {
                    if (method.action.startsWith("http")) {
                      // Open external links (WhatsApp, Calendly) in new tab
                      window.open(method.action, "_blank");
                    } else if (method.action.startsWith("tel:")) {
                      // Handle phone calls
                      window.location.href = method.action;
                    } else if (method.action.startsWith("mailto:")) {
                      // Handle email
                      window.location.href = method.action;
                    } else {
                      // Fallback for other actions
                      window.location.href = method.action;
                    }
                  }}
                >
                  <CardContent className="p-4 text-center relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${method.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                    ></div>

                    <div className="relative z-10">
                      <div
                        className={`w-12 h-12 ${method.color} bg-white rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-gradient-to-br group-hover:from-gold group-hover:to-gold/80 group-hover:text-white transition-all duration-300 shadow-md`}
                      >
                        <method.icon className="w-5 h-5" />
                      </div>

                      <h4 className="text-[rgba(30,26,26,1)] mb-2 text-sm group-hover:text-gold transition-colors duration-300">
                        {method.title}
                      </h4>

                      <p className="text-[rgba(30,26,26,0.8)] text-xs mb-3 leading-relaxed">
                        {method.description}
                      </p>

                      <div className="inline-flex items-center px-2 py-1 bg-beige/50 rounded-full text-xs text-[rgba(30,26,26,1)] group-hover:bg-white/20 transition-colors duration-300">
                        {method.value}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Compact Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08)] border-0">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-[rgba(30,26,26,1)] mb-2 flex items-center">
                    <Send className="w-5 h-5 mr-2 text-gold" />
                    Send Message
                  </CardTitle>
                  <p className="text-[rgba(30,26,26,1)] text-sm">
                    Our experts will respond within 2-4 hours
                  </p>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-[#8b7355] mb-2">Message Sent!</h3>
                      <p className="text-warm-gray text-sm">
                        We'll get back to you within 2-4 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div>
                          <label className="block text-[rgba(30,26,26,0.7)] mb-2 text-sm">
                            Full Name *
                            <span className="text-xs text-warm-gray ml-2">
                              ({formData.name.length}/100)
                            </span>
                          </label>
                          <Input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              handleInputChange("name", e.target.value)
                            }
                            placeholder="Enter your name (2-100 characters)"
                            className={`rounded-xl border-[#8b7355]/20 focus:border-gold focus:ring-gold ${
                              formData.name.length > 0 &&
                              (formData.name.length < 2 ||
                                formData.name.length > 100)
                                ? "border-red-300 focus:border-red-500"
                                : formData.name.length >= 2 &&
                                  formData.name.length <= 100
                                ? "border-green-300 focus:border-green-500"
                                : ""
                            }`}
                            maxLength={100}
                            required
                          />
                          {formData.name.length > 0 &&
                            formData.name.length < 2 && (
                              <p className="text-red-500 text-xs mt-1">
                                Name must be at least 2 characters
                              </p>
                            )}
                          {formData.name.length > 100 && (
                            <p className="text-red-500 text-xs mt-1">
                              Name must not exceed 100 characters
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[rgba(30,26,26,0.7)] mb-2 text-sm">
                            Email Address *
                          </label>
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            placeholder="Enter your email"
                            className="rounded-xl border-[#8b7355]/20 focus:border-gold focus:ring-gold"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-[rgba(30,26,26,0.7)] mb-2 text-sm">
                            Phone Number
                            <span className="text-xs text-warm-gray ml-1">
                              (Optional)
                            </span>
                          </label>
                          <div className="relative">
                            <Input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                              placeholder="+971501234567, +923313693668, 0501234567"
                              className={`rounded-xl border-[#8b7355]/20 focus:border-gold focus:ring-gold ${
                                formData.phone &&
                                !validatePhoneNumber(formData.phone)
                                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                  : formData.phone &&
                                    validatePhoneNumber(formData.phone)
                                  ? "border-green-300 focus:border-green-500 focus:ring-green-500"
                                  : ""
                              }`}
                            />
                            {formData.phone &&
                              !validatePhoneNumber(formData.phone) && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <span className="text-red-500 text-sm">
                                    ❌
                                  </span>
                                </div>
                              )}
                            {formData.phone &&
                              validatePhoneNumber(formData.phone) && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                  <span className="text-green-500 text-sm">
                                    ✅
                                  </span>
                                </div>
                              )}
                          </div>
                          {formData.phone &&
                            !validatePhoneNumber(formData.phone) && (
                              <p className="text-red-500 text-xs mt-1">
                                Please enter a valid phone number (e.g.,
                                +971501234567, +923313693668, 0501234567)
                              </p>
                            )}
                        </div>

                        <div>
                          <label className="block text-[rgba(30,26,26,0.7)] mb-2 text-sm">
                            Inquiry Type
                          </label>
                          <Select
                            value={formData.inquiryType}
                            onValueChange={(value) =>
                              handleInputChange("inquiryType", value)
                            }
                          >
                            <SelectTrigger className="rounded-xl border-[#8b7355]/20 focus:border-gold focus:ring-gold">
                              <SelectValue placeholder="Select inquiry type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                              <SelectItem value="investment">
                                Investment Consultation
                              </SelectItem>
                              <SelectItem value="property">
                                Property Information
                              </SelectItem>
                              <SelectItem value="financing">
                                Financing Options
                              </SelectItem>
                              <SelectItem value="legal">
                                Legal Support
                              </SelectItem>
                              <SelectItem value="general">
                                General Inquiry
                              </SelectItem>
                              <SelectItem value="partnership">
                                Partnership Opportunity
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-[rgba(30,26,26,0.7)] mb-2 text-sm">
                            Subject *
                            <span className="text-xs text-warm-gray ml-2">
                              ({formData.subject.length}/200)
                            </span>
                          </label>
                          <Input
                            type="text"
                            value={formData.subject}
                            onChange={(e) =>
                              handleInputChange("subject", e.target.value)
                            }
                            placeholder="Brief description (5-200 characters)"
                            className={`rounded-xl border-[#8b7355]/20 focus:border-gold focus:ring-gold ${
                              formData.subject.length > 0 &&
                              (formData.subject.length < 5 ||
                                formData.subject.length > 200)
                                ? "border-red-300 focus:border-red-500"
                                : formData.subject.length >= 5 &&
                                  formData.subject.length <= 200
                                ? "border-green-300 focus:border-green-500"
                                : ""
                            }`}
                            maxLength={200}
                            required
                          />
                          {formData.subject.length > 0 &&
                            formData.subject.length < 5 && (
                              <p className="text-red-500 text-xs mt-1">
                                Subject must be at least 5 characters
                              </p>
                            )}
                          {formData.subject.length > 200 && (
                            <p className="text-red-500 text-xs mt-1">
                              Subject must not exceed 200 characters
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[rgba(30,26,26,0.7)] mb-2 text-sm">
                            Message *
                            <span className="text-xs text-warm-gray ml-2">
                              ({formData.message.length}/2000)
                            </span>
                          </label>
                          <Textarea
                            value={formData.message}
                            onChange={(e) =>
                              handleInputChange("message", e.target.value)
                            }
                            placeholder="Tell us about your investment goals... (10-2000 characters)"
                            rows={4}
                            className={`rounded-xl border-[#8b7355]/20 focus:border-gold focus:ring-gold ${
                              formData.message.length > 0 &&
                              (formData.message.length < 10 ||
                                formData.message.length > 2000)
                                ? "border-red-300 focus:border-red-500"
                                : formData.message.length >= 10 &&
                                  formData.message.length <= 2000
                                ? "border-green-300 focus:border-green-500"
                                : ""
                            }`}
                            maxLength={2000}
                            required
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
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-gold to-gold/80 hover:from-gold/90 hover:to-gold/70 text-[rgba(255,255,255,1)] rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#8b7355]/20 border-t-[#8b7355] rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-3 space-y-6">
              {/* Office Locations */}
              <Card className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08)] border-0">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-[rgba(30,26,26,1)] mb-2 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-gold" />
                    Our Offices
                  </CardTitle>
                  <p className="text-[rgba(30,26,26,1)] text-sm">
                    Visit us at any of our premium locations across Dubai
                  </p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {offices.map((office) => (
                      <div
                        key={office.id}
                        onClick={() => setSelectedOffice(office.id)}
                        className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                          selectedOffice === office.id
                            ? "bg-gradient-to-r from-gold/10 to-gold/5 border-2 border-gold/30"
                            : "bg-beige/30 hover:bg-beige/50 border-2 border-transparent"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-[rgba(30,26,26,1)] text-sm">
                            {office.shortName}
                          </h4>
                          <Badge
                            variant={
                              office.type === "Headquarters"
                                ? "default"
                                : "outline"
                            }
                            className={
                              office.type === "Headquarters"
                                ? "bg-gold text-[#8b7355] text-xs"
                                : "border-[#8b7355]/30 text-[#8b7355] text-xs"
                            }
                          >
                            {office.type}
                          </Badge>
                        </div>
                        <p className="text-[rgba(30,26,26,0.8)] text-xs">
                          {office.address.split(",")[0]}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Selected Office Details */}
                  <div className="relative">
                    <ImageWithFallback
                      src={selectedOfficeData.image}
                      alt={selectedOfficeData.name}
                      className="w-full h-40 object-cover rounded-xl"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-[#8b7355] backdrop-blur-sm">
                        {selectedOfficeData.type}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                          <MapPin className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                          <p className="text-[rgba(30,26,26,0.8)] text-sm">
                            {selectedOfficeData.name}
                          </p>
                          <p className="text-[rgba(30,26,26,0.7)] text-xs">
                            {selectedOfficeData.address}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                          <Phone className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                          <p className="text-[rgba(30,26,26,0.7)] text-sm">
                            {selectedOfficeData.phone}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                          <Mail className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                          <p className="text-[rgba(30,26,26,0.8)] text-sm">
                            {selectedOfficeData.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-gold" />
                        </div>
                        <div>
                          <p className="text-[rgba(30,26,26,0.7)] text-sm">
                            {selectedOfficeData.hours}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Services */}
              <Card className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08)] border-0">
                <CardHeader className="p-6 pb-4">
                  <CardTitle className="text-[rgba(30,26,26,1)] mb-2 flex items-center">
                    <Star className="w-5 h-5 mr-2 text-gold" />
                    Our Services
                  </CardTitle>
                  <p className="text-[rgba(30,26,26,0.8)] text-sm">
                    Professional consulting services tailored to your investment
                    needs
                  </p>
                </CardHeader>
                <CardContent className="p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-xl bg-beige/30 hover:bg-beige/50 transition-colors duration-200"
                      >
                        <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <service.icon className="w-4 h-4 text-gold" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="text-[rgba(30,26,26,0.8)] text-sm block">
                            {service.name}
                          </span>
                          <span className="text-[rgba(138,121,104,0.7)] text-xs">
                            {service.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-[#8b7355] to-[#8b7355]/90 hover:from-[#8b7355]/90 hover:to-[#8b7355]/80 text-white rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={handleBookFreeConsultation}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Book Free Consultation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-16 bg-gradient-to-r from-[#8b7355] via-[#8b7355] to-gold">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-white mb-6 text-[40px]">
              24/7 Emergency Support
            </h2>
            <p className="text-white/90 text-lg mb-12 leading-relaxed">
              For urgent property matters or emergency assistance, our dedicated
              support team is available around the clock to help you.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-3xl hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Phone className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-white mb-3">Emergency Hotline</h4>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">
                    Available 24/7 for urgent property assistance
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white text-[rgba(30,26,26,1)] hover:bg-white/90 hover:text-[#8b7355] border-solid border-[1px] border-white px-8 py-4 text-lg rounded-full text-[14px]"
                    onClick={() => (window.location.href = "tel:+971543218123")}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    ‪+971543218123
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 rounded-3xl hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-white mb-3">WhatsApp Support</h4>
                  <p className="text-white/80 text-sm mb-6 leading-relaxed">
                    Instant responses via WhatsApp messaging
                  </p>
                  <Button
                    variant="outline"
                    className="bg-white text-[rgba(30,26,26,1)] hover:bg-white/90 hover:text-[#8b7355] border-solid border-[1px] border-white px-8 py-4 text-lg rounded-full text-[14px]"
                    onClick={() =>
                      window.open(
                        "https://web.whatsapp.com/send?phone=971543218123&text=Hello%20Smart%20Off%20Plan!%20I'm%20interested%20in%20learning%20more%20about%20your%20property%20investment%20opportunities.%20Could%20you%20please%20help%20me%20get%20started?",
                        "_blank"
                      )
                    }
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Chat Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
