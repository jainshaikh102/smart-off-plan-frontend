import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Building2,
  Award,
  Users,
  DollarSign,
  Phone,
  Mail,
  Globe,
  Star,
  Bed,
  Bath,
  Square,
  Heart,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Sample projects data for each developer
const sampleProjects = [
  {
    id: 1,
    name: "Marina Heights Residences",
    price: "Starting from AED 2.8M",
    location: "Dubai Marina",
    image:
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    status: "Off-Plan",
    completion: "Q4 2026",
    bedrooms: "1-3 BR",
    bathrooms: "2-4",
    area: "850-2,100 sq ft",
    description:
      "Luxury waterfront living with stunning marina views and world-class amenities.",
    features: [
      "Marina Views",
      "Beach Access",
      "Swimming Pool",
      "Gym",
      "Concierge",
    ],
  },
  {
    id: 2,
    name: "Downtown Elite Tower",
    price: "Starting from AED 3.5M",
    location: "Downtown Dubai",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    status: "Under Construction",
    completion: "Q2 2025",
    bedrooms: "2-4 BR",
    bathrooms: "3-5",
    area: "1,200-3,500 sq ft",
    description:
      "Iconic tower in the heart of Dubai with Burj Khalifa and fountain views.",
    features: [
      "Burj Views",
      "Fountain Views",
      "Sky Lounge",
      "Valet Service",
      "Business Center",
    ],
  },
  {
    id: 3,
    name: "Palm Luxury Villas",
    price: "Starting from AED 8.5M",
    location: "Palm Jumeirah",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    status: "Off-Plan",
    completion: "Q1 2027",
    bedrooms: "4-6 BR",
    bathrooms: "5-7",
    area: "3,500-6,000 sq ft",
    description:
      "Exclusive beachfront villas with private beach access and premium finishes.",
    features: [
      "Private Beach",
      "Garden",
      "Maid's Room",
      "Driver's Room",
      "Private Pool",
    ],
  },
];

interface DeveloperDetailPageProps {
  developer: any;
  onBack: () => void;
}

