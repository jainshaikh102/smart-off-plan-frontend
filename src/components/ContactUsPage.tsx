import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Home,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Calendar,
  Globe,
  Shield,
  CheckCircle,
} from "lucide-react";

interface ContactUsPageProps {
  onBack: () => void;
}

export function ContactUsPage({ onBack }: ContactUsPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    propertyType: "off-plan",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    // console.log("Form submitted:", formData);
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      primary: "‪+971543218123",
      secondary: "+971 50 123 4567",
      description: "Call us for immediate assistance",
      color: "text-gold",
    },
    {
      icon: Mail,
      title: "Email",
      primary: "accounts@smartoffplan.com",
      secondary: "sales@smartoffplan.ae",
      description: "Send us your inquiries anytime",
      color: "text-[#8b7355]",
    },
    {
      icon: MessageCircle,
      title: "WhatsApp",
      primary: "+971 50 123 4567",
      secondary: "Available 24/7",
      description: "Quick responses via WhatsApp",
      color: "text-gold",
    },
    {
      icon: MapPin,
      title: "Office",
      primary: "Business Bay, Dubai",
      secondary: "UAE",
      description: "Visit our luxury office",
      color: "text-[#8b7355]",
    },
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 7:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 4:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  const services = [
    {
      icon: Globe,
      title: "Property Investment",
      description: "Expert guidance on Dubai real estate investments",
    },
    {
      icon: Shield,
      title: "Legal Support",
      description: "Complete legal assistance for property transactions",
    },
    {
      icon: Calendar,
      title: "Consultation",
      description: "Free consultation for investment planning",
    },
  ];

  const officeDetails = [
    {
      title: "Dubai Office",
      address: "240 London Road, Bagshot, GU19 5EZ, UK",
      phone: "‪+971543218123",
      email: "dubai@smartoffplan.ae",
      hours: "Mon-Fri: 9AM-7PM, Sat: 10AM-4PM",
    },
    {
      title: "International Sales",
      address: "Available Worldwide",
      phone: "+971 50 123 4567",
      email: "international@smartoffplan.ae",
      hours: "24/7 WhatsApp Support",
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
          {/* Elegant Breadcrumb Navigation */}
          <nav className="flex items-center space-x-2 mb-12 text-sm">
            <button
              onClick={onBack}
              className="flex items-center text-warm-gray hover:text-gold transition-colors duration-300 group"
            >
              <Home className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform duration-300" />
              <span>Home</span>
            </button>
            <ChevronRight className="w-4 h-4 text-soft-gray" />
            <span className="text-[#8b7355] font-medium">Contact</span>
          </nav>

          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gold/10 to-gold/5 rounded-full mb-6">
              <span className="text-[#8b7355] text-sm font-medium">
                Get In Touch
              </span>
            </div>

            <h1 className="text-[#8b7355] mb-6">Contact Smart Off Plan</h1>
            <p className="text-warm-gray text-xl leading-relaxed mb-8">
              Ready to invest in Dubai's premium off-plan properties? Our expert
              team is here to guide you through every step of your real estate
              investment journey.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[#8b7355] mb-6">Multiple Ways to Reach Us</h2>
            <p className="text-warm-gray text-lg max-w-3xl mx-auto">
              Choose your preferred method of communication. We're here to help
              you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_12px_40px_-4px_rgba(139,115,85,0.15),0_6px_20px_-4px_rgba(139,115,85,0.1)] hover:-translate-y-2 transition-all duration-300 border-0 overflow-hidden group"
              >
                <CardContent className="p-8 text-center h-full flex flex-col">
                  <div className="w-16 h-16 bg-gradient-to-br from-beige to-ivory rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <method.icon className={`w-8 h-8 ${method.color}`} />
                  </div>

                  <h4 className="text-[#8b7355] mb-4 group-hover:text-gold transition-colors">
                    {method.title}
                  </h4>

                  <div className="text-lg text-[#8b7355] mb-2">
                    {method.primary}
                  </div>
                  <div className="text-sm text-warm-gray mb-4">
                    {method.secondary}
                  </div>

                  <p className="text-warm-gray text-sm leading-relaxed flex-grow">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Office Info */}
      <section className="section-padding bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div>
              <h2 className="text-[#8b7355] mb-8">Send Us a Message</h2>
              <p className="text-warm-gray text-lg leading-relaxed mb-8">
                Fill out the form below and our team will get back to you within
                24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#8b7355] mb-2">
                      Full Name
                    </label>
                    <Input
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#8b7355] mb-2">
                      Email
                    </label>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-[#8b7355] mb-2">
                      Phone Number
                    </label>
                    <Input
                      type="tel"
                      placeholder="+971 50 123 4567"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-[#8b7355] mb-2">
                      Subject
                    </label>
                    <Input
                      type="text"
                      placeholder="How can we help you?"
                      value={formData.subject}
                      onChange={(e) =>
                        handleInputChange("subject", e.target.value)
                      }
                      className="border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-[#8b7355] mb-2">
                    Message
                  </label>
                  <Textarea
                    placeholder="Tell us about your property investment goals..."
                    value={formData.message}
                    onChange={(e) =>
                      handleInputChange("message", e.target.value)
                    }
                    className="border border-soft-gray/30 rounded-xl focus:border-gold focus:ring-gold min-h-[120px]"
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gold hover:bg-gold/90 text-[#8b7355] py-4 rounded-xl text-lg"
                >
                  <Send className="w-5 h-5 mr-2" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Office Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-[#8b7355] mb-8">Office Information</h2>

                <div className="space-y-6">
                  {officeDetails.map((office, index) => (
                    <Card
                      key={index}
                      className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] border-0"
                    >
                      <CardContent className="p-6">
                        <h4 className="text-[#8b7355] mb-4">{office.title}</h4>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <MapPin className="w-5 h-5 text-gold mt-1 mr-3 flex-shrink-0" />
                            <span className="text-warm-gray">
                              {office.address}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                            <span className="text-warm-gray">
                              {office.phone}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-5 h-5 text-gold mr-3 flex-shrink-0" />
                            <span className="text-warm-gray">
                              {office.email}
                            </span>
                          </div>
                          <div className="flex items-start">
                            <Clock className="w-5 h-5 text-gold mt-1 mr-3 flex-shrink-0" />
                            <span className="text-warm-gray">
                              {office.hours}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Working Hours */}
              <div>
                <h3 className="text-[#8b7355] mb-6">Working Hours</h3>
                <Card className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] border-0">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {officeHours.map((schedule, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center"
                        >
                          <span className="text-warm-gray">{schedule.day}</span>
                          <span className="text-[#8b7355] font-medium">
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services We Help With */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[#8b7355] mb-6">How We Can Help You</h2>
            <p className="text-warm-gray text-lg max-w-3xl mx-auto">
              Our comprehensive services cover every aspect of your Dubai
              property investment journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] group-hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] group-hover:-translate-y-1 transition-all duration-300">
                  <service.icon className="w-8 h-8 text-gold" />
                </div>
                <h4 className="text-[#8b7355] mb-4">{service.title}</h4>
                <p className="text-warm-gray text-sm leading-relaxed">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-gradient-to-br from-beige to-ivory">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[#8b7355] mb-6">Quick Answers</h2>
            <p className="text-warm-gray text-lg max-w-3xl mx-auto">
              Common questions about contacting us and our services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] border-0">
              <CardContent className="p-8">
                <h4 className="text-[#8b7355] mb-4">
                  How quickly do you respond?
                </h4>
                <p className="text-warm-gray text-sm leading-relaxed">
                  We respond to all inquiries within 24 hours. For urgent
                  matters, call us directly or message us on WhatsApp for
                  immediate assistance.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] border-0">
              <CardContent className="p-8">
                <h4 className="text-[#8b7355] mb-4">
                  Do you offer free consultations?
                </h4>
                <p className="text-warm-gray text-sm leading-relaxed">
                  Yes! We offer free initial consultations to understand your
                  investment goals and provide personalized recommendations for
                  Dubai properties.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] border-0">
              <CardContent className="p-8">
                <h4 className="text-[#8b7355] mb-4">
                  Can international clients visit?
                </h4>
                <p className="text-warm-gray text-sm leading-relaxed">
                  Absolutely! We welcome international clients to visit our
                  Dubai office. We can also arrange virtual meetings and
                  property tours.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] border-0">
              <CardContent className="p-8">
                <h4 className="text-[#8b7355] mb-4">
                  What languages do you speak?
                </h4>
                <p className="text-warm-gray text-sm leading-relaxed">
                  Our team speaks English, Arabic, Hindi, Urdu, and several
                  other languages to serve our diverse international clientele
                  effectively.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-[#8b7355] text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-white mb-6">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-tan text-lg mb-8 leading-relaxed">
              Don't wait for the perfect moment. The best time to invest in
              Dubai real estate is now. Contact us today and let's discuss your
              investment goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                className="bg-gold hover:bg-gold/90 text-[#8b7355] px-8 py-3 text-lg"
                onClick={() => (window.location.href = "tel:+971543218123")}
              >
                <Phone className="w-5 h-5 mr-2" />
                Call Now
              </Button>
              <Button
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-[#8b7355] px-8 py-3 text-lg"
                onClick={() =>
                  window.open(
                    "https://web.whatsapp.com/send?phone=971543218123&text=Hello%20Smart%20Off%20Plan!%20I'm%20interested%20in%20learning%20more%20about%20your%20property%20investment%20opportunities.%20Could%20you%20please%20help%20me%20get%20started?",
                    "_blank"
                  )
                }
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                WhatsApp Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
