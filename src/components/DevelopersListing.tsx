import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  Star,
  TrendingUp,
  Users,
  Award,
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useRouter } from "next/navigation";

interface Developer {
  id: number;
  name: string;
  website?: string;
}

interface DevelopersListingProps {
  onPartnerSelect?: (developer: any) => void;
  displayMode?: "full" | "simple";
  showTitle?: boolean;
  maxItems?: number;
}

export function DevelopersListing({
  onPartnerSelect,
  displayMode = "full",
  showTitle = true,
  maxItems,
}: DevelopersListingProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTier, setSelectedTier] = useState("all");
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [minRating, setMinRating] = useState("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const router = useRouter();

  // API state management
  const [apiDevelopers, setApiDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const developers = [
    {
      id: 1,
      name: "Emaar Properties",
      logo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop&crop=center",
      tier: "Premium",
      rating: 4.8,
      totalProjects: 50,
      currentProjects: 12,
      completionRate: "98%",
      description:
        "Leading real estate developer in the UAE, renowned for iconic projects including Burj Khalifa and Dubai Mall.",
      specialties: [
        "Luxury Residential",
        "Commercial",
        "Mixed-Use",
        "Hospitality",
      ],
    },
    {
      id: 2,
      name: "DAMAC Properties",
      logo: "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400&h=400&fit=crop&crop=center",
      tier: "Premium",
      rating: 4.7,
      totalProjects: 45,
      currentProjects: 8,
      completionRate: "96%",
      description:
        "Award-winning luxury real estate developer specializing in high-end residential and commercial properties.",
      specialties: [
        "Luxury Residential",
        "Golf Communities",
        "Branded Residences",
      ],
    },
    {
      id: 3,
      name: "Dubai Properties",
      logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=400&fit=crop&crop=center",
      tier: "Featured",
      rating: 4.6,
      totalProjects: 35,
      currentProjects: 6,
      completionRate: "95%",
      description:
        "Government-backed developer creating master-planned communities and mixed-use developments.",
      specialties: ["Master Communities", "Mixed-Use", "Affordable Housing"],
    },
    {
      id: 4,
      name: "Sobha Realty",
      logo: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=400&h=400&fit=crop&crop=center",
      tier: "Premium",
      rating: 4.9,
      totalProjects: 25,
      currentProjects: 5,
      completionRate: "99%",
      description:
        "Premium developer known for exceptional quality and craftsmanship in luxury residential projects.",
      specialties: ["Ultra-Luxury", "Villas", "High-Rise Residential"],
    },
    {
      id: 5,
      name: "Meraas",
      logo: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=400&fit=crop&crop=center",
      tier: "Featured",
      rating: 4.5,
      totalProjects: 30,
      currentProjects: 7,
      completionRate: "94%",
      description:
        "Dubai-based holding company creating distinctive lifestyle destinations and experiences.",
      specialties: [
        "Lifestyle",
        "Entertainment",
        "Beach Communities",
        "Mixed-Use",
      ],
    },
    {
      id: 6,
      name: "Nakheel",
      logo: "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=400&h=400&fit=crop&crop=center",
      tier: "Premium",
      rating: 4.4,
      totalProjects: 40,
      currentProjects: 9,
      completionRate: "93%",
      description:
        "Iconic developer behind Palm Jumeirah and other world-famous master developments.",
      specialties: ["Master Development", "Waterfront", "Iconic Projects"],
    },
    {
      id: 7,
      name: "Aldar Properties",
      logo: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop&crop=center",
      tier: "Partner",
      rating: 4.3,
      totalProjects: 28,
      currentProjects: 4,
      completionRate: "92%",
      description:
        "Abu Dhabi's leading property developer with expanding presence in Dubai market.",
      specialties: ["Residential", "Commercial", "Retail"],
    },
    {
      id: 8,
      name: "Omniyat",
      logo: "https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=400&h=400&fit=crop&crop=center",
      tier: "Featured",
      rating: 4.7,
      totalProjects: 15,
      currentProjects: 3,
      completionRate: "97%",
      description:
        "Boutique developer creating ultra-luxury and architecturally distinctive properties.",
      specialties: [
        "Ultra-Luxury",
        "Architectural Innovation",
        "Limited Edition",
      ],
    },
  ];

  const allSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    developers.forEach((dev) => {
      dev.specialties.forEach((specialty) => specialties.add(specialty));
    });
    return Array.from(specialties).sort();
  }, []);

  const filteredDevelopers = useMemo(() => {
    let filtered = developers.filter((developer) => {
      const matchesSearch =
        developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        developer.specialties.some((specialty) =>
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesTier =
        selectedTier === "all" || developer.tier === selectedTier;
      const matchesSpecialty =
        selectedSpecialty === "all" ||
        developer.specialties.includes(selectedSpecialty);
      const matchesRating =
        minRating === "all" || developer.rating >= parseFloat(minRating);

      return matchesSearch && matchesTier && matchesSpecialty && matchesRating;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "projects":
          return b.totalProjects - a.totalProjects;
        case "active":
          return b.currentProjects - a.currentProjects;
        case "rating":
        default:
          return b.rating - a.rating;
      }
    });

    // Apply maxItems limit if specified
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [
    searchTerm,
    selectedTier,
    selectedSpecialty,
    sortBy,
    minRating,
    maxItems,
  ]);

  const hasActiveFilters =
    selectedTier !== "all" ||
    selectedSpecialty !== "all" ||
    minRating !== "all" ||
    searchTerm !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedTier("all");
    setSelectedSpecialty("all");
    setSortBy("rating");
    setMinRating("all");
    setFiltersOpen(false);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "Premium":
        return "bg-gold/15 text-gold border-gold/30";
      case "Featured":
        return "bg-[#8b7355]/15 text-[#8b7355] border-[#8b7355]/30";
      case "Partner":
        return "bg-beige text-[#8b7355] border-[#8b7355]/20";
      default:
        return "bg-beige text-[#8b7355] border-[#8b7355]/20";
    }
  };

  // Fetch developers from API
  const fetchDevelopers = async () => {
    setLoading(true);
    setError(null);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;

      if (!apiBaseUrl) {
        throw new Error("API base URL not configured");
      }
      if (!apiKey) {
        throw new Error("API key not configured");
      }
      const response = await axios.get(`${apiBaseUrl}/v1/developers`, {
        headers: {
          "X-API-Key": apiKey,
          accept: "application/json",
        },
      });
      const data = response.data;

      if (Array.isArray(data)) {
        setApiDevelopers(data);
      } else {
        setApiDevelopers([]);
      }
    } catch (err) {
      console.error("❌ Error fetching developers:", err);
      if (axios.isAxiosError(err)) {
        setError(
          `Failed to fetch developers: ${err.response?.status || err.message}`
        );
      } else {
        setError(
          err instanceof Error ? err.message : "Failed to fetch developers"
        );
      }
      setApiDevelopers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch developers on component mount
  useEffect(() => {
    fetchDevelopers();
  }, []);

  // Handle developer selection and navigation
  const handleDeveloperSelect = (developer: Developer) => {
    window.location.href = `/developer/${encodeURIComponent(developer.name)}`;
  };

  // Simple display mode for home page
  if (displayMode === "simple") {
    return (
      <section className="section-padding bg-[#F6F2ED]">
        <div className="container">
          {showTitle && (
            <div className="text-center mb-16 bg-[rgba(30,26,26,0)]">
              <h2 className="text-[rgba(30,26,26,1)] mb-6">
                Trusted Developer Partners
              </h2>
              <p className="text-[rgba(30,26,26,1)] text-lg max-w-3xl mx-auto">
                We partner with Dubai's most prestigious developers to bring you
                exclusive off-plan opportunities.
              </p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
              <span className="ml-2 text-[#8b7355]">Loading developers...</span>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 mb-4">{error}</p>
              <Button
                onClick={fetchDevelopers}
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-white"
              >
                Try Again
              </Button>
            </div>
          ) : apiDevelopers.length > 0 ? (
            <div className="overflow-x-auto pb-4 flex justify-center">
              <div className="flex gap-8 w-max px-4 py-[0px] mx-[10px] my-[0px]">
                {(maxItems
                  ? apiDevelopers.slice(0, maxItems)
                  : apiDevelopers
                ).map((developer) => (
                  <div
                    key={developer.id}
                    onClick={() => handleDeveloperSelect(developer)}
                    className="group cursor-pointer flex-shrink-0 transition-all duration-300 hover:-translate-y-2 text-center"
                  >
                    <div className="relative mb-3">
                      <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_2px_12px_-2px_rgba(139,115,85,0.08)] group-hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.15)] group-hover:bg-white transition-all duration-300 overflow-hidden p-3 flex items-center justify-center">
                        <Building2 className="w-8 h-8 text-gold" />
                      </div>
                    </div>
                    <h4 className="text-[rgba(30,26,26,1)] text-sm group-hover:text-gold transition-colors duration-300 leading-tight w-24 mx-auto text-[16px]">
                      {developer.name}
                    </h4>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                No Developers Found
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                No developers are currently available.
              </p>
              <Button
                onClick={fetchDevelopers}
                variant="outline"
                className="border-gold text-gold hover:bg-gold hover:text-white"
              >
                Refresh
              </Button>
            </div>
          )}

          {showTitle && (
            <div className="text-center mt-12">
              <Button
                // onClick={() => onPartnerSelect?.(null)}
                onClick={() => router.push(`/developers`)}
                className="bg-gold hover:bg-gold/90 text-[rgba(255,255,255,1)] px-8 py-3 rounded-xl"
              >
                View All Developers
                <Building2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }

  // Full display mode for dedicated developers page
  return (
    <section className="section-padding">
      <div className="container">
        {/* Search and Filters Header */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray" />
              <Input
                type="text"
                placeholder="Search developers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-xl border-soft-gray/30 focus:border-gold focus:ring-gold bg-white"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray hover:text-[#8b7355] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter Toggle and Sort */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className={`border-[#8b7355]/30 text-[#8b7355] hover:bg-[#8b7355] hover:text-white rounded-xl ${
                  filtersOpen ? "bg-[#8b7355] text-white" : ""
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && !filtersOpen && (
                  <Badge className="ml-2 bg-gold text-[#8b7355] text-xs">
                    Active
                  </Badge>
                )}
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] rounded-xl border-[#8b7355]/30 text-[#8b7355] bg-white focus:border-gold focus:ring-gold transition-all duration-300 hover:border-[#8b7355]/50">
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent className="bg-white border-[#8b7355]/20 rounded-xl shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)]">
                  <SelectItem
                    value="rating"
                    className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                  >
                    Sort by Rating
                  </SelectItem>
                  <SelectItem
                    value="name"
                    className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                  >
                    Sort by Name
                  </SelectItem>
                  <SelectItem
                    value="projects"
                    className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                  >
                    Sort by Projects
                  </SelectItem>
                  <SelectItem
                    value="active"
                    className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                  >
                    Sort by Active Projects
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filter Panel */}
          {filtersOpen && (
            <Card className="p-6 bg-beige rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] border-0 mb-8">
              {hasActiveFilters && (
                <div className="flex justify-end mb-6">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-warm-gray hover:text-[#8b7355]"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tier Filter */}
                <div>
                  <label className="block text-[#8b7355] mb-2 text-sm">
                    Partnership Tier
                  </label>
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger className="w-full rounded-xl border-[#8b7355]/30 text-[#8b7355] bg-white focus:border-gold focus:ring-gold transition-all duration-300 hover:border-[#8b7355]/50">
                      <SelectValue placeholder="All Tiers" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#8b7355]/20 rounded-xl shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)]">
                      <SelectItem
                        value="all"
                        className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        All Tiers
                      </SelectItem>
                      <SelectItem
                        value="Premium"
                        className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        Premium Partners
                      </SelectItem>
                      <SelectItem
                        value="Featured"
                        className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        Featured Partners
                      </SelectItem>
                      <SelectItem
                        value="Partner"
                        className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        Partners
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Specialty Filter */}
                <div>
                  <label className="block text-[#8b7355] mb-2 text-sm">
                    Specialty
                  </label>
                  <Select
                    value={selectedSpecialty}
                    onValueChange={setSelectedSpecialty}
                  >
                    <SelectTrigger className="w-full rounded-xl border-[#8b7355]/30 text-[#8b7355] bg-white focus:border-gold focus:ring-gold transition-all duration-300 hover:border-[#8b7355]/50">
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#8b7355]/20 rounded-xl shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)]">
                      <SelectItem
                        value="all"
                        className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        All Specialties
                      </SelectItem>
                      {allSpecialties.map((specialty) => (
                        <SelectItem
                          key={specialty}
                          value={specialty}
                          className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                        >
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-[#8b7355] mb-2 text-sm">
                    Minimum Rating
                  </label>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger className="w-full rounded-xl border-[#8b7355]/30 text-[#8b7355] bg-white focus:border-gold focus:ring-gold transition-all duration-300 hover:border-[#8b7355]/50">
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-[#8b7355]/20 rounded-xl shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)]">
                      <SelectItem
                        value="all"
                        className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        Any Rating
                      </SelectItem>
                      <SelectItem
                        value="4.5"
                        className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        4.5+ Stars
                      </SelectItem>
                      <SelectItem
                        value="4.0"
                        className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        4.0+ Stars
                      </SelectItem>
                      <SelectItem
                        value="3.5"
                        className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        3.5+ Stars
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-warm-gray mb-6">
            <div>
              Showing {filteredDevelopers.length} of {developers.length}{" "}
              developers
              {hasActiveFilters && (
                <span className="ml-2">
                  <Badge
                    variant="outline"
                    className="border-gold/30 text-gold text-xs"
                  >
                    Filtered
                  </Badge>
                </span>
              )}
            </div>
            {searchTerm && (
              <div className="text-[#8b7355]">
                Search results for "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* Developers Grid */}
        {filteredDevelopers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDevelopers.map((developer) => (
              <Card
                key={developer.id}
                onClick={() => onPartnerSelect?.(developer)}
                className="group cursor-pointer p-6 bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_12px_40px_-4px_rgba(139,115,85,0.15),0_6px_20px_-4px_rgba(139,115,85,0.1)] transition-all duration-300 border-0 hover:-translate-y-2"
              >
                <div className="space-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-beige rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={developer.logo}
                          alt={`${developer.name} logo`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[rgba(30,26,26,1)] mb-1 group-hover:text-gold transition-colors duration-300 leading-tight text-lg font-medium">
                          {developer.name}
                        </h3>
                        <Badge
                          className={`${getTierColor(developer.tier)} text-xs`}
                        >
                          {developer.tier} Partner
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <Star className="w-4 h-4 text-gold fill-gold" />
                      <span className="text-[#8b7355] font-medium text-sm">
                        {developer.rating}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[rgba(30,26,26,0.8)] text-sm leading-relaxed">
                    {developer.description}
                  </p>

                  {/* Key Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-beige rounded-xl">
                      <div className="text-lg text-[#8b7355] mb-1">
                        {developer.totalProjects}
                      </div>
                      <p className="text-warm-gray text-xs">Projects</p>
                    </div>
                    <div className="text-center p-3 bg-beige rounded-xl">
                      <div className="text-lg text-[#8b7355] mb-1">
                        {developer.currentProjects}
                      </div>
                      <p className="text-warm-gray text-xs">Active</p>
                    </div>
                    <div className="text-center p-3 bg-beige rounded-xl">
                      <div className="text-lg text-gold mb-1">
                        {developer.completionRate}
                      </div>
                      <p className="text-warm-gray text-xs">On-Time</p>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <p className="text-warm-gray text-xs mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {developer.specialties
                        .slice(0, 2)
                        .map((specialty, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="border-[#8b7355]/20 text-warm-gray text-xs"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      {developer.specialties.length > 2 && (
                        <Badge
                          variant="outline"
                          className="border-[#8b7355]/20 text-warm-gray text-xs"
                        >
                          +{developer.specialties.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    size="sm"
                    className="w-full bg-beige hover:bg-gold text-[#8b7355] rounded-xl group-hover:bg-[#8b7355] group-hover:text-white transition-all duration-300"
                  >
                    View Properties
                    <TrendingUp className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* No Results State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-beige rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-warm-gray" />
            </div>
            <h3 className="text-[#8b7355] mb-4">No developers found</h3>
            <p className="text-warm-gray mb-6 max-w-md mx-auto">
              We couldn't find any developers matching your search criteria. Try
              adjusting your filters or search terms.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-gold hover:bg-gold/90 text-[#8b7355] rounded-xl px-6 py-3"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Partnership CTA */}
        <div className="mt-16">
          <Card className="p-8 text-center bg-beige rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] border-0">
            <div className="max-w-2xl mx-auto">
              <Award className="w-12 h-12 text-gold mx-auto mb-4" />
              <h3 className="text-[rgba(30,26,26,1)] mb-4">
                Become a Developer Partner
              </h3>
              <p className="text-[rgba(30,26,26,1)] mb-6 leading-relaxed">
                Join our exclusive network of premium developers and showcase
                your projects to international investors worldwide.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button className="bg-gold hover:bg-gold/90 text-[rgba(255,255,255,1)] rounded-xl px-6 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Partner With Us
                </Button>
                <Button
                  variant="outline"
                  className="border-[#8b7355] text-[#8b7355] hover:bg-[#8b7355] hover:text-white rounded-xl px-6 py-2"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
