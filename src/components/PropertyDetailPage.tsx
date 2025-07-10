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
  Calendar,
  Building2,
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
  Share2,
  Bookmark,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Play,
  Expand,
  Camera,
  FileText,
  DollarSign,
  PieChart,
  BarChart3,
  Percent,
  Clock,
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
  Navigation,
  Ruler,
  Home,
  CreditCard,
  Banknote,
  Target,
  Wallet,
  Award,
  Globe,
  Zap,
  Sparkles,
  VideoIcon as Video,
  Copy,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  PhoneCall,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Info,
  AlertCircle,
  ThumbsUp,
  Filter,
  SortAsc,
  Grid,
  List,
  Search,
  RefreshCcw,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
    payment_plans?: any[];
    unit_blocks?: any[];
    facilities?: any[];
    map_points?: any[];
    architecture?: any[];
    [key: string]: any;
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
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isCallbackDialogOpen, setIsCallbackDialogOpen] = useState(false);
  const [isViewingDialogOpen, setIsViewingDialogOpen] = useState(false);
  const [isInvestmentCalculatorOpen, setIsInvestmentCalculatorOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [calculatorTab, setCalculatorTab] = useState("roi");
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
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

  const [downloadFormData, setDownloadFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [contactFormData, setContactFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
    interest: "buying",
  });

  const [callbackFormData, setCallbackFormData] = useState({
    name: "",
    phone: "",
    preferredTime: "",
  });

  const [viewingFormData, setViewingFormData] = useState({
    name: "",
    email: "",
    phone: "",
    date: "",
    time: "",
  });

  // Investment Calculator Data - Use actual property price from API
  const getPropertyPrice = (): number => {
    // Try to get price from min_price first (most accurate)
    if (project?.min_price && project.min_price > 0) {
      return project.min_price;
    }

    // Try to parse from formatted price string
    if (project?.price) {
      const numericValue = project.price.replace(/[^0-9.]/g, "");
      const parsed = parseFloat(numericValue);
      if (!isNaN(parsed) && parsed > 0) {
        return parsed;
      }
    }

    // Fallback to default
    return 1200000;
  };

  const [investmentData, setInvestmentData] = useState({
    propertyPrice: getPropertyPrice(),
    downPayment: 25,
    mortgageTerm: 25,
    interestRate: 4.5,
    expectedRentalYield: 8.5,
    capitalAppreciation: 6,
    holdingPeriod: 10,
    maintenanceCosts: 2,
    managementFees: 5,
  });

  // Update investment data when project data changes
  useEffect(() => {
    setInvestmentData((prev) => ({
      ...prev,
      propertyPrice: getPropertyPrice(),
    }));
  }, [project?.min_price, project?.price]);

  // Helper function to clean markdown content for display
  const cleanDescription = (description: string): string => {
    if (!description) return "";

    // Remove markdown headers (##### text)
    let cleaned = description.replace(/#{1,6}\s+/g, "");

    // Remove excessive line breaks and normalize spacing
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");

    // Trim whitespace
    cleaned = cleaned.trim();

    return cleaned;
  };

  // Get cleaned description
  const displayDescription = cleanDescription(project?.description || "");

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
      } catch (e) {
        console.warn("Error parsing cover_image_url:", e);
      }
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

    // 5. Add master plan images from API data
    // if (
    //   project?.apiData?.master_plan &&
    //   project.apiData.master_plan.length > 0
    // ) {
    //   project.apiData.master_plan.forEach((image: any, index: number) => {
    //     if (image.url) {
    //       images.push({
    //         id: images.length + 1,
    //         src: image.url,
    //         category: "master_plan",
    //         title: `Master Plan ${index + 1}`,
    //       });
    //     }
    //   });
    // }

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

    // 7. Add unit images from unit_blocks if available
    // if (
    //   project?.apiData?.unit_blocks &&
    //   project.apiData.unit_blocks.length > 0
    // ) {
    //   project.apiData.unit_blocks.forEach((unit: any, unitIndex: number) => {
    //     if (unit.typical_unit_image_url) {
    //       try {
    //         const unitImages = JSON.parse(unit.typical_unit_image_url);
    //         unitImages.forEach((img: any, imgIndex: number) => {
    //           if (img.url) {
    //             images.push({
    //               id: images.length + 1,
    //               src: img.url,
    //               category: "unit",
    //               title: `${unit.name || `Unit ${unitIndex + 1}`} - Image ${
    //                 imgIndex + 1
    //               }`,
    //             });
    //           }
    //         });
    //       } catch (e) {
    //         console.warn("Error parsing unit image URL:", e);
    //       }
    //     }
    //   });
    // }

    // 4. If no images found, use fallback images
    if (images.length === 0) {
      return [
        {
          id: 1,
          src: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          category: "exterior",
          title: "Building Exterior",
        },
        {
          id: 2,
          src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          category: "living",
          title: "Living Room",
        },
        {
          id: 3,
          src: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          category: "bedroom",
          title: "Master Bedroom",
        },
        {
          id: 4,
          src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
          category: "kitchen",
          title: "Modern Kitchen",
        },
      ];
    }

    return images;
  })();

  // Floor Plans
  const floorPlans = [
    {
      id: 1,
      name: "Studio",
      size: "450 sq ft",
      bedrooms: 0,
      bathrooms: 1,
      price: "AED 650,000",
      image:
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      available: 12,
    },
    {
      id: 2,
      name: "1 Bedroom",
      size: "850 sq ft",
      bedrooms: 1,
      bathrooms: 1,
      price: "AED 950,000",
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      available: 18,
    },
    {
      id: 3,
      name: "2 Bedroom",
      size: "1,200 sq ft",
      bedrooms: 2,
      bathrooms: 2,
      price: "AED 1,450,000",
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      available: 24,
    },
    {
      id: 4,
      name: "3 Bedroom",
      size: "1,650 sq ft",
      bedrooms: 3,
      bathrooms: 3,
      price: "AED 2,100,000",
      image:
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      available: 8,
    },
    {
      id: 5,
      name: "Penthouse",
      size: "2,500 sq ft",
      bedrooms: 4,
      bathrooms: 4,
      price: "AED 4,500,000",
      image:
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      available: 2,
    },
  ];

  // Reset selectedFloorPlan if it goes out of bounds
  useEffect(() => {
    if (floorPlans.length > 0 && selectedFloorPlan >= floorPlans.length) {
      setSelectedFloorPlan(0);
    }
  }, [floorPlans, selectedFloorPlan]);

  // Property Amenities
  const amenities = [
    { name: "Swimming Pool", icon: Waves, category: "Recreation" },
    { name: "Fitness Center", icon: Dumbbell, category: "Health" },
    { name: "24/7 Security", icon: Shield, category: "Safety" },
    { name: "Valet Parking", icon: Car, category: "Convenience" },
    { name: "High-Speed WiFi", icon: Wifi, category: "Technology" },
    { name: "Spa & Wellness", icon: Heart, category: "Wellness" },
    { name: "Kids Play Area", icon: Baby, category: "Family" },
    { name: "Rooftop Garden", icon: Trees, category: "Lifestyle" },
    { name: "Community Lounge", icon: Users, category: "Social" },
    { name: "Concierge Service", icon: User, category: "Service" },
    { name: "Business Center", icon: Building, category: "Work" },
    { name: "Private Beach", icon: Waves, category: "Premium" },
  ];

  // Nearby Landmarks
  const nearbyLandmarks = [
    {
      name: "Dubai Mall",
      distance: "5 min drive",
      type: "shopping",
      icon: ShoppingBag,
      description: "World's largest shopping mall",
    },
    {
      name: "Metro Station",
      distance: "3 min walk",
      type: "transport",
      icon: Train,
      description: "Business Bay Metro",
    },
    {
      name: "Dubai Airport",
      distance: "20 min drive",
      type: "transport",
      icon: Plane,
      description: "International Airport",
    },
    {
      name: "DIFC",
      distance: "8 min drive",
      type: "business",
      icon: Building,
      description: "Financial District",
    },
    {
      name: "Beach Access",
      distance: "10 min drive",
      type: "recreation",
      icon: Waves,
      description: "Private beach",
    },
    {
      name: "Schools",
      distance: "5 min drive",
      type: "education",
      icon: GraduationCap,
      description: "Top international schools",
    },
  ];

  // Payment Plans
  const paymentPlans = [
    {
      name: "Easy Plan",
      downPayment: "10%",
      duringConstruction: "60%",
      onCompletion: "30%",
      months: "24 months",
      popular: false,
    },
    {
      name: "Flexible Plan",
      downPayment: "20%",
      duringConstruction: "50%",
      onCompletion: "30%",
      months: "36 months",
      popular: true,
    },
    {
      name: "Cash Plan",
      downPayment: "100%",
      duringConstruction: "0%",
      onCompletion: "0%",
      months: "Immediate",
      popular: false,
      discount: "5% discount",
    },
  ];

  // Investment Calculations
  const calculateMortgagePayment = () => {
    const principal =
      investmentData.propertyPrice * (1 - investmentData.downPayment / 100);
    const monthlyRate = investmentData.interestRate / 100 / 12;
    const numPayments = investmentData.mortgageTerm * 12;

    if (monthlyRate === 0) return principal / numPayments;

    return (
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1)
    );
  };

  const calculateAnnualRentalIncome = () => {
    return (
      investmentData.propertyPrice * (investmentData.expectedRentalYield / 100)
    );
  };

  const calculateNetRentalIncome = () => {
    const grossRental = calculateAnnualRentalIncome();
    const maintenanceCosts =
      investmentData.propertyPrice * (investmentData.maintenanceCosts / 100);
    const managementFees = grossRental * (investmentData.managementFees / 100);
    return grossRental - maintenanceCosts - managementFees;
  };

  const calculateCashOnCash = () => {
    const downPaymentAmount =
      investmentData.propertyPrice * (investmentData.downPayment / 100);
    const netRentalIncome = calculateNetRentalIncome();
    const annualMortgagePayments = calculateMortgagePayment() * 12;
    const cashFlow = netRentalIncome - annualMortgagePayments;
    return (cashFlow / downPaymentAmount) * 100;
  };

  const calculateTotalROI = () => {
    const downPaymentAmount =
      investmentData.propertyPrice * (investmentData.downPayment / 100);
    const futureValue =
      investmentData.propertyPrice *
      Math.pow(
        1 + investmentData.capitalAppreciation / 100,
        investmentData.holdingPeriod
      );
    const totalCashFlow =
      calculateNetRentalIncome() * investmentData.holdingPeriod -
      calculateMortgagePayment() * 12 * investmentData.holdingPeriod;
    const totalReturn =
      futureValue - investmentData.propertyPrice + totalCashFlow;
    return (totalReturn / downPaymentAmount) * 100;
  };

  // Utility Functions
  const generatePropertyMapUrl = () => {
    const [lat, lng] = propertyCoordinates;
    return `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3610.1234567890123!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM${lat.toFixed(
      6
    )}N%20${lng.toFixed(6)}E!5e0!3m2!1sen!2s!4v1703123456789!5m2!1sen!2s`;
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateInvestmentData = (field: string, value: number | number[]) => {
    setInvestmentData((prev) => ({
      ...prev,
      [field]: Array.isArray(value) ? value[0] : value,
    }));
  };

  // Enhanced PDF generation
  const generatePropertyPDF = async () => {
    // PDF generation functionality removed for simplification
    alert(
      "PDF download feature is currently unavailable. Please contact us for property details."
    );
  };

  // Download floor plan image
  const downloadFloorPlanImage = async () => {
    try {
      let imageUrl = "";
      let fileName = "floor-plan.png";

      // Get the image URL and filename based on current selection
      if (
        project.apiData?.unit_blocks &&
        project.apiData.unit_blocks.length > 0
      ) {
        const unit = project.apiData.unit_blocks[selectedFloorPlan];
        if (unit?.typical_unit_image_url) {
          try {
            const imageData = JSON.parse(unit.typical_unit_image_url);
            imageUrl = imageData[0]?.url || "";
            fileName = `${
              unit.name?.replace(/[^a-zA-Z0-9]/g, "-") || "floor-plan"
            }.png`;
          } catch (e) {
            imageUrl = floorPlans[selectedFloorPlan]?.image || "";
            fileName = `${
              floorPlans[selectedFloorPlan]?.name?.replace(
                /[^a-zA-Z0-9]/g,
                "-"
              ) || "floor-plan"
            }.png`;
          }
        }
      } else {
        imageUrl = floorPlans[selectedFloorPlan]?.image || "";
        fileName = `${
          floorPlans[selectedFloorPlan]?.name?.replace(/[^a-zA-Z0-9]/g, "-") ||
          "floor-plan"
        }.png`;
      }

      if (!imageUrl) {
        alert("No image available for download");
        return;
      }

      // Fetch the image
      const response = await fetch(imageUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch image");
      }

      // Convert to blob
      const blob = await response.blob();

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
      console.error("Error downloading image:", error);
      alert("Failed to download image. Please try again.");
    }
  };

  // Form Handlers
  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!downloadFormData.name || !downloadFormData.email) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      console.log("📧 Submitting brochure download form...");

      const downloadData = {
        name: downloadFormData.name,
        email: downloadFormData.email,
        phone: downloadFormData.phone,
        propertyId: project.id,
        propertyName: project.name,
      };

      // Send email notification
      const response = await fetch("/api/email/brochure-download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(downloadData),
      });

      const result = await response.json();

      if (result.success) {
        console.log("✅ Brochure download notification sent successfully");
        setIsDownloadDialogOpen(false);
        generatePropertyPDF();
        setDownloadFormData({ name: "", email: "", phone: "" });
      } else {
        console.error(
          "❌ Failed to send brochure download notification:",
          result
        );
        alert(
          `Failed to process download request: ${
            result.message || "Please try again later"
          }`
        );
      }
    } catch (error) {
      console.error("❌ Error submitting brochure download:", error);
      alert(
        "An error occurred while processing your download request. Please try again later."
      );
    }
  };

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
      console.log("📧 Submitting property inquiry form...");

      const inquiryData = {
        fullName: contactFormData.fullName,
        email: contactFormData.email,
        phone: contactFormData.phone,
        interest: contactFormData.interest,
        message: contactFormData.message,
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
        console.log("✅ Property inquiry email sent successfully");
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
        });
      } else {
        console.error("❌ Failed to send property inquiry:", result);
        alert(
          `Failed to send inquiry: ${
            result.message || "Please try again later"
          }`
        );
      }
    } catch (error) {
      console.error("❌ Error submitting property inquiry:", error);
      alert(
        "An error occurred while sending your inquiry. Please try again later."
      );
    }
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCallbackDialogOpen(false);
    setCallbackFormData({ name: "", phone: "", preferredTime: "" });
  };

  const handleViewingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsViewingDialogOpen(false);
    setViewingFormData({ name: "", email: "", phone: "", date: "", time: "" });
  };

  const handleShare = (platform: string) => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const text = `Check out this amazing property: ${project.name} in ${project.location}`;

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
        navigator.clipboard.writeText(url);
        break;
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
              <div className="flex items-center gap-3 mb-3">
                <Badge className="bg-gold text-charcoal">
                  {project.status}
                </Badge>
                <Badge variant="outline" className="border-gold/30 text-gold">
                  Premium
                </Badge>
                <Badge
                  variant="outline"
                  className="border-green-500/30 text-green-600"
                >
                  Golden Visa Eligible
                </Badge>
              </div>

              <h1 className="text-4xl lg:text-5xl text-[#8b7355] mb-4">
                {project.name}
              </h1>

              <div className="flex items-center text-warm-gray text-lg mb-4">
                <MapPin className="w-5 h-5 mr-2 text-gold" />
                <span>{project.location}, Dubai, UAE</span>
              </div>

              <div className="text-3xl lg:text-4xl text-gold mb-4">
                {project.price}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3">
              <Dialog
                open={isDownloadDialogOpen}
                onOpenChange={setIsDownloadDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-gold hover:bg-gold/90 text-charcoal"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Brochure
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md bg-white">
                  <DialogHeader>
                    <DialogTitle className="text-[#8b7355]">
                      Download Property Brochure
                    </DialogTitle>
                    <DialogDescription className="text-warm-gray">
                      Get detailed information about {project.name}
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleDownloadSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={downloadFormData.name}
                        onChange={(e) =>
                          setDownloadFormData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter your full name"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={downloadFormData.email}
                        onChange={(e) =>
                          setDownloadFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        placeholder="Enter your email"
                        required
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={downloadFormData.phone}
                        onChange={(e) =>
                          setDownloadFormData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        placeholder="Enter your phone number"
                        className="mt-1"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDownloadDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-gold hover:bg-gold/90 text-charcoal"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>

              <Dialog
                open={isInvestmentCalculatorOpen}
                onOpenChange={setIsInvestmentCalculatorOpen}
              >
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355]/10"
                  >
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Smart Investment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-6xl bg-white max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="pb-6 border-b border-beige">
                    <DialogTitle className="text-3xl text-[#8b7355] flex items-center">
                      <TrendingUp className="w-8 h-8 mr-3 text-gold" />
                      Investment Calculator
                    </DialogTitle>
                    <DialogDescription className="text-warm-gray mt-2 text-lg">
                      Comprehensive ROI analysis for {project.name}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="py-8">
                    <Tabs
                      value={calculatorTab}
                      onValueChange={setCalculatorTab}
                      className="w-full"
                    >
                      <div className="relative w-full">
                        <TabsList className="w-full h-auto flex flex-nowrap md:grid md:grid-cols-3 rounded-xl p-2 overflow-x-auto gap-2 md:gap-0 mb-8">
                          <TabsTrigger
                            value="roi"
                            className="flex items-center rounded-lg flex-shrink-0 min-w-[120px] text-sm px-3 py-2"
                          >
                            <PieChart className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">
                              ROI Analysis
                            </span>
                            <span className="sm:hidden">ROI</span>
                          </TabsTrigger>
                          <TabsTrigger
                            value="mortgage"
                            className="flex items-center rounded-lg flex-shrink-0 min-w-[120px] text-sm px-3 py-2"
                          >
                            <CreditCard className="w-4 h-4 mr-2" />
                            Mortgage
                          </TabsTrigger>
                          <TabsTrigger
                            value="rental"
                            className="flex items-center rounded-lg flex-shrink-0 min-w-[120px] text-sm px-3 py-2"
                          >
                            <Banknote className="w-4 h-4 mr-2" />
                            <span className="hidden sm:inline">
                              Rental Yield
                            </span>
                            <span className="sm:hidden">Rental</span>
                          </TabsTrigger>
                        </TabsList>
                      </div>

                      {/* ROI Analysis Tab */}
                      <TabsContent value="roi" className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <Card className="rounded-2xl border-0 shadow-xl">
                            <CardHeader className="p-6">
                              <CardTitle className="text-[#8b7355] text-xl">
                                Investment Parameters
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-8">
                              <div>
                                <Label className="flex items-center justify-between mb-3">
                                  <span>Property Price</span>
                                  <span className="text-gold font-medium">
                                    AED{" "}
                                    {investmentData.propertyPrice.toLocaleString()}
                                  </span>
                                </Label>
                                <Slider
                                  value={[investmentData.propertyPrice]}
                                  onValueChange={(value) =>
                                    updateInvestmentData("propertyPrice", value)
                                  }
                                  max={10000000}
                                  min={500000}
                                  step={50000}
                                  className="w-full"
                                />
                              </div>

                              <div>
                                <Label className="flex items-center justify-between mb-3">
                                  <span>Down Payment</span>
                                  <span className="text-gold font-medium">
                                    {investmentData.downPayment}%
                                  </span>
                                </Label>
                                <Slider
                                  value={[investmentData.downPayment]}
                                  onValueChange={(value) =>
                                    updateInvestmentData("downPayment", value)
                                  }
                                  max={50}
                                  min={10}
                                  step={5}
                                  className="w-full"
                                />
                              </div>

                              <div>
                                <Label className="flex items-center justify-between mb-3">
                                  <span>Expected Rental Yield</span>
                                  <span className="text-gold font-medium">
                                    {investmentData.expectedRentalYield}%
                                  </span>
                                </Label>
                                <Slider
                                  value={[investmentData.expectedRentalYield]}
                                  onValueChange={(value) =>
                                    updateInvestmentData(
                                      "expectedRentalYield",
                                      value
                                    )
                                  }
                                  max={15}
                                  min={4}
                                  step={0.5}
                                  className="w-full"
                                />
                              </div>

                              <div>
                                <Label className="flex items-center justify-between mb-3">
                                  <span>Capital Appreciation</span>
                                  <span className="text-gold font-medium">
                                    {investmentData.capitalAppreciation}%
                                  </span>
                                </Label>
                                <Slider
                                  value={[investmentData.capitalAppreciation]}
                                  onValueChange={(value) =>
                                    updateInvestmentData(
                                      "capitalAppreciation",
                                      value
                                    )
                                  }
                                  max={12}
                                  min={2}
                                  step={0.5}
                                  className="w-full"
                                />
                              </div>

                              <div>
                                <Label className="flex items-center justify-between mb-3">
                                  <span>Holding Period</span>
                                  <span className="text-gold font-medium">
                                    {investmentData.holdingPeriod} years
                                  </span>
                                </Label>
                                <Slider
                                  value={[investmentData.holdingPeriod]}
                                  onValueChange={(value) =>
                                    updateInvestmentData("holdingPeriod", value)
                                  }
                                  max={20}
                                  min={3}
                                  step={1}
                                  className="w-full"
                                />
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="rounded-2xl border-0 shadow-xl">
                            <CardHeader className="p-6">
                              <CardTitle className="text-[#8b7355] text-xl">
                                Investment Returns
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="p-6 pt-0 space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="bg-gold/10 p-6 rounded-2xl">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-warm-gray">
                                      Cash on Cash Return
                                    </span>
                                    <TrendingUp className="w-5 h-5 text-gold" />
                                  </div>
                                  <div className="text-3xl text-[#8b7355] font-bold">
                                    {calculateCashOnCash().toFixed(1)}%
                                  </div>
                                  <div className="text-xs text-warm-gray mt-2">
                                    Annual cash flow return
                                  </div>
                                </div>

                                <div className="bg-gold/10 p-6 rounded-2xl">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-warm-gray">
                                      Total ROI
                                    </span>
                                    <Target className="w-5 h-5 text-gold" />
                                  </div>
                                  <div className="text-3xl text-[#8b7355] font-bold">
                                    {calculateTotalROI().toFixed(1)}%
                                  </div>
                                  <div className="text-xs text-warm-gray mt-2">
                                    Over {investmentData.holdingPeriod} years
                                  </div>
                                </div>

                                <div className="bg-gold/10 p-6 rounded-2xl">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-warm-gray">
                                      Monthly Cash Flow
                                    </span>
                                    <DollarSign className="w-5 h-5 text-gold" />
                                  </div>
                                  <div className="text-2xl text-[#8b7355] font-bold">
                                    AED{" "}
                                    {(
                                      calculateNetRentalIncome() / 12 -
                                      calculateMortgagePayment()
                                    ).toLocaleString(undefined, {
                                      maximumFractionDigits: 0,
                                    })}
                                  </div>
                                  <div className="text-xs text-warm-gray mt-2">
                                    Net monthly income
                                  </div>
                                </div>

                                <div className="bg-gold/10 p-6 rounded-2xl">
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="text-sm text-warm-gray">
                                      Initial Investment
                                    </span>
                                    <Wallet className="w-5 h-5 text-gold" />
                                  </div>
                                  <div className="text-xl text-[#8b7355] font-bold">
                                    AED{" "}
                                    {(
                                      (investmentData.propertyPrice *
                                        investmentData.downPayment) /
                                      100
                                    ).toLocaleString(undefined, {
                                      maximumFractionDigits: 0,
                                    })}
                                  </div>
                                  <div className="text-xs text-warm-gray mt-2">
                                    Down payment required
                                  </div>
                                </div>
                              </div>

                              <div className="pt-6 border-t border-beige">
                                <h4 className="text-[#8b7355] mb-4 font-medium">
                                  Investment Summary
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-warm-gray">
                                      Property Value:
                                    </span>
                                    <span className="text-[#8b7355] font-medium">
                                      AED{" "}
                                      {investmentData.propertyPrice.toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-warm-gray">
                                      Down Payment:
                                    </span>
                                    <span className="text-[#8b7355] font-medium">
                                      AED{" "}
                                      {(
                                        (investmentData.propertyPrice *
                                          investmentData.downPayment) /
                                        100
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-warm-gray">
                                      Loan Amount:
                                    </span>
                                    <span className="text-[#8b7355] font-medium">
                                      AED{" "}
                                      {(
                                        (investmentData.propertyPrice *
                                          (100 - investmentData.downPayment)) /
                                        100
                                      ).toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-warm-gray">
                                      Annual Rental Income:
                                    </span>
                                    <span className="text-[#8b7355] font-medium">
                                      AED{" "}
                                      {calculateAnnualRentalIncome().toLocaleString()}
                                    </span>
                                  </div>
                                  <div className="flex justify-between border-t border-beige pt-3">
                                    <span className="text-warm-gray">
                                      Future Property Value:
                                    </span>
                                    <span className="text-gold font-medium">
                                      AED{" "}
                                      {(
                                        investmentData.propertyPrice *
                                        Math.pow(
                                          1 +
                                            investmentData.capitalAppreciation /
                                              100,
                                          investmentData.holdingPeriod
                                        )
                                      ).toLocaleString(undefined, {
                                        maximumFractionDigits: 0,
                                      })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>

                      {/* Mortgage Tab */}
                      <TabsContent value="mortgage" className="space-y-8">
                        <div className="text-center py-12">
                          <Calculator className="w-16 h-16 text-gold mx-auto mb-4" />
                          <h3 className="text-xl text-[#8b7355] mb-4">
                            Mortgage Calculator
                          </h3>
                          <p className="text-warm-gray">
                            Detailed mortgage calculations and payment
                            breakdown.
                          </p>
                          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            <div className="bg-beige/30 p-6 rounded-xl">
                              <div className="text-2xl text-[#8b7355] font-bold">
                                AED{" "}
                                {calculateMortgagePayment().toLocaleString(
                                  undefined,
                                  { maximumFractionDigits: 0 }
                                )}
                              </div>
                              <div className="text-sm text-warm-gray">
                                Monthly Payment
                              </div>
                            </div>
                            <div className="bg-beige/30 p-6 rounded-xl">
                              <div className="text-2xl text-[#8b7355] font-bold">
                                {investmentData.interestRate}%
                              </div>
                              <div className="text-sm text-warm-gray">
                                Interest Rate
                              </div>
                            </div>
                            <div className="bg-beige/30 p-6 rounded-xl">
                              <div className="text-2xl text-[#8b7355] font-bold">
                                {investmentData.mortgageTerm}
                              </div>
                              <div className="text-sm text-warm-gray">
                                Years
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      {/* Rental Yield Tab */}
                      <TabsContent value="rental" className="space-y-8">
                        <div className="text-center py-12">
                          <Banknote className="w-16 h-16 text-gold mx-auto mb-4" />
                          <h3 className="text-xl text-[#8b7355] mb-4">
                            Rental Yield Analysis
                          </h3>
                          <p className="text-warm-gray">
                            Comprehensive rental income and yield analysis.
                          </p>
                          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                            <div className="bg-beige/30 p-6 rounded-xl">
                              <div className="text-2xl text-[#8b7355] font-bold">
                                {investmentData.expectedRentalYield}%
                              </div>
                              <div className="text-sm text-warm-gray">
                                Gross Yield
                              </div>
                            </div>
                            <div className="bg-beige/30 p-6 rounded-xl">
                              <div className="text-2xl text-[#8b7355] font-bold">
                                AED{" "}
                                {calculateNetRentalIncome().toLocaleString(
                                  undefined,
                                  { maximumFractionDigits: 0 }
                                )}
                              </div>
                              <div className="text-sm text-warm-gray">
                                Net Annual Income
                              </div>
                            </div>
                            <div className="bg-beige/30 p-6 rounded-xl">
                              <div className="text-2xl text-[#8b7355] font-bold">
                                AED{" "}
                                {(
                                  calculateNetRentalIncome() / 12
                                ).toLocaleString(undefined, {
                                  maximumFractionDigits: 0,
                                })}
                              </div>
                              <div className="text-sm text-warm-gray">
                                Monthly Income
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </DialogContent>
              </Dialog>
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
                  <CardHeader>
                    <CardTitle className="text-[#8b7355]">
                      About This Property
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <p className="text-warm-gray leading-relaxed whitespace-pre-line">
                      {displayDescription ||
                        "Experience luxury living at its finest with this exceptional property offering. Located in one of Dubai's most prestigious neighborhoods, this development combines modern architecture with world-class amenities. Each residence is thoughtfully designed with premium finishes, spacious layouts, and stunning city skyline views."}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h4 className="text-[#8b7355] mb-4">Key Features</h4>
                        <ul className="space-y-3">
                          {[
                            "Premium finishes throughout",
                            "Floor-to-ceiling windows",
                            "Modern kitchen appliances",
                            "Smart home technology",
                            "Private balcony/terrace",
                            "Premium bathroom features",
                          ].map((feature) => (
                            <li
                              key={feature}
                              className="flex items-center text-warm-gray"
                            >
                              <CheckCircle2 className="w-5 h-5 mr-3 text-gold flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-[#8b7355] mb-4">
                          Investment Benefits
                        </h4>
                        <ul className="space-y-3">
                          {[
                            "0% Property Tax",
                            "100% Foreign Ownership",
                            "8-12% Rental Yields",
                            "15% Capital Growth",
                            "Golden Visa Eligibility",
                            "Prime Location",
                          ].map((benefit) => (
                            <li
                              key={benefit}
                              className="flex items-center text-warm-gray"
                            >
                              <Star className="w-5 h-5 mr-3 text-gold flex-shrink-0" />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
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
                        // Fallback to original hardcoded plans if no API data
                        <>
                          {/* 60/40 Plan */}
                          <div className="relative p-4 border border-beige rounded-xl hover:border-gold/50 transition-colors">
                            <Badge className="absolute -top-2 left-4 bg-gold text-charcoal text-xs">
                              Popular
                            </Badge>
                            <div className="space-y-3">
                              <h4 className="text-[#8b7355] font-medium">
                                60/40 Plan
                              </h4>
                              <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="p-2 bg-gold/10 rounded-lg">
                                  <div className="text-lg text-gold font-medium">
                                    60%
                                  </div>
                                  <div className="text-xs text-warm-gray">
                                    Construction
                                  </div>
                                </div>
                                <div className="p-2 bg-beige/50 rounded-lg">
                                  <div className="text-lg text-[#8b7355] font-medium">
                                    40%
                                  </div>
                                  <div className="text-xs text-warm-gray">
                                    Handover
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-warm-gray">
                                  Booking Fee
                                </div>
                                <div className="text-sm text-[#8b7355] font-medium">
                                  5%
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 70/30 Plan */}
                          <div className="p-4 border border-beige rounded-xl hover:border-gold/50 transition-colors">
                            <div className="space-y-3">
                              <h4 className="text-[#8b7355] font-medium">
                                70/30 Plan
                              </h4>
                              <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="p-2 bg-gold/10 rounded-lg">
                                  <div className="text-lg text-gold font-medium">
                                    70%
                                  </div>
                                  <div className="text-xs text-warm-gray">
                                    Construction
                                  </div>
                                </div>
                                <div className="p-2 bg-beige/50 rounded-lg">
                                  <div className="text-lg text-[#8b7355] font-medium">
                                    30%
                                  </div>
                                  <div className="text-xs text-warm-gray">
                                    Handover
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-warm-gray">
                                  Booking Fee
                                </div>
                                <div className="text-sm text-[#8b7355] font-medium">
                                  10%
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 80/20 Plan */}
                          <div className="p-4 border border-beige rounded-xl hover:border-gold/50 transition-colors">
                            <div className="space-y-3">
                              <h4 className="text-[#8b7355] font-medium">
                                80/20 Plan
                              </h4>
                              <div className="grid grid-cols-2 gap-2 text-center">
                                <div className="p-2 bg-gold/10 rounded-lg">
                                  <div className="text-lg text-gold font-medium">
                                    80%
                                  </div>
                                  <div className="text-xs text-warm-gray">
                                    Construction
                                  </div>
                                </div>
                                <div className="p-2 bg-beige/50 rounded-lg">
                                  <div className="text-lg text-[#8b7355] font-medium">
                                    20%
                                  </div>
                                  <div className="text-xs text-warm-gray">
                                    Handover
                                  </div>
                                </div>
                              </div>
                              <div className="text-center">
                                <div className="text-xs text-warm-gray">
                                  Booking Fee
                                </div>
                                <div className="text-sm text-[#8b7355] font-medium">
                                  10%
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Payment Plan Info */}
                    <div className="mt-6 p-4 bg-beige/30 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="text-[#8b7355] font-medium mb-1">
                            Flexible Payment Options
                          </h5>
                          <p className="text-sm text-warm-gray">
                            Choose a payment structure that fits your investment
                            strategy
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-gold/30 text-gold hover:bg-gold/10 rounded-xl"
                        >
                          <Calculator className="w-4 h-4 mr-2" />
                          Calculate
                        </Button>
                      </div>
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
                    <div
                      className={`grid grid-cols-1 gap-4 ${
                        project.apiData?.unit_blocks &&
                        project.apiData.unit_blocks.length > 0
                          ? project.apiData.unit_blocks.length === 1
                            ? "sm:grid-cols-1"
                            : project.apiData.unit_blocks.length === 2
                            ? "sm:grid-cols-2"
                            : project.apiData.unit_blocks.length === 3
                            ? "sm:grid-cols-2 lg:grid-cols-3"
                            : project.apiData.unit_blocks.length === 4
                            ? "sm:grid-cols-2 lg:grid-cols-4"
                            : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                          : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                      }`}
                    >
                      {project.apiData?.unit_blocks &&
                      project.apiData.unit_blocks.length > 0
                        ? project.apiData.unit_blocks.map(
                            (unit: any, index: number) => {
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
                                unit.units_price_to_aed ||
                                unit.units_price_to ||
                                0;
                              const priceRange =
                                priceTo > priceFrom
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
                                      {unit.name}
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
                                    </div>
                                    <div className="text-gold font-medium text-xs">
                                      {priceRange}
                                    </div>
                                  </div>
                                </button>
                              );
                            }
                          )
                        : // Fallback to original hardcoded floor plans
                          floorPlans.map((plan, index) => (
                            <button
                              key={plan.id}
                              onClick={() => setSelectedFloorPlan(index)}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${
                                selectedFloorPlan === index
                                  ? "border-gold bg-gold/10 shadow-lg"
                                  : "border-beige hover:border-gold/50"
                              }`}
                            >
                              <div className="space-y-3">
                                <h4 className="text-[#8b7355] font-medium">
                                  {plan.name}
                                </h4>
                                <div className="space-y-2 text-sm text-warm-gray">
                                  <div className="flex items-center">
                                    <Bed className="w-4 h-4 mr-2 text-gold" />
                                    <span>{plan.bedrooms} Bed</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Bath className="w-4 h-4 mr-2 text-gold" />
                                    <span>{plan.bathrooms} Bath</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Square className="w-4 h-4 mr-2 text-gold" />
                                    <span>{plan.size}</span>
                                  </div>
                                </div>
                                <div className="text-gold font-medium">
                                  {plan.price}
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {plan.available} Available
                                </Badge>
                              </div>
                            </button>
                          ))}
                    </div>

                    {/* Selected Floor Plan */}
                    <div className="border-2 border-gold/20 rounded-xl overflow-hidden">
                      <div className="bg-gold/10 p-6 border-b border-gold/20">
                        <div className="flex items-center justify-between">
                          <div>
                            {project.apiData?.unit_blocks &&
                            project.apiData.unit_blocks.length > 0 ? (
                              <>
                                <h3 className="text-[#8b7355] text-xl">
                                  {project.apiData.unit_blocks[
                                    selectedFloorPlan
                                  ]?.name || "Unit Plan"}
                                </h3>
                                <p className="text-warm-gray">
                                  {(() => {
                                    const unit =
                                      project.apiData.unit_blocks[
                                        selectedFloorPlan
                                      ];
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
                                    const priceRange =
                                      priceTo > priceFrom
                                        ? `AED ${priceFrom.toLocaleString()} - ${priceTo.toLocaleString()}`
                                        : `AED ${priceFrom.toLocaleString()}`;

                                    return `${areaSqft} sqft • ${priceRange}`;
                                  })()}
                                </p>
                              </>
                            ) : (
                              <>
                                <h3 className="text-[#8b7355] text-xl">
                                  {floorPlans[selectedFloorPlan]?.name ||
                                    "Floor Plan"}
                                </h3>
                                <p className="text-warm-gray">
                                  {floorPlans[selectedFloorPlan]?.size ||
                                    "Size"}{" "}
                                  •{" "}
                                  {floorPlans[selectedFloorPlan]?.price ||
                                    "Price on Request"}
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
                        <ImageWithFallback
                          src={(() => {
                            if (
                              project.apiData?.unit_blocks &&
                              project.apiData.unit_blocks.length > 0
                            ) {
                              const unit =
                                project.apiData.unit_blocks[selectedFloorPlan];
                              if (unit?.typical_unit_image_url) {
                                try {
                                  const imageData = JSON.parse(
                                    unit.typical_unit_image_url
                                  );
                                  return (
                                    imageData[0]?.url ||
                                    floorPlans[selectedFloorPlan]?.image ||
                                    ""
                                  );
                                } catch (e) {
                                  return (
                                    floorPlans[selectedFloorPlan]?.image || ""
                                  );
                                }
                              }
                            }
                            return floorPlans[selectedFloorPlan]?.image || "";
                          })()}
                          alt={(() => {
                            if (
                              project.apiData?.unit_blocks &&
                              project.apiData.unit_blocks.length > 0
                            ) {
                              return `${
                                project.apiData.unit_blocks[selectedFloorPlan]
                                  ?.name || "Unit"
                              } floor plan`;
                            }
                            return `${
                              floorPlans[selectedFloorPlan]?.name || "Unit"
                            } floor plan`;
                          })()}
                          className="w-full h-full object-cover"
                        />
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
                    <div
                      className={`grid grid-cols-1 gap-6 ${
                        project.apiData?.facilities &&
                        project.apiData.facilities.length > 0
                          ? project.apiData.facilities.length === 1
                            ? "sm:grid-cols-1"
                            : project.apiData.facilities.length === 2
                            ? "sm:grid-cols-2"
                            : "sm:grid-cols-2 lg:grid-cols-3"
                          : "sm:grid-cols-2 lg:grid-cols-3"
                      }`}
                    >
                      {project.apiData?.facilities &&
                      project.apiData.facilities.length > 0
                        ? project.apiData.facilities.map(
                            (facility: any, index: number) => (
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
                            )
                          )
                        : // Fallback to original hardcoded amenities
                          amenities.map((amenity, index) => {
                            const IconComponent = amenity.icon;
                            return (
                              <div
                                key={index}
                                className="flex items-center space-x-4 p-4 rounded-xl bg-beige/30 hover:bg-beige/50 transition-colors"
                              >
                                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                  <IconComponent className="w-6 h-6 text-gold" />
                                </div>
                                <div>
                                  <h4 className="text-[#8b7355] font-medium">
                                    {amenity.name}
                                  </h4>
                                  <p className="text-xs text-warm-gray">
                                    {amenity.category}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                    </div>
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
                      {project.apiData?.map_points &&
                      project.apiData.map_points.length > 0
                        ? project.apiData.map_points.map(
                            (mapPoint: any, index: number) => (
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
                            )
                          )
                        : // Fallback to original hardcoded landmarks
                          nearbyLandmarks.map((landmark, index) => {
                            const IconComponent = landmark.icon;
                            return (
                              <div
                                key={index}
                                className="flex items-center justify-between p-4 bg-beige/30 rounded-xl hover:bg-beige/50 transition-colors"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center">
                                    <IconComponent className="w-5 h-5 text-gold" />
                                  </div>
                                  <div>
                                    <div className="text-[#8b7355] font-medium">
                                      {landmark.name}
                                    </div>
                                    <div className="text-xs text-warm-gray">
                                      {landmark.description}
                                    </div>
                                  </div>
                                </div>
                                <Badge className="bg-gold text-charcoal">
                                  {landmark.distance}
                                </Badge>
                              </div>
                            );
                          })}
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
                      onClick={() =>
                        window.open(
                          `https://maps.google.com/?q=${propertyCoordinates[0]},${propertyCoordinates[1]}`,
                          "_blank"
                        )
                      }
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
                      {floorPlans.length} Types
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="border-t border-beige pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg text-[#8b7355]">
                        {floorPlans.reduce(
                          (sum, plan) => sum + (plan?.available || 0),
                          0
                        )}
                      </div>
                      <div className="text-xs text-warm-gray">
                        Units Available
                      </div>
                    </div>
                    <div>
                      <div className="text-lg text-[#8b7355]">8.5%</div>
                      <div className="text-xs text-warm-gray">Expected ROI</div>
                    </div>
                    <div>
                      <div className="text-lg text-[#8b7355]">10%</div>
                      <div className="text-xs text-warm-gray">Down Payment</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-6 border-t border-beige">
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsCallbackDialogOpen(true)}
                      className="border-[#8b7355]/30 text-[#8b7355] hover:bg-[#8b7355]/10"
                    >
                      <PhoneCall className="w-4 h-4 mr-1" />
                      Call Me
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsViewingDialogOpen(true)}
                      className="border-[#8b7355]/30 text-[#8b7355] hover:bg-[#8b7355]/10"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
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
                      +9715432181237
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
                      info@smartoffplan.ae
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

      {/* Investment Calculator Dialog */}
      <Dialog
        open={isInvestmentCalculatorOpen}
        onOpenChange={setIsInvestmentCalculatorOpen}
      >
        <DialogContent className="sm:max-w-6xl bg-white max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-6 border-b border-beige">
            <DialogTitle className="text-3xl text-[#8b7355] flex items-center">
              <TrendingUp className="w-8 h-8 mr-3 text-gold" />
              Investment Calculator
            </DialogTitle>
            <DialogDescription className="text-warm-gray mt-2 text-lg">
              Comprehensive ROI analysis for {project.name}
            </DialogDescription>
          </DialogHeader>

          <div className="py-8">
            <Tabs
              value={calculatorTab}
              onValueChange={setCalculatorTab}
              className="w-full"
            >
              <div className="relative w-full">
                <TabsList className="w-full h-auto flex flex-nowrap md:grid md:grid-cols-3 bg-beige/50 rounded-xl p-2 overflow-x-auto gap-2 md:gap-0 mb-8">
                  <TabsTrigger
                    value="roi"
                    className="flex items-center rounded-lg flex-shrink-0 min-w-[120px] text-sm px-3 py-2"
                  >
                    <PieChart className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">ROI Analysis</span>
                    <span className="sm:hidden">ROI</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="mortgage"
                    className="flex items-center rounded-lg flex-shrink-0 min-w-[120px] text-sm px-3 py-2"
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Mortgage
                  </TabsTrigger>
                  <TabsTrigger
                    value="rental"
                    className="flex items-center rounded-lg flex-shrink-0 min-w-[120px] text-sm px-3 py-2"
                  >
                    <Banknote className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Rental Yield</span>
                    <span className="sm:hidden">Rental</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* ROI Analysis Tab */}
              <TabsContent value="roi" className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Card className="rounded-2xl border-0 shadow-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="text-[#8b7355] text-xl">
                        Investment Parameters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-8">
                      <div>
                        <Label className="flex items-center justify-between mb-3">
                          <span>Property Price</span>
                          <span className="text-gold font-medium">
                            AED {investmentData.propertyPrice.toLocaleString()}
                          </span>
                        </Label>
                        <Slider
                          value={[investmentData.propertyPrice]}
                          onValueChange={(value) =>
                            updateInvestmentData("propertyPrice", value)
                          }
                          max={10000000}
                          min={500000}
                          step={50000}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="flex items-center justify-between mb-3">
                          <span>Down Payment</span>
                          <span className="text-gold font-medium">
                            {investmentData.downPayment}%
                          </span>
                        </Label>
                        <Slider
                          value={[investmentData.downPayment]}
                          onValueChange={(value) =>
                            updateInvestmentData("downPayment", value)
                          }
                          max={50}
                          min={10}
                          step={5}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="flex items-center justify-between mb-3">
                          <span>Expected Rental Yield</span>
                          <span className="text-gold font-medium">
                            {investmentData.expectedRentalYield}%
                          </span>
                        </Label>
                        <Slider
                          value={[investmentData.expectedRentalYield]}
                          onValueChange={(value) =>
                            updateInvestmentData("expectedRentalYield", value)
                          }
                          max={15}
                          min={4}
                          step={0.5}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="flex items-center justify-between mb-3">
                          <span>Capital Appreciation</span>
                          <span className="text-gold font-medium">
                            {investmentData.capitalAppreciation}%
                          </span>
                        </Label>
                        <Slider
                          value={[investmentData.capitalAppreciation]}
                          onValueChange={(value) =>
                            updateInvestmentData("capitalAppreciation", value)
                          }
                          max={12}
                          min={2}
                          step={0.5}
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label className="flex items-center justify-between mb-3">
                          <span>Holding Period</span>
                          <span className="text-gold font-medium">
                            {investmentData.holdingPeriod} years
                          </span>
                        </Label>
                        <Slider
                          value={[investmentData.holdingPeriod]}
                          onValueChange={(value) =>
                            updateInvestmentData("holdingPeriod", value)
                          }
                          max={20}
                          min={3}
                          step={1}
                          className="w-full"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-2xl border-0 shadow-xl">
                    <CardHeader className="p-6">
                      <CardTitle className="text-[#8b7355] text-xl">
                        Investment Returns
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gold/10 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-warm-gray">
                              Cash on Cash Return
                            </span>
                            <TrendingUp className="w-5 h-5 text-gold" />
                          </div>
                          <div className="text-3xl text-[#8b7355] font-bold">
                            {calculateCashOnCash().toFixed(1)}%
                          </div>
                          <div className="text-xs text-warm-gray mt-2">
                            Annual cash flow return
                          </div>
                        </div>

                        <div className="bg-gold/10 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-warm-gray">
                              Total ROI
                            </span>
                            <Target className="w-5 h-5 text-gold" />
                          </div>
                          <div className="text-3xl text-[#8b7355] font-bold">
                            {calculateTotalROI().toFixed(1)}%
                          </div>
                          <div className="text-xs text-warm-gray mt-2">
                            Over {investmentData.holdingPeriod} years
                          </div>
                        </div>

                        <div className="bg-gold/10 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-warm-gray">
                              Monthly Cash Flow
                            </span>
                            <DollarSign className="w-5 h-5 text-gold" />
                          </div>
                          <div className="text-2xl text-[#8b7355] font-bold">
                            AED{" "}
                            {(
                              calculateNetRentalIncome() / 12 -
                              calculateMortgagePayment()
                            ).toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </div>
                          <div className="text-xs text-warm-gray mt-2">
                            Net monthly income
                          </div>
                        </div>

                        <div className="bg-gold/10 p-6 rounded-2xl">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-warm-gray">
                              Initial Investment
                            </span>
                            <Wallet className="w-5 h-5 text-gold" />
                          </div>
                          <div className="text-xl text-[#8b7355] font-bold">
                            AED{" "}
                            {(
                              (investmentData.propertyPrice *
                                investmentData.downPayment) /
                              100
                            ).toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </div>
                          <div className="text-xs text-warm-gray mt-2">
                            Down payment required
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-beige">
                        <h4 className="text-[#8b7355] mb-4 font-medium">
                          Investment Summary
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-warm-gray">
                              Property Value:
                            </span>
                            <span className="text-[#8b7355] font-medium">
                              AED{" "}
                              {investmentData.propertyPrice.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-warm-gray">
                              Down Payment:
                            </span>
                            <span className="text-[#8b7355] font-medium">
                              AED{" "}
                              {(
                                (investmentData.propertyPrice *
                                  investmentData.downPayment) /
                                100
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-warm-gray">Loan Amount:</span>
                            <span className="text-[#8b7355] font-medium">
                              AED{" "}
                              {(
                                (investmentData.propertyPrice *
                                  (100 - investmentData.downPayment)) /
                                100
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-warm-gray">
                              Annual Rental Income:
                            </span>
                            <span className="text-[#8b7355] font-medium">
                              AED{" "}
                              {calculateAnnualRentalIncome().toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between border-t border-beige pt-3">
                            <span className="text-warm-gray">
                              Future Property Value:
                            </span>
                            <span className="text-gold font-medium">
                              AED{" "}
                              {(
                                investmentData.propertyPrice *
                                Math.pow(
                                  1 + investmentData.capitalAppreciation / 100,
                                  investmentData.holdingPeriod
                                )
                              ).toLocaleString(undefined, {
                                maximumFractionDigits: 0,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Mortgage Tab */}
              <TabsContent value="mortgage" className="space-y-8">
                <div className="text-center py-12">
                  <Calculator className="w-16 h-16 text-gold mx-auto mb-4" />
                  <h3 className="text-xl text-[#8b7355] mb-4">
                    Mortgage Calculator
                  </h3>
                  <p className="text-warm-gray">
                    Detailed mortgage calculations and payment breakdown.
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        AED{" "}
                        {calculateMortgagePayment().toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      <div className="text-sm text-warm-gray">
                        Monthly Payment
                      </div>
                    </div>
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        {investmentData.interestRate}%
                      </div>
                      <div className="text-sm text-warm-gray">
                        Interest Rate
                      </div>
                    </div>
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        {investmentData.mortgageTerm}
                      </div>
                      <div className="text-sm text-warm-gray">Years</div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Rental Yield Tab */}
              <TabsContent value="rental" className="space-y-8">
                <div className="text-center py-12">
                  <Banknote className="w-16 h-16 text-gold mx-auto mb-4" />
                  <h3 className="text-xl text-[#8b7355] mb-4">
                    Rental Yield Analysis
                  </h3>
                  <p className="text-warm-gray">
                    Comprehensive rental income and yield analysis.
                  </p>
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        {investmentData.expectedRentalYield}%
                      </div>
                      <div className="text-sm text-warm-gray">Gross Yield</div>
                    </div>
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        AED{" "}
                        {calculateNetRentalIncome().toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </div>
                      <div className="text-sm text-warm-gray">
                        Net Annual Income
                      </div>
                    </div>
                    <div className="bg-beige/30 p-6 rounded-xl">
                      <div className="text-2xl text-[#8b7355] font-bold">
                        AED{" "}
                        {(calculateNetRentalIncome() / 12).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 0 }
                        )}
                      </div>
                      <div className="text-sm text-warm-gray">
                        Monthly Income
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsImageGalleryOpen(false)}
                className="text-warm-gray hover:text-[#8b7355]"
              >
                <X className="w-6 h-6" />
              </Button>
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