export function DeveloperDetailPage({
  developer,
  onBack,
}: DeveloperDetailPageProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-emerald-500 text-white";
      case "Off-Plan":
        return "bg-gold text-[#8b7355]";
      case "Under Construction":
        return "bg-orange-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header with back button */}
      <div className="bg-white border-b border-soft-gray/30">
        <div className="container py-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-4 text-[#8b7355] hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Partners
          </Button>

          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Developer Logo */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-white rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] p-6 flex items-center justify-center">
                <ImageWithFallback
                  src={developer.logo}
                  alt={`${developer.name} logo`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Developer Info */}
            <div className="flex-1">
              <h1 className="mb-4">{developer.name}</h1>
              <p className="text-warm-gray text-xl mb-6 leading-relaxed">
                {developer.about}
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <div className="text-2xl text-gold mb-1">
                    {developer.projects}+
                  </div>
                  <div className="text-warm-gray text-sm">Active Projects</div>
                </div>
                <div>
                  <div className="text-2xl text-gold mb-1">
                    {developer.established}
                  </div>
                  <div className="text-warm-gray text-sm">Established</div>
                </div>
                <div>
                  <div className="text-2xl text-gold mb-1">
                    {developer.totalValue}
                  </div>
                  <div className="text-warm-gray text-sm">Portfolio Value</div>
                </div>
                <div>
                  <div className="text-2xl text-gold mb-1">
                    {developer.employees}
                  </div>
                  <div className="text-warm-gray text-sm">Employees</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="section-padding">
        <div className="container">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            {/* Tabs Navigation */}
            <TabsList className="grid w-full grid-cols-4 mb-12 bg-white rounded-xl p-2 shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
              <TabsTrigger
                value="overview"
                className="text-warm-gray data-[state=active]:text-[#8b7355] data-[state=active]:bg-beige"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="text-warm-gray data-[state=active]:text-[#8b7355] data-[state=active]:bg-beige"
              >
                Projects
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="text-warm-gray data-[state=active]:text-[#8b7355] data-[state=active]:bg-beige"
              >
                Achievements
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="text-warm-gray data-[state=active]:text-[#8b7355] data-[state=active]:bg-beige"
              >
                Contact
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Company Information */}
                <div className="lg:col-span-2">
                  <Card className="rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
                    <CardHeader>
                      <CardTitle className="text-[#8b7355]">
                        Company Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-[#8b7355] mb-2">Headquarters</h4>
                          <p className="text-warm-gray">
                            {developer.headquarters}
                          </p>
                        </div>
                        <div>
                          <h4 className="text-[#8b7355] mb-2">Specialty</h4>
                          <Badge className="bg-gold text-[#8b7355]">
                            {developer.specialty}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="text-[#8b7355] mb-2">
                            Completed Projects
                          </h4>
                          <p className="text-warm-gray">
                            {developer.completedProjects}+
                          </p>
                        </div>
                        <div>
                          <h4 className="text-[#8b7355] mb-2">
                            Ongoing Projects
                          </h4>
                          <p className="text-warm-gray">
                            {developer.ongoingProjects}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[#8b7355] mb-4">About</h4>
                        <p className="text-warm-gray leading-relaxed">
                          {developer.about}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Stats */}
                <div>
                  <Card className="rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
                    <CardHeader>
                      <CardTitle className="text-[#8b7355]">
                        Quick Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-gold" />
                        <div>
                          <div className="text-lg text-[#8b7355]">
                            {developer.projects}
                          </div>
                          <div className="text-sm text-warm-gray">
                            Active Projects
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gold" />
                        <div>
                          <div className="text-lg text-[#8b7355]">
                            {new Date().getFullYear() - developer.established}{" "}
                            Years
                          </div>
                          <div className="text-sm text-warm-gray">
                            Experience
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <DollarSign className="w-5 h-5 text-gold" />
                        <div>
                          <div className="text-lg text-[#8b7355]">
                            {developer.totalValue}
                          </div>
                          <div className="text-sm text-warm-gray">
                            Portfolio Value
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-gold" />
                        <div>
                          <div className="text-lg text-[#8b7355]">
                            {developer.employees}
                          </div>
                          <div className="text-sm text-warm-gray">
                            Team Members
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects">
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-[#8b7355] mb-4">Featured Projects</h3>
                  <p className="text-warm-gray text-xl">
                    Discover exclusive opportunities from {developer.name}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {sampleProjects.map((project) => (
                    <Card
                      key={project.id}
                      className="overflow-hidden rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
                    >
                      {/* Project Image */}
                      <div className="relative">
                        <ImageWithFallback
                          src={project.image}
                          alt={project.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge className={getStatusColor(project.status)}>
                            {project.status}
                          </Badge>
                        </div>
                        <div className="absolute top-4 right-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-white/90 hover:bg-white text-[#8b7355]"
                          >
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <CardContent className="p-6">
                        <h4 className="text-[#8b7355] mb-2 group-hover:text-gold transition-colors">
                          {project.name}
                        </h4>

                        <div className="flex items-center gap-2 text-warm-gray text-sm mb-3">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </div>

                        <p className="text-warm-gray text-sm mb-4 leading-relaxed">
                          {project.description}
                        </p>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-warm-gray">Bedrooms:</span>
                            <span className="text-[#8b7355]">
                              {project.bedrooms}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-warm-gray">Area:</span>
                            <span className="text-[#8b7355]">
                              {project.area}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-warm-gray">Completion:</span>
                            <span className="text-[#8b7355]">
                              {project.completion}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-soft-gray/30">
                          <div>
                            <div className="text-xl text-[#8b7355]">
                              {project.price}
                            </div>
                          </div>
                          <Button className="bg-gold hover:bg-[#8b7355] text-[#8b7355] hover:text-white transition-all duration-300">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements">
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-[#8b7355] mb-4">Awards & Recognition</h3>
                  <p className="text-warm-gray text-xl">
                    Excellence in real estate development
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {developer.awards.map((award: string, index: number) => (
                    <Card
                      key={index}
                      className="text-center rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]"
                    >
                      <CardContent className="p-8">
                        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Award className="w-8 h-8 text-gold" />
                        </div>
                        <h4 className="text-[#8b7355] mb-2">{award}</h4>
                        <p className="text-warm-gray">2023</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Testimonials Section */}
                <div className="bg-beige rounded-2xl p-12">
                  <h3 className="text-center text-[#8b7355] mb-8">
                    What Investors Say
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white rounded-xl p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-gold text-gold"
                          />
                        ))}
                      </div>
                      <p className="text-warm-gray mb-4 leading-relaxed">
                        "Exceptional quality and attention to detail. The
                        investment process was seamless and transparent from
                        start to finish."
                      </p>
                      <div className="text-[#8b7355]">Sarah Al-Mahmoud</div>
                      <div className="text-warm-gray text-sm">
                        Property Investor
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6">
                      <div className="flex items-center gap-1 mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-gold text-gold"
                          />
                        ))}
                      </div>
                      <p className="text-warm-gray mb-4 leading-relaxed">
                        "Outstanding service and project delivery. Highly
                        recommend for anyone looking for premium investment
                        opportunities in Dubai."
                      </p>
                      <div className="text-[#8b7355]">Michael Chen</div>
                      <div className="text-warm-gray text-sm">
                        International Investor
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Information */}
                <Card className="rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
                  <CardHeader>
                    <CardTitle className="text-[#8b7355]">
                      Get in Touch
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                        <Phone className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-[#8b7355]">Phone</div>
                        <div className="text-warm-gray">‪+971543218123</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                        <Mail className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-[#8b7355]">Email</div>
                        <div className="text-warm-gray">
                          info@
                          {developer.name.toLowerCase().replace(/\s+/g, "")}.ae
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                        <Globe className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-[#8b7355]">Website</div>
                        <div className="text-warm-gray">
                          www.{developer.name.toLowerCase().replace(/\s+/g, "")}
                          .ae
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-gold" />
                      </div>
                      <div>
                        <div className="text-[#8b7355]">Address</div>
                        <div className="text-warm-gray">
                          {developer.headquarters}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Form */}
                <Card className="rounded-2xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]">
                  <CardHeader>
                    <CardTitle className="text-[#8b7355]">
                      Send a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm mb-2">
                            First Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 rounded-lg border border-soft-gray/30 bg-ivory focus:outline-none focus:border-gold transition-colors"
                            placeholder="Your first name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm mb-2">
                            Last Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 rounded-lg border border-soft-gray/30 bg-ivory focus:outline-none focus:border-gold transition-colors"
                            placeholder="Your last name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Email</label>
                        <input
                          type="email"
                          className="w-full p-3 rounded-lg border border-soft-gray/30 bg-ivory focus:outline-none focus:border-gold transition-colors"
                          placeholder="your.email@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Phone</label>
                        <input
                          type="tel"
                          className="w-full p-3 rounded-lg border border-soft-gray/30 bg-ivory focus:outline-none focus:border-gold transition-colors"
                          placeholder="+971 50 123 4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm mb-2">Message</label>
                        <textarea
                          rows={4}
                          className="w-full p-3 rounded-lg border border-soft-gray/30 bg-ivory focus:outline-none focus:border-gold transition-colors resize-none"
                          placeholder="Tell us about your investment requirements..."
                        />
                      </div>

                      <Button className="w-full bg-gold hover:bg-[#8b7355] text-[#8b7355] hover:text-white py-3 transition-all duration-300">
                        Send Message
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
