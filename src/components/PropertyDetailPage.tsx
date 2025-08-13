import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Slider } from "./ui/slider";
import {
  ArrowLeft,
  Download,
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Star,
  Bath,
  Bed,
  Square,
  Car,
  Wifi,
  Shield,
  Heart,
  User,
  ExternalLink,
  Calculator,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Expand,
  Camera,
  DollarSign,
  PieChart,
  Train,
  Plane,
  ShoppingBag,
  Building,
  GraduationCap,
  Dumbbell,
  Waves,
  Trees,
  Users,
  Baby,
  CreditCard,
  Banknote,
  Target,
  Wallet,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  PhoneCall,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import SmartInvestmentComponent from "./SmartInvestmentComponent";

interface Project {
  id: number;
  name: string;
  location: string;
  price: string;
  image: string;
  completion: string;
  description?: string;
  developer: string;
  status: string;
  coordinates?: [number, number];
  apiData?: {
    payment_plans?: unknown[];
    unit_blocks?: unknown[];
    facilities?: unknown[];
    map_points?: unknown[];
    architecture?: unknown[];
    [key: string]: unknown;
  };
}

interface PropertyDetailPageProps {
  project: Project;
  onBack: () => void;
}

export function PropertyDetailPage({
  project,
  onBack,
}: PropertyDetailPageProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedFloorPlan, setSelectedFloorPlan] = useState(0);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state - in real app this would be based on API loading state
  useEffect(() => {
    if (project && project.id) {
      // Simulate API loading time
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [project]);

  const [contactFormData, setContactFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    interest: "buying",
    referralName: "",
  });

  // Investment Calculator Data - Use actual property price from API

  // Update investment data when project data changes

  // Helper function to parse and style markdown content for display
  const parseDescription = (description: string): JSX.Element[] => {
    if (!description) return [];

    // Split by lines and process each line
    const lines = description.split("\n");
    const elements: JSX.Element[] = [];
    let currentParagraph: string[] = [];
    let key = 0;

    const flushParagraph = () => {
      if (currentParagraph.length > 0) {
        const paragraphText = currentParagraph.join(" ").trim();
        if (paragraphText) {
          elements.push(
            <p
              key={`p-${key++}`}
              className="text-warm-gray leading-relaxed mb-4"
            >
              {paragraphText}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Check if line is a heading (starts with #)
      const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/);

      if (headingMatch) {
        // Flush any pending paragraph
        flushParagraph();

        const headingLevel = headingMatch[1].length;
        const headingText = headingMatch[2];

        // Style headings based on level
        let headingClass = "";
        switch (headingLevel) {
          case 1:
            headingClass = "text-2xl text-[#8b7355] font-bold mb-4 mt-6";
            break;
          case 2:
            headingClass = "text-2xl text-[#8b7355] font-semibold mb-3 mt-5";
            break;
          case 3:
            headingClass = "text-2xl text-[#8b7355] font-semibold mb-3 mt-4";
            break;
          case 4:
            headingClass = "text-2xl text-[#8b7355] font-medium mb-2 mt-3";
            break;
          case 5:
            headingClass = "text-2xl text-[#8b7355] font-medium mb-2 mt-3";
            break;
          case 6:
            headingClass = "text-2xl text-[#8b7355] font-normal mb-2 mt-2";
            break;
        }

        elements.push(
          <h3 key={`h-${key++}`} className={headingClass}>
            {headingText}
          </h3>
        );
      } else if (trimmedLine === "") {
        // Empty line - flush paragraph if we have content
        if (currentParagraph.length > 0) {
          flushParagraph();
        }
      } else {
        // Regular text line - add to current paragraph
        currentParagraph.push(trimmedLine);
      }
    });

    // Flush any remaining paragraph
    flushParagraph();

    return elements;
  };

  // Get parsed description elements
  const displayDescriptionElements = parseDescription(
    project?.description || ""
  );

  // Property coordinates
  const propertyCoordinates =
    project?.coordinates ||
    (() => {
      if (!project?.location) return [25.2048, 55.2708];

      switch (project.location) {
        case "Dubai Marina":
          return [25.0772, 55.1384];
        case "Downtown Dubai":
          return [25.1972, 55.2744];
        case "Palm Jumeirah":
          return [25.1124, 55.139];
        case "Business Bay":
          return [25.187, 55.2631];
        case "Dubai Creek Harbour":
          return [25.1838, 55.3167];
        case "DIFC":
          return [25.2131, 55.2796];
        case "JBR":
          return [25.0657, 55.1364];
        default:
          return [25.2048, 55.2708];
      }
    })();

  // Property Images - Use API data with comprehensive fallback strategy
  const propertyImages = (() => {
    const images: any[] = [];

    // 5. Add master plan images from API data
    if (
      project?.apiData?.master_plan &&
      project.apiData.master_plan.length > 0
    ) {
      project.apiData.master_plan.forEach((image: any, index: number) => {
        if (image.url) {
          images.push({
            id: images.length + 1,
            src: image.url,
            category: "master_plan",
            title: `Master Plan ${index + 1}`,
          });
        }
      });
    }

    // 1. Add cover image if available
    if (project?.cover_image_url) {
      try {
        if (typeof project.cover_image_url === "string") {
          if (project.cover_image_url.startsWith("{")) {
            // Handle JSON object format like: {"url": "...", "name": "...", ...}
            const coverImage = JSON.parse(project.cover_image_url);
            if (coverImage.url) {
              images.push({
                id: images.length + 1,
                src: coverImage.url,
                category: "cover",
                title: "Property Cover",
              });
            }
          } else if (project.cover_image_url.startsWith("[")) {
            // Handle JSON array format
            const coverImages = JSON.parse(project.cover_image_url);
            coverImages.forEach((img: any, index: number) => {
              if (img.url) {
                images.push({
                  id: images.length + 1,
                  src: img.url,
                  category: "cover",
                  title: `Property Cover ${index + 1}`,
                });
              }
            });
          } else {
            // Handle plain URL string
            images.push({
              id: images.length + 1,
              src: project.cover_image_url,
              category: "cover",
              title: "Property Cover",
            });
          }
        }
      } catch (e) {}
    }

    // 2. Add architecture images from API data
    if (
      project?.apiData?.architecture &&
      project.apiData.architecture.length > 0
    ) {
      project.apiData.architecture.forEach((image: any, index: number) => {
        if (image.url) {
          images.push({
            id: images.length + 1,
            src: image.url,
            category: "architecture",
            title: `Architecture ${index + 1}`,
          });
        }
      });
    }

    // 3. Add interior images from API data
    if (project?.apiData?.interior && project.apiData.interior.length > 0) {
      project.apiData.interior.forEach((image: any, index: number) => {
        if (image.url) {
          images.push({
            id: images.length + 1,
            src: image.url,
            category: "interior",
            title: `Interior ${index + 1}`,
          });
        }
      });
    }

    // 4. Add lobby images from API data
    if (project?.apiData?.lobby && project.apiData.lobby.length > 0) {
      project.apiData.lobby.forEach((image: any, index: number) => {
        if (image.url) {
          images.push({
            id: images.length + 1,
            src: image.url,
            category: "lobby",
            title: `Lobby ${index + 1}`,
          });
        }
      });
    }

    // 6. Add facility images from API data
    // if (project?.apiData?.facilities && project.apiData.facilities.length > 0) {
    //   project.apiData.facilities.forEach((facility: any, index: number) => {
    //     if (facility.image?.url) {
    //       images.push({
    //         id: images.length + 1,
    //         src: facility.image.url,
    //         category: "amenities",
    //         title: facility.name || `Facility ${index + 1}`,
    //       });
    //     }
    //   });
    // }

    // Return images array (empty if no images found)
    return images;
  })();

  // Get unit blocks from API data for floor plans
  const unitBlocks = project?.apiData?.unit_blocks || [];

  // Get unit availability - try both possible paths
  const unitAvailability =
    project?.apiData?.completePropertyData?.unit_availability ||
    project?.apiData?.unit_availability ||
    [];

  // Calculate total available units from unit_availability array
  const totalAvailableUnits = unitAvailability.reduce(
    (total: number, building: any) => {
      return (
        total +
        (building.units || []).reduce((buildingTotal: number, unit: any) => {
          return buildingTotal + (unit.units_available || 0);
        }, 0)
      );
    },
    0
  );

  // Helper function to get available units for a specific bedroom type
  const getAvailableUnitsForBedroom = (bedroomType: string) => {
    if (!bedroomType || !unitAvailability.length) {
      return 0;
    }

    let availableCount = 0;

    // Loop through all buildings and sum units for the specific bedroom type
    unitAvailability.forEach((building: any) => {
      (building.units || []).forEach((unit: any) => {
        // Try exact match first
        if (unit.bedroom_type === bedroomType) {
          availableCount += unit.units_available || 0;
        }
        // Try case-insensitive match
        else if (
          unit.bedroom_type?.toLowerCase() === bedroomType?.toLowerCase()
        ) {
          availableCount += unit.units_available || 0;
        }
      });
    });
    return availableCount;
  };

  // Reset selectedFloorPlan if it goes out of bounds
  useEffect(() => {
    if (unitBlocks.length > 0 && selectedFloorPlan >= unitBlocks.length) {
      setSelectedFloorPlan(0);
    }
  }, [unitBlocks, selectedFloorPlan]);

  // Get facilities from API data
  const facilities = project?.apiData?.facilities || [];

  // Get map points from API data
  const mapPoints = project?.apiData?.map_points || [];

  // Investment Calculations

  // Utility Functions
  const generatePropertyMapUrl = () => {
    const [lat, lng] = propertyCoordinates;
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1234567890123!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM${lat.toFixed(
      6
    )}N%20${lng.toFixed(6)}E!5e0!3m2!1sen!2s!4v1703123456789!5m2!1sen!2s`;
  };

  // Download floor plan image
  const downloadFloorPlanImage = async () => {
    try {
      let imageUrl = "";
      let fileName = "floor-plan.png";

      // Get the image URL and filename based on current selection
      if (unitBlocks.length > 0) {
        const unit = unitBlocks[selectedFloorPlan];
        if (unit?.typical_unit_image_url) {
          try {
            const imageData = JSON.parse(unit.typical_unit_image_url);
            imageUrl = imageData[0]?.url || "";
            fileName = `${
              unit.name?.replace(/[^a-zA-Z0-9]/g, "-") || "floor-plan"
            }.png`;
          } catch (e) {}
        }
      }

      if (!imageUrl) {
        alert("No floor plan image available for download");
        return;
      }

      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      // Convert to blob
      const blob = await response.blob();

      // Check if window and document are available (client-side)
      if (typeof window === "undefined" || typeof document === "undefined")
        return;

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Failed to download image. Please try again.");
    }
  };

  // Form Handlers

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !contactFormData.fullName ||
      !contactFormData.email ||
      !contactFormData.phone
    ) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const inquiryData = {
        fullName: contactFormData.fullName,
        email: contactFormData.email,
        phone: contactFormData.phone,
        interest: contactFormData.interest,
        message: contactFormData.message,
        referralName: contactFormData.referralName,
        propertyId: project.id,
        propertyName: project.name,
        propertyLocation: project.location,
        propertyPrice: project.price,
      };

      const response = await fetch("/api/email/property-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inquiryData),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          "Thank you for your inquiry! We'll get back to you within 24 hours."
        );

        // Reset form
        setContactFormData({
          fullName: "",
          email: "",
          phone: "",
          message: "",
          interest: "buying",
          referralName: "",
        });
      } else {
        alert(
          `Failed to send inquiry: ${
            result.message || "Please try again later"
          }`
        );
      }
    } catch (error) {
      alert(
        "An error occurred while sending your inquiry. Please try again later."
      );
    }
  };

  const handleShare = (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out this amazing property: ${project.name} in ${project.location}`;

    // Check if window is available (client-side)
    if (typeof window === "undefined") return;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
          "_blank"
        );
        break;
      case "copy":
        if (navigator?.clipboard) {
          navigator.clipboard.writeText(url);
        }
        break;
    }
  };

  // WhatsApp Brochure Request Handler
  const handleRequestBrochure = () => {
    // Prepare the WhatsApp message with property details
    const message = `Hello! I would like to request a brochure for the following property:

🏠 *Property Details:*
• Property ID: ${project.id}
• Property Name: ${project.name}
• Area: ${project.area || project.location || "Not specified"}
• Developer: ${project.developer || "Not specified"}
• Status: ${
      project.development_status || project.sale_status || "Not specified"
    }

Please send me the detailed brochure for this property. Thank you!`;

    // WhatsApp phone number (replace with your actual WhatsApp business number)
    const whatsappNumber = "+971543218123"; // Your WhatsApp business number

    // Create WhatsApp URL with pre-filled message
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;

    // Open WhatsApp
    if (typeof window !== "undefined") {
      window.open(whatsappUrl, "_blank");
    }
  };

  // Loading State Component
  const LoadingState = () => (
    <div className="min-h-screen bg-ivory">
      {/* Header Skeleton */}

      {/* Loading Content */}
      <div className="container py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl text-[#8b7355] mb-2">
              Loading Property Details
            </h2>
            <p className="text-warm-gray">
              Please wait while we fetch the latest information...
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-[#8b7355] mb-4">Property not found</h2>
          <Button onClick={onBack} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Main Content */}
      <div className="container py-8">
        {/* Property Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-4xl lg:text-5xl text-[#8b7355] mb-4">
                {project.name}
              </h1>

              <div className="flex items-center text-warm-gray text-lg mb-4">
                <MapPin className="w-5 h-5 mr-2 text-gold" />
                <span>{project.location}</span>
              </div>

              <div className="text-3xl lg:text-4xl text-gold mb-4">
                {project.price}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold/90 text-charcoal"
                onClick={handleRequestBrochure}
              >
                <Download className="w-5 h-5 mr-2" />
                Request Brochure
              </Button>

              <SmartInvestmentComponent project={project} />
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Gallery */}
          <div className="lg:col-span-2 space-y-8">
            {/* Main Image */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-xl">
                {propertyImages.length > 0 &&
                propertyImages[selectedImageIndex] ? (
                  <ImageWithFallback
                    src={propertyImages[selectedImageIndex].src}
                    alt={`${project.name} - ${propertyImages[selectedImageIndex].title}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-beige/30 flex items-center justify-center">
                    <div className="text-center text-warm-gray">
                      <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No images available</p>
                    </div>
                  </div>
                )}

                {/* Image Overlay Controls */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10">
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <Badge className="bg-black/50 text-white border-0">
                      {selectedImageIndex + 1} / {propertyImages.length}
                    </Badge>
                    {/* <Badge className="bg-black/50 text-white border-0 capitalize">
                      {propertyImages[selectedImageIndex].category}
                    </Badge> */}
                  </div>

                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70 text-white border-0"
                      onClick={() => setIsImageGalleryOpen(true)}
                    >
                      <Expand className="w-4 h-4 mr-1" />
                      Expand
                    </Button>
                  </div>

                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70 text-white border-0"
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev > 0 ? prev - 1 : propertyImages.length - 1
                        )
                      }
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-black/50 hover:bg-black/70 text-white border-0"
                      onClick={() =>
                        setSelectedImageIndex((prev) =>
                          prev < propertyImages.length - 1 ? prev + 1 : 0
                        )
                      }
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {propertyImages.length > 0 && (
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {propertyImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? "border-gold shadow-lg scale-105"
                        : "border-beige hover:border-gold/50 hover:scale-102"
                    }`}
                  >
                    <ImageWithFallback
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Content Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <div className="relative w-full">
                <TabsList className="w-full h-auto flex flex-nowrap md:grid md:grid-cols-4 rounded-xl p-2 overflow-x-auto gap-2 md:gap-0">
                  <TabsTrigger
                    value="overview"
                    className="rounded-lg flex-shrink-0 min-w-[100px] text-sm px-3 py-2 "
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="floor-plans"
                    className="rounded-lg flex-shrink-0 min-w-[100px] text-sm px-3 py-2 "
                  >
                    <span className="hidden sm:inline">Floor Plans</span>
                    <span className="sm:hidden">Plans</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="amenities"
                    className="rounded-lg flex-shrink-0 min-w-[100px] text-sm px-3 py-2 "
                  >
                    Amenities
                  </TabsTrigger>
                  <TabsTrigger
                    value="location"
                    className="rounded-lg flex-shrink-0 min-w-[100px] text-sm px-3 py-2 "
                  >
                    Location
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-8 mt-8">
                {/* Property Description */}
                <Card className="border border-beige shadow-sm">
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      {displayDescriptionElements}
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Plans Section */}
                <Card className="border border-beige shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-[#8b7355] flex items-center">
                      <CreditCard className="w-5 h-5 mr-3 text-gold" />
                      Payment Plans
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`grid grid-cols-1 gap-4 ${
                        project.apiData?.payment_plans &&
                        project.apiData.payment_plans.length > 0
                          ? project.apiData.payment_plans.length === 1
                            ? "md:grid-cols-1"
                            : project.apiData.payment_plans.length === 2
                            ? "md:grid-cols-2"
                            : project.apiData.payment_plans.length === 3
                            ? "md:grid-cols-3"
                            : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                          : "md:grid-cols-3"
                      }`}
                    >
                      {project.apiData?.payment_plans &&
                      project.apiData.payment_plans.length > 0 ? (
                        project.apiData.payment_plans.map(
                          (plan: any, index: number) => {
                            // Extract all payment data and sort by order
                            const payments = plan.Payments || [];
                            const allPayments = payments
                              .map((p: any) => p[0])
                              .filter((p: any) => p)
                              .sort(
                                (a: any, b: any) =>
                                  (a.Order || 0) - (b.Order || 0)
                              );

                            return (
                              <div
                                key={index}
                                className={`${
                                  index === 0 ? "relative " : ""
                                }p-4 border border-beige rounded-xl hover:border-gold/50 transition-colors`}
                              >
                                {index === 0 && (
                                  <Badge className="absolute -top-2 left-4 bg-gold text-charcoal text-xs">
                                    Popular
                                  </Badge>
                                )}
                                <div className="space-y-3">
                                  <h4 className="text-[#8b7355] font-medium">
                                    {plan.Plan_name || `Plan ${index + 1}`}
                                  </h4>

                                  {/* Dynamic payment steps */}
                                  <div className="grid grid-cols-2 gap-2">
                                    {allPayments.map(
                                      (payment: any, paymentIndex: number) => (
                                        <div
                                          key={paymentIndex}
                                          className={`p-2 rounded-lg text-center ${
                                            payment.Payment_time?.toLowerCase().includes(
                                              "construction"
                                            )
                                              ? "bg-gold/10"
                                              : "bg-beige/50"
                                          }`}
                                        >
                                          <div
                                            className={`text-lg font-medium ${
                                              payment.Payment_time?.toLowerCase().includes(
                                                "construction"
                                              )
                                                ? "text-gold"
                                                : "text-[#8b7355]"
                                            }`}
                                          >
                                            {payment.Percent_of_payment}%
                                          </div>
                                          <div className="text-xs text-warm-gray">
                                            {payment.Payment_time}
                                          </div>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          }
                        )
                      ) : (
                        <div className="text-center py-12">
                          <CreditCard className="w-16 h-16 mx-auto mb-4 text-warm-gray opacity-50" />
                          <h3 className="text-[#8b7355] text-lg mb-2">
                            No Payment Plans Available
                          </h3>
                          <p className="text-warm-gray">
                            Payment plan information will be available soon.
                            Please contact us for more details.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Floor Plans Tab */}
              <TabsContent value="floor-plans" className="space-y-8 mt-8">
                <Card className="border border-beige shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-[#8b7355]">
                      Available Floor Plans
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    {/* Floor Plan Selection */}
                    {unitBlocks.length > 0 ? (
                      <div
                        className={`grid grid-cols-1 gap-4 ${
                          unitBlocks.length === 1
                            ? "sm:grid-cols-1"
                            : unitBlocks.length === 2
                            ? "sm:grid-cols-2"
                            : unitBlocks.length === 3
                            ? "sm:grid-cols-2 lg:grid-cols-3"
                            : unitBlocks.length === 4
                            ? "sm:grid-cols-2 lg:grid-cols-4"
                            : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                        }`}
                      >
                        {unitBlocks.map((unit: any, index: number) => {
                          // Parse the image URL from JSON string
                          let imageUrl = "";
                          try {
                            const imageData = JSON.parse(
                              unit.typical_unit_image_url || "[]"
                            );
                            imageUrl = imageData[0]?.url || "";
                          } catch (e) {
                            imageUrl = "";
                          }

                          // Convert area from m2 to sqft for display
                          const areaM2 = parseFloat(
                            unit.units_area_from_m2 || "0"
                          );
                          const areaSqft = Math.round(areaM2 * 10.764);

                          // Format price range
                          const priceFrom =
                            unit.units_price_from_aed ||
                            unit.units_price_from ||
                            0;
                          const priceTo =
                            unit.units_price_to_aed || unit.units_price_to || 0;

                          // Show "Sold Out" if both prices are 0 or null
                          const priceRange =
                            (priceFrom === 0 && priceTo === 0) ||
                            (!priceFrom && !priceTo)
                              ? "Sold Out"
                              : priceTo > priceFrom
                              ? `AED ${priceFrom.toLocaleString()} - ${priceTo.toLocaleString()}`
                              : `AED ${priceFrom.toLocaleString()}`;

                          return (
                            <button
                              key={unit.id}
                              onClick={() => setSelectedFloorPlan(index)}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${
                                selectedFloorPlan === index
                                  ? "border-gold bg-gold/10 shadow-lg"
                                  : "border-beige hover:border-gold/50"
                              }`}
                            >
                              <div className="space-y-3">
                                <h4 className="text-[#8b7355] font-medium text-sm">
                                  {unit.name || unit.unit_bedrooms}
                                </h4>
                                <div className="space-y-2 text-sm text-warm-gray">
                                  <div className="flex items-center">
                                    <Square className="w-4 h-4 mr-2 text-gold" />
                                    <span>{areaSqft} sqft</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Building className="w-4 h-4 mr-2 text-gold" />
                                    <span>{unit.unit_type}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2 text-gold" />
                                    <span>
                                      {getAvailableUnitsForBedroom(
                                        unit.unit_bedrooms || unit.name
                                      )}{" "}
                                      available
                                    </span>
                                  </div>
                                </div>
                                <div className="text-gold font-medium text-xs">
                                  {priceRange}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Building className="w-16 h-16 mx-auto mb-4 text-warm-gray opacity-50" />
                        <h3 className="text-[#8b7355] text-lg mb-2">
                          No Floor Plans Available
                        </h3>
                        <p className="text-warm-gray">
                          Floor plan information will be available soon. Please
                          contact us for more details.
                        </p>
                      </div>
                    )}

                    {/* Selected Floor Plan */}
                    <div className="border-2 border-gold/20 rounded-xl overflow-hidden">
                      <div className="bg-gold/10 p-6 border-b border-gold/20">
                        <div className="flex items-center justify-between">
                          <div>
                            {unitBlocks.length > 0 ? (
                              <>
                                <h3 className="text-[#8b7355] text-xl">
                                  {unitBlocks[selectedFloorPlan]?.name ||
                                    unitBlocks[selectedFloorPlan]
                                      ?.unit_bedrooms ||
                                    "Unit Plan"}
                                </h3>

                                <p className="text-warm-gray">
                                  {(() => {
                                    const unit = unitBlocks[selectedFloorPlan];
                                    if (!unit) return "";

                                    const areaM2 = parseFloat(
                                      unit.units_area_from_m2 || "0"
                                    );
                                    const areaSqft = Math.round(
                                      areaM2 * 10.764
                                    );
                                    const priceFrom =
                                      unit.units_price_from_aed ||
                                      unit.units_price_from ||
                                      0;
                                    const priceTo =
                                      unit.units_price_to_aed ||
                                      unit.units_price_to ||
                                      0;

                                    // Show "Sold Out" if both prices are 0 or null
                                    const priceRange =
                                      (priceFrom === 0 && priceTo === 0) ||
                                      (!priceFrom && !priceTo)
                                        ? "Sold Out"
                                        : priceTo > priceFrom
                                        ? `AED ${priceFrom.toLocaleString()} - ${priceTo.toLocaleString()}`
                                        : `AED ${priceFrom.toLocaleString()}`;

                                    return `${areaSqft} sqft • ${priceRange}`;
                                  })()}
                                </p>
                              </>
                            ) : (
                              <>
                                <h3 className="text-[#8b7355] text-xl">
                                  No Floor Plans Available
                                </h3>
                                <p className="text-warm-gray">
                                  Floor plan information will be available soon
                                </p>
                              </>
                            )}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-gold/30 text-gold hover:bg-gold/10"
                            onClick={downloadFloorPlanImage}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="aspect-[4/3] bg-gray-100">
                        {unitBlocks.length > 0 ? (
                          <ImageWithFallback
                            src={(() => {
                              const unit = unitBlocks[selectedFloorPlan];
                              if (unit?.typical_unit_image_url) {
                                try {
                                  const imageData = JSON.parse(
                                    unit.typical_unit_image_url
                                  );
                                  return imageData[0]?.url || "";
                                } catch (error) {
                                  return "";
                                }
                              }
                              return "";
                            })()}
                            alt={`${
                              unitBlocks[selectedFloorPlan]?.name || "Unit"
                            } floor plan`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100">
                            <div className="text-center text-warm-gray">
                              <Building className="w-16 h-16 mx-auto mb-4 opacity-50" />
                              <p>No floor plan image available</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Amenities Tab */}
              <TabsContent value="amenities" className="space-y-8 mt-8">
                <Card className="border border-beige shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-[#8b7355]">
                      World-Class Amenities
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {facilities.length > 0 ? (
                      <div
                        className={`grid grid-cols-1 gap-6 ${
                          facilities.length === 1
                            ? "sm:grid-cols-1"
                            : facilities.length === 2
                            ? "sm:grid-cols-2"
                            : "sm:grid-cols-2 lg:grid-cols-3"
                        }`}
                      >
                        {facilities.map((facility: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center space-x-4 p-4 rounded-xl bg-beige/30 hover:bg-beige/50 transition-colors"
                          >
                            <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden">
                              <ImageWithFallback
                                src={facility.image?.url || ""}
                                alt={facility.name || "Facility"}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            </div>
                            <div>
                              <h4 className="text-[#8b7355] font-medium">
                                {facility.name}
                              </h4>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 mx-auto mb-4 text-warm-gray opacity-50" />
                        <h3 className="text-[#8b7355] text-lg mb-2">
                          No Amenities Information Available
                        </h3>
                        <p className="text-warm-gray">
                          Amenities information will be available soon. Please
                          contact us for more details.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Location Tab */}
              <TabsContent value="location" className="space-y-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Map */}
                  <Card className="border border-beige shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-[#8b7355] flex items-center justify-between">
                        <span className="flex items-center">
                          <MapPin className="w-5 h-5 mr-2 text-gold" />
                          Property Location
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `https://maps.google.com/?q=${propertyCoordinates[0]},${propertyCoordinates[1]}`,
                              "_blank"
                            )
                          }
                          className="border-gold/30 text-gold hover:bg-gold/10"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Open in Maps
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="aspect-[4/3] rounded-lg overflow-hidden">
                        <iframe
                          src={generatePropertyMapUrl()}
                          width="100%"
                          height="100%"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-full"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Nearby Landmarks */}
                  <Card className="border border-beige shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-[#8b7355]">
                        Nearby Landmarks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {mapPoints.length > 0 ? (
                        mapPoints.map((mapPoint: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 bg-beige/30 rounded-xl hover:bg-beige/50 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div>
                                <div className="text-[#8b7355] font-medium">
                                  {mapPoint.name}
                                </div>
                              </div>
                            </div>
                            <Badge className="bg-gold text-charcoal">
                              {mapPoint.distance_km} km
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-12">
                          <MapPin className="w-16 h-16 mx-auto mb-4 text-warm-gray opacity-50" />
                          <h3 className="text-[#8b7355] text-lg mb-2">
                            No Nearby Landmarks Information Available
                          </h3>
                          <p className="text-warm-gray">
                            Nearby landmarks information will be available soon.
                            Please contact us for more details.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Property Info and Contact */}
          <div className="space-y-6">
            {/* Property Location Map */}
            <Card className="border border-beige shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-[#8b7355] text-lg mb-2">
                  {project.name}
                </CardTitle>
                <div className="flex items-center text-warm-gray text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-gold" />
                  {project.location}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="aspect-[16/9] relative overflow-hidden rounded-lg">
                  <iframe
                    src={generatePropertyMapUrl()}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full"
                  />

                  {/* Location Pin Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-6 h-6 bg-gold rounded-full border-2 border-white shadow-lg pulse-animation"></div>
                  </div>

                  {/* Map Action Button */}
                  <div className="absolute bottom-3 right-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          window.open(
                            `https://maps.google.com/?q=${propertyCoordinates[0]},${propertyCoordinates[1]}`,
                            "_blank"
                          );
                        }
                      }}
                      className="bg-white/90 hover:bg-white text-[#8b7355] border border-beige shadow-sm"
                    >
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property Quick Info */}
            <Card className="border border-beige shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#8b7355]">
                  Property Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Key Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-warm-gray text-sm">Developer</Label>
                    <div className="text-[#8b7355] font-medium">
                      {project.developer}
                    </div>
                  </div>
                  <div>
                    <Label className="text-warm-gray text-sm">Status</Label>
                    <div className="text-[#8b7355] font-medium">
                      {project.status}
                    </div>
                  </div>
                  <div>
                    <Label className="text-warm-gray text-sm">Completion</Label>
                    <div className="text-[#8b7355] font-medium">
                      {project.completion}
                    </div>
                  </div>
                  <div>
                    <Label className="text-warm-gray text-sm">Units</Label>
                    <div className="text-[#8b7355] font-medium">
                      {unitBlocks.length} Types
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="border-t border-beige pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg text-[#8b7355]">
                        {totalAvailableUnits}
                      </div>
                      <div className="text-xs text-warm-gray">
                        Units Available
                      </div>
                    </div>
                    {/* <div>
                      <div className="text-lg text-[#8b7355]">8.5%</div>
                      <div className="text-xs text-warm-gray">Expected ROI</div>
                    </div> */}
                    {/* <div>
                      <div className="text-lg text-[#8b7355]">10%</div>
                      <div className="text-xs text-warm-gray">Down Payment</div>
                    </div> */}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-6 border-t border-beige">
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        (window.location.href = "tel:+971543218123")
                      }
                      className="border-[#8b7355]/30 text-[#8b7355] hover:bg-[#8b7355]/10"
                    >
                      <PhoneCall className="w-4 h-4 mr-1" />
                      Call Me
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card className="border border-beige shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#8b7355]">
                  Get More Information
                </CardTitle>
                <p className="text-warm-gray text-sm">
                  Our experts will get in touch within 24 hours
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={contactFormData.fullName}
                      onChange={(e) =>
                        setContactFormData((prev) => ({
                          ...prev,
                          fullName: e.target.value,
                        }))
                      }
                      placeholder="Enter your name"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={contactFormData.email}
                      onChange={(e) =>
                        setContactFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      placeholder="Enter your email"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Phone *</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={contactFormData.phone}
                      onChange={(e) =>
                        setContactFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="+971 50 123 4567"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="referralName">
                      Referral Name (Optional)
                    </Label>
                    <Input
                      id="referralName"
                      value={contactFormData.referralName}
                      onChange={(e) =>
                        setContactFormData((prev) => ({
                          ...prev,
                          referralName: e.target.value,
                        }))
                      }
                      placeholder="Who referred you to us?"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="interest">I'm interested in</Label>
                    <select
                      id="interest"
                      value={contactFormData.interest}
                      onChange={(e) =>
                        setContactFormData((prev) => ({
                          ...prev,
                          interest: e.target.value,
                        }))
                      }
                      className="w-full mt-1 p-3 border border-beige rounded-lg bg-white text-[#8b7355]"
                    >
                      <option value="buying">Buying</option>
                      <option value="investing">Investing</option>
                      <option value="viewing">Property Viewing</option>
                      <option value="information">More Information</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="contactMessage">Message</Label>
                    <Textarea
                      id="contactMessage"
                      value={contactFormData.message}
                      onChange={(e) =>
                        setContactFormData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="Tell us about your requirements..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#8b7355] hover:bg-[#8b7355]/90 text-white"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Send Inquiry
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border border-beige shadow-sm">
              <CardHeader>
                <CardTitle className="text-[#8b7355] text-lg">
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-[#8b7355] font-medium">
                      ‪+971543218123 / 03301330888
                    </div>
                    <div className="text-xs text-warm-gray">Available 24/7</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-[#8b7355] font-medium">
                      accounts@smartoffplan.com
                    </div>
                    <div className="text-xs text-warm-gray">
                      Response within 2 hours
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <div className="text-[#8b7355] font-medium">
                      Business Bay, Dubai
                    </div>
                    <div className="text-xs text-warm-gray">
                      Visit our office
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Share Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#8b7355]">Share Property</DialogTitle>
            <DialogDescription className="text-warm-gray">
              Share {project.name} with friends and colleagues
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => handleShare("facebook")}
                className="justify-start"
              >
                <Facebook className="w-4 h-4 mr-2" />
                Facebook
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("twitter")}
                className="justify-start"
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("linkedin")}
                className="justify-start"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
              <Button
                variant="outline"
                onClick={() => handleShare("whatsapp")}
                className="justify-start"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Input
                value={
                  typeof window !== "undefined" ? window.location.href : ""
                }
                readOnly
                className="flex-1"
              />
              <Button onClick={() => handleShare("copy")} variant="outline">
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Image Gallery Modal */}
      <Dialog open={isImageGalleryOpen} onOpenChange={setIsImageGalleryOpen}>
        <DialogContent className="sm:max-w-6xl bg-white max-h-[90vh] overflow-hidden">
          <DialogHeader className="pb-4 border-b border-beige">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl text-[#8b7355]">
                Property Gallery
              </DialogTitle>
              {/* <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsImageGalleryOpen(false)}
                className="text-warm-gray hover:text-[#8b7355]"
              >
                <X className="w-6 h-6" />
              </Button> */}
            </div>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {propertyImages.map((image, index) => (
                <div
                  key={image.id}
                  className="aspect-square rounded-lg overflow-hidden group cursor-pointer"
                >
                  <ImageWithFallback
                    src={image.src}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onClick={() => {
                      setSelectedImageIndex(index);
                      setIsImageGalleryOpen(false);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
