import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (
        !formData.name.trim() ||
        !formData.email.trim() ||
        !formData.message.trim()
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate phone number if provided
      if (formData.phone && formData.phone.length < 8) {
        throw new Error("Phone number must be at least 8 characters");
      }

      console.log("📧 Submitting contact form:", formData);

      // Call the Contact Us API (use local backend)
      const backendUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/email/contact-us`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          message: formData.message.trim(),
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

      console.log("✅ Contact form submitted successfully:", result);

      // Show success message
      setIsSubmitted(true);

      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: "", email: "", phone: "", message: "" });
      }, 5000);
    } catch (error) {
      console.error("❌ Error submitting contact form:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-[#F5F1EB]">
      <div className="container">
        {/* Compact Header */}
        <div className="text-center mb-12">
          <h2 className="mb-4 text-[rgba(30,26,26,1)]">Contact Us</h2>
          <p className="text-[rgba(30,26,26,1)] max-w-2xl mx-auto">
            Ready to invest in Dubai's premium properties? Get in touch with our
            expert team today.
          </p>
        </div>

        {/* Main Contact Section - Side by Side */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Left Side - Contact Information */}
              <div className="bg-[#8b7355] p-8 lg:p-12">
                <div className="h-full flex flex-col">
                  <div className="mb-8">
                    <h3 className="text-white mb-4">Get In Touch</h3>
                    <p className="text-tan">
                      We're here to help you find the perfect property
                      investment opportunity in Dubai.
                    </p>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-6 flex-grow">
                    {/* Phone */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <Phone className="w-6 h-6 text-[#8b7355]" />
                      </div>
                      <div>
                        <h4 className="text-white mb-1">Call Us</h4>
                        <p className="text-tan">+9715432181237</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <Mail className="w-6 h-6 text-[#8b7355]" />
                      </div>
                      <div>
                        <h4 className="text-white mb-1">Email Us</h4>
                        <p className="text-tan">info@smartoffplan.ae</p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <MapPin className="w-6 h-6 text-[#8b7355]" />
                      </div>
                      <div>
                        <h4 className="text-white mb-1">Visit Us</h4>
                        <p className="text-tan">Business Bay, Dubai, UAE</p>
                      </div>
                    </div>

                    {/* Working Hours */}
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <Clock className="w-6 h-6 text-[#8b7355]" />
                      </div>
                      <div>
                        <h4 className="text-white mb-1">Working Hours</h4>
                        <p className="text-tan">Monday - Friday: 9AM - 7PM</p>
                        <p className="text-tan">Saturday: 10AM - 4PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom accent */}
                  <div className="mt-8 pt-6 border-t border-white/20">
                    <p className="text-tan text-sm">
                      Trusted by international investors since 2020
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div className="p-8 lg:p-12">
                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-[#8b7355] mb-3">Thank You!</h3>
                    <p className="text-warm-gray">
                      Your message has been sent successfully. We'll get back to
                      you within 24 hours with personalized investment
                      opportunities.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleSubmit}
                    className="h-full flex flex-col"
                  >
                    <div className="mb-8">
                      <h3 className="text-[rgba(30,26,26,1)] mb-3">
                        Send us a Message
                      </h3>
                      <p className="text-[rgba(0,0,0,1)]">
                        Tell us about your investment goals and we'll provide
                        personalized guidance.
                      </p>
                    </div>

                    {/* Form Fields - Vertical Layout */}
                    <div className="space-y-6 flex-grow">
                      {/* Name */}
                      <div>
                        <label
                          htmlFor="name"
                          className="block text-[rgba(30,26,26,1)] text-sm mb-2"
                        >
                          Full Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="rounded-xl border-border/30 focus:border-gold focus:ring-gold bg-white h-12 text-[rgba(0,0,0,0.49)]"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <label
                          htmlFor="email"
                          className="block text-[rgba(30,26,26,1)] text-sm mb-2"
                        >
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="Enter your email address"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="rounded-xl border-border/30 focus:border-gold focus:ring-gold bg-white h-12"
                        />
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          htmlFor="phone"
                          className="block text-[rgba(30,26,26,1)] text-sm mb-2"
                        >
                          Phone Number
                        </label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="rounded-xl border-border/30 focus:border-gold focus:ring-gold bg-white h-12"
                        />
                      </div>

                      {/* Message */}
                      <div className="flex-grow">
                        <label
                          htmlFor="message"
                          className="block text-[#8b7355] text-sm mb-2"
                        >
                          Message *
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          placeholder="Tell us about your property investment goals, preferred areas, budget range, or any specific questions you have..."
                          value={formData.message}
                          onChange={handleInputChange}
                          required
                          rows={5}
                          className="rounded-xl border-border/30 focus:border-gold focus:ring-gold bg-white resize-none text-[rgba(0,0,0,1)]"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="mt-8">
                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#8b7355] hover:bg-[#8b7355]/90 disabled:bg-[#8b7355]/50 disabled:cursor-not-allowed text-white rounded-xl h-12 transition-all duration-300 hover:shadow-lg"
                      >
                        {isLoading ? (
                          <>
                            <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>

                      <p className="text-[rgba(0,0,0,1)] text-xs text-center mt-4">
                        By submitting this form, you agree to our privacy
                        policy. We'll respond within 24 hours.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
