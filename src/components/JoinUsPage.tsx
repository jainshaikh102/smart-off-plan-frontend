import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowLeft,
  Users,
  Globe2,
  TrendingUp,
  Award,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Heart,
  DollarSign,
  Zap,
} from "lucide-react";

interface JoinUsPageProps {
  onBack: () => void;
}

export function JoinUsPage({ onBack }: JoinUsPageProps) {
  const [selectedType, setSelectedType] = useState<"partner" | "franchise">(
    "partner"
  );

  const partnerBenefits = [
    {
      icon: DollarSign,
      title: "20% Commission",
      description:
        "Earn substantial commissions on every successful property sale",
    },
    {
      icon: Zap,
      title: "Quick Setup",
      description: "Get started immediately with minimal requirements",
    },
    {
      icon: TrendingUp,
      title: "High-Value Deals",
      description:
        "Access to premium off-plan properties with excellent margins",
    },
    {
      icon: Award,
      title: "Marketing Support",
      description: "Professional marketing materials and campaign support",
    },
  ];

  const franchiseBenefits = [
    {
      icon: DollarSign,
      title: "50% Revenue Share",
      description: "Keep 50% of all revenue generated in your territory",
    },
    {
      icon: Globe2,
      title: "Territory Protection",
      description: "Exclusive rights to your designated geographic area",
    },
    {
      icon: Users,
      title: "Complete Setup Support",
      description: "Full business setup, training, and operational guidance",
    },
    {
      icon: Heart,
      title: "Brand Power",
      description:
        "Leverage Smart Off Plan's established reputation and network",
    },
  ];

  const processSteps = [
    {
      step: 1,
      title: "Application",
      description: "Submit your application with business background and goals",
    },
    {
      step: 2,
      title: "Assessment",
      description:
        "Our team evaluates your application and conducts an interview",
    },
    {
      step: 3,
      title: "Agreement",
      description:
        "Sign partnership or franchise agreement with terms and conditions",
    },
    {
      step: 4,
      title: "Launch",
      description:
        "Complete setup, training, and begin operations with full support",
    },
  ];

  const successHighlights = [
    {
      name: "Alex Morrison",
      location: "London, UK",
      type: "Referral Partner",
      achievement: "Generated AED 2.5M in sales in first 6 months",
      quote:
        "The commission structure and support from Smart Off Plan exceeded my expectations.",
    },
    {
      name: "Sarah Chen",
      location: "Singapore",
      type: "Franchise Owner",
      achievement: "Established thriving office with 15+ agents",
      quote:
        "The comprehensive training and territory protection gave me the confidence to succeed.",
    },
    {
      name: "David Kumar",
      location: "Mumbai, India",
      type: "Referral Partner",
      achievement: "Achieved top performer status in 8 months",
      quote:
        "Access to premium Dubai properties made all the difference for my clients.",
    },
  ];

  return (
    <div className="bg-ivory pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-[#8b7355] text-white">
        <div className="container">
          <div className="flex items-center mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="text-white hover:bg-white/10 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-[#8b7355]" />
              </div>
            </div>
            <h1 className="text-white mb-6">Join Our Success Story</h1>
            <p className="text-tan text-xl leading-relaxed mb-12">
              Partner with Smart Off Plan and unlock exceptional earning
              opportunities in Dubai's thriving real estate market. Choose the
              path that fits your ambitions.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button
                size="lg"
                onClick={() => setSelectedType("partner")}
                className={`px-8 py-4 text-lg transition-all duration-300 ${
                  selectedType === "partner"
                    ? "bg-gold hover:bg-gold/90 text-[#8b7355]"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                Become a Partner
              </Button>
              <Button
                size="lg"
                onClick={() => setSelectedType("franchise")}
                className={`px-8 py-4 text-lg transition-all duration-300 ${
                  selectedType === "franchise"
                    ? "bg-gold hover:bg-gold/90 text-[#8b7355]"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
              >
                <Globe2 className="w-5 h-5 mr-2" />
                Become a Franchisee
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner/Franchise Options */}
      <section className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Referral Partners */}
            <div
              className={`transition-all duration-500 ${
                selectedType === "partner"
                  ? "opacity-100 scale-100"
                  : "opacity-50 scale-95"
              }`}
            >
              <Card className="bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] rounded-2xl border-0 overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Users className="w-8 h-8 text-[#8b7355]" />
                    </div>
                    <h3 className="text-[#8b7355] mb-4">Referral Partners</h3>
                    <div className="text-4xl text-gold mb-4">20%</div>
                    <p className="text-warm-gray">
                      Commission on every successful sale
                    </p>
                  </div>

                  <div className="space-y-6 mb-8">
                    {partnerBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-10 h-10 bg-beige rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                          <benefit.icon className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <h5 className="text-[#8b7355] mb-2">
                            {benefit.title}
                          </h5>
                          <p className="text-warm-gray text-sm">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-beige rounded-xl p-6 mb-6">
                    <h5 className="text-[#8b7355] mb-3">Perfect for:</h5>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-warm-gray">
                        <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                        Real estate agents and brokers
                      </li>
                      <li className="flex items-center text-sm text-warm-gray">
                        <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                        Financial advisors and consultants
                      </li>
                      <li className="flex items-center text-sm text-warm-gray">
                        <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                        Business development professionals
                      </li>
                      <li className="flex items-center text-sm text-warm-gray">
                        <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                        High-net-worth network owners
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Franchise Opportunities */}
            <div
              className={`transition-all duration-500 ${
                selectedType === "franchise"
                  ? "opacity-100 scale-100"
                  : "opacity-50 scale-95"
              }`}
            >
              <Card className="bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] rounded-2xl border-0 overflow-hidden">
                <CardContent className="p-8">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Globe2 className="w-8 h-8 text-[#8b7355]" />
                    </div>
                    <h3 className="text-[#8b7355] mb-4">Global Franchise</h3>
                    <div className="text-4xl text-gold mb-4">50%</div>
                    <p className="text-warm-gray">
                      Revenue share with full support
                    </p>
                  </div>

                  <div className="space-y-6 mb-8">
                    {franchiseBenefits.map((benefit, index) => (
                      <div key={index} className="flex items-start">
                        <div className="w-10 h-10 bg-beige rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                          <benefit.icon className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                          <h5 className="text-[#8b7355] mb-2">
                            {benefit.title}
                          </h5>
                          <p className="text-warm-gray text-sm">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-beige rounded-xl p-6 mb-6">
                    <h5 className="text-[#8b7355] mb-3">Perfect for:</h5>
                    <ul className="space-y-2">
                      <li className="flex items-center text-sm text-warm-gray">
                        <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                        Experienced real estate entrepreneurs
                      </li>
                      <li className="flex items-center text-sm text-warm-gray">
                        <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                        Business owners seeking expansion
                      </li>
                      <li className="flex items-center text-sm text-warm-gray">
                        <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                        Investment-ready professionals
                      </li>
                      <li className="flex items-center text-sm text-warm-gray">
                        <CheckCircle className="w-4 h-4 text-gold mr-3 flex-shrink-0" />
                        Market leaders in their region
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-beige">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[#8b7355] mb-6">How It Works</h2>
            <p className="text-warm-gray text-lg max-w-3xl mx-auto">
              Our streamlined process ensures you're set up for success from day
              one
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative text-center">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-6 text-[#8b7355] text-xl shadow-lg">
                  {step.step}
                </div>
                <h4 className="text-[#8b7355] mb-4">{step.title}</h4>
                <p className="text-warm-gray text-sm leading-relaxed">
                  {step.description}
                </p>
                {index < processSteps.length - 1 && (
                  <div
                    className="hidden lg:block absolute top-6 left-full w-full h-0.5 bg-gold/30 transform -translate-y-1/2"
                    style={{ width: "calc(100% - 3rem)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Highlights */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-[#8b7355] mb-6">Success Stories</h2>
            <p className="text-warm-gray text-lg max-w-3xl mx-auto">
              See how our partners and franchisees are building successful
              businesses with Smart Off Plan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successHighlights.map((story, index) => (
              <Card
                key={index}
                className="bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] hover:-translate-y-1 transition-all duration-300 rounded-2xl border-0"
              >
                <CardContent className="p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mr-4">
                      <span className="text-[#8b7355]">
                        {story.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h5 className="text-[#8b7355]">{story.name}</h5>
                      <p className="text-warm-gray text-sm">{story.location}</p>
                    </div>
                  </div>

                  <div className="bg-beige rounded-lg p-4 mb-4">
                    <div className="text-sm text-gold mb-1">{story.type}</div>
                    <div className="text-[#8b7355]">{story.achievement}</div>
                  </div>

                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-gold fill-current"
                      />
                    ))}
                  </div>

                  <p className="text-warm-gray text-sm italic">
                    "{story.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="section-padding bg-beige">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-[#8b7355] mb-6">Ready to Get Started?</h2>
              <p className="text-warm-gray text-lg">
                Submit your application and take the first step towards a
                profitable partnership
              </p>
            </div>

            <Card className="bg-white shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] rounded-2xl border-0">
              <CardContent className="p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-[#8b7355] mb-2">
                        Application Type
                      </label>
                      <Select defaultValue={selectedType}>
                        <SelectTrigger className="w-full rounded-xl border-soft-gray/30 focus:border-gold focus:ring-gold">
                          <SelectValue placeholder="Select application type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="partner">
                            Referral Partner (20% Commission)
                          </SelectItem>
                          <SelectItem value="franchise">
                            Global Franchise (50% Revenue Share)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm text-[#8b7355] mb-2">
                        Preferred Territory
                      </label>
                      <Input
                        type="text"
                        placeholder="e.g., London, Singapore, Mumbai"
                        className="rounded-xl border-soft-gray/30 focus:border-gold focus:ring-gold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm text-[#8b7355] mb-2">
                        Full Name
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        className="rounded-xl border-soft-gray/30 focus:border-gold focus:ring-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#8b7355] mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        className="rounded-xl border-soft-gray/30 focus:border-gold focus:ring-gold"
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
                        placeholder="Enter your phone number"
                        className="rounded-xl border-soft-gray/30 focus:border-gold focus:ring-gold"
                      />
                    </div>

                    <div>
                      <label className="block text-sm text-[#8b7355] mb-2">
                        Years of Experience
                      </label>
                      <Select>
                        <SelectTrigger className="w-full rounded-xl border-soft-gray/30 focus:border-gold focus:ring-gold">
                          <SelectValue placeholder="Select experience level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-2">0-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="10+">10+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-[#8b7355] mb-2">
                      Current Business/Role
                    </label>
                    <Input
                      type="text"
                      placeholder="Describe your current business or professional role"
                      className="rounded-xl border-soft-gray/30 focus:border-gold focus:ring-gold"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#8b7355] mb-2">
                      Why do you want to partner with Smart Off Plan?
                    </label>
                    <Textarea
                      placeholder="Tell us about your goals and what attracts you to this opportunity..."
                      rows={4}
                      className="rounded-xl border-soft-gray/30 focus:border-gold focus:ring-gold resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-[#8b7355] mb-2">
                      Expected Investment/Network Size
                    </label>
                    <Textarea
                      placeholder="Describe your investment capacity and network reach..."
                      rows={3}
                      className="rounded-xl border-soft-gray/30 focus:border-gold focus:ring-gold resize-none"
                    />
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button className="bg-gold hover:bg-gold/90 text-[#8b7355] px-12 py-3 text-lg">
                      Submit Application
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding bg-[#8b7355] text-white">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-white mb-6">Have Questions?</h2>
            <p className="text-tan text-lg mb-12">
              Our partnership team is here to help you understand the
              opportunities and get started
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-[#8b7355]" />
                </div>
                <h5 className="text-white mb-2">Phone</h5>
                <p className="text-tan">+971 4 123 4567</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-[#8b7355]" />
                </div>
                <h5 className="text-white mb-2">Email</h5>
                <p className="text-tan">partnerships@smartoffplan.ae</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-[#8b7355]" />
                </div>
                <h5 className="text-white mb-2">Office</h5>
                <p className="text-tan">Business Bay, Dubai, UAE</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="border-white text-[rgba(0,0,0,1)] hover:bg-white hover:text-[#8b7355] px-8 py-3 text-lg text-[14px]"
            >
              Schedule a Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
