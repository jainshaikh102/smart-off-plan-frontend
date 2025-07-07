import { useState, useMemo, useEffect } from "react";
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

interface Developer {
  _id: string;
  externalId: number;
  name: string;
  email: string | null;
  logo: string | null;
  office_address: string | null;
  website: string | null;
  working_hours: string | null;
  description: string | null;
  projects: number;
  image: string | null;
  active: boolean;
  partnership_status: string;
  rating: number | null;
  specialities: string[];
  completeDeveloperData?: any;
  lastFetchedAt: string;
  cacheExpiresAt: string;
  source: string;
  createdAt: string;
  updatedAt: string;
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

  // API state management
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch developers from API
  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("🏢 Fetching developers from API...");

      const response = await fetch("/api/developers");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      if (data.success && Array.isArray(data.data)) {
        console.log(`✅ Fetched ${data.data.length} developers successfully`);
        setDevelopers(data.data);
      } else {
        console.warn("⚠️ No developers data found in response");
        setDevelopers([]);
      }
    } catch (err) {
      console.error("❌ Error fetching developers:", err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch developers"
      );
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch developers on component mount
  useEffect(() => {
    fetchDevelopers();
  }, []);

  // Helper function to map partnership_status to display tier
  const getTierFromPartnershipStatus = (status: string): string => {
    switch (status) {
      case "partner":
        return "Premium";
      case "pending":
        return "Featured";
      case "non-partner":
        return "Partner";
      default:
        return "Partner";
    }
  };

  const allSpecialties = useMemo(() => {
    const specialties = new Set<string>();
    developers.forEach((dev) => {
      if (dev.specialities && Array.isArray(dev.specialities)) {
        dev.specialities.forEach((specialty) => specialties.add(specialty));
      }
    });
    return Array.from(specialties).sort();
  }, [developers]);

  const filteredDevelopers = useMemo(() => {
    let filtered = developers.filter((developer) => {
      const matchesSearch =
        developer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (developer.specialities &&
          Array.isArray(developer.specialities) &&
          developer.specialities.some((specialty: string) =>
            specialty.toLowerCase().includes(searchTerm.toLowerCase())
          ));

      // Map partnership_status to tier for filtering
      const tier = getTierFromPartnershipStatus(developer.partnership_status);
      const matchesTier = selectedTier === "all" || tier === selectedTier;

      const matchesSpecialty =
        selectedSpecialty === "all" ||
        (developer.specialities &&
          developer.specialities.includes(selectedSpecialty));

      const matchesRating =
        minRating === "all" ||
        (developer.rating !== null &&
          developer.rating >= parseFloat(minRating));

      return matchesSearch && matchesTier && matchesSpecialty && matchesRating;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "projects":
          return b.projects - a.projects;
        case "rating":
        default:
          // Handle null ratings by treating them as 0
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
      }
    });

    // Apply maxItems limit if specified
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [
    developers,
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
        return "bg-soft-brown/15 text-soft-brown border-soft-brown/30";
      case "Partner":
        return "bg-beige text-soft-brown border-soft-brown/20";
      default:
        return "bg-beige text-soft-brown border-soft-brown/20";
    }
  };

  // Simple display mode for home page
  if (displayMode === "simple") {
    return (
      <section className="section-padding bg-gradient-to-br from-beige to-ivory bg-[rgba(0,0,0,0)]">
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
            <div className="flex justify-center items-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
              <span className="ml-3 text-soft-brown">
                Loading developers...
              </span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-beige rounded-3xl flex items-center justify-center mx-auto mb-6">
                <X className="w-12 h-12 text-warm-gray" />
              </div>
              <h3 className="text-soft-brown mb-4">
                Failed to load developers
              </h3>
              <p className="text-warm-gray mb-6 max-w-md mx-auto">{error}</p>
              <Button
                onClick={fetchDevelopers}
                className="bg-gold hover:bg-gold/90 text-white rounded-xl px-6 py-3"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto pb-4 flex item justify-center">
                <div className="flex gap-8 w-max px-[82px] py-[0px] mx-[10px] my-[0px]">
                  {filteredDevelopers.map((developer) => (
                    <div
                      key={developer._id}
                      onClick={() => onPartnerSelect?.(developer)}
                      className="group cursor-pointer flex-shrink-0 transition-all duration-300 hover:-translate-y-2 text-center"
                    >
                      <div className="relative mb-3">
                        <div className="w-20 h-20 bg-white/80 backdrop-blur-sm rounded-2xl shadow-[0_2px_12px_-2px_rgba(139,115,85,0.08)] group-hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.15)] group-hover:bg-white transition-all duration-300 overflow-hidden p-3">
                          <ImageWithFallback
                            src={developer.logo || developer.image || ""}
                            alt={`${developer.name} logo`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <h4 className="text-[rgba(30,26,26,1)] text-sm group-hover:text-gold transition-colors duration-300 leading-tight w-24 mx-auto text-[16px]">
                        {developer.name}
                      </h4>
                    </div>
                  ))}
                </div>
              </div>

              {showTitle && (
                <div className="text-center mt-12">
                  <Button
                    onClick={() => onPartnerSelect?.(null)}
                    className="bg-gold hover:bg-gold/90 text-[rgba(255,255,255,1)] px-8 py-3 rounded-xl"
                  >
                    View All Developers
                    <Building2 className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
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
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-warm-gray hover:text-soft-brown transition-colors"
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
                className={`border-soft-brown/30 text-soft-brown hover:bg-soft-brown hover:text-white rounded-xl ${
                  filtersOpen ? "bg-soft-brown text-white" : ""
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {hasActiveFilters && !filtersOpen && (
                  <Badge className="ml-2 bg-gold text-soft-brown text-xs">
                    Active
                  </Badge>
                )}
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] rounded-xl border-soft-brown/30 text-soft-brown bg-white focus:border-gold focus:ring-gold transition-all duration-300 hover:border-soft-brown/50">
                  <SelectValue placeholder="Select sort order" />
                </SelectTrigger>
                <SelectContent className="bg-white border-soft-brown/20 rounded-xl shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)]">
                  <SelectItem
                    value="rating"
                    className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                  >
                    Sort by Rating
                  </SelectItem>
                  <SelectItem
                    value="name"
                    className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                  >
                    Sort by Name
                  </SelectItem>
                  <SelectItem
                    value="projects"
                    className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                  >
                    Sort by Projects
                  </SelectItem>
                  <SelectItem
                    value="active"
                    className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
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
                    className="text-warm-gray hover:text-soft-brown"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Tier Filter */}
                <div>
                  <label className="block text-soft-brown mb-2 text-sm">
                    Partnership Tier
                  </label>
                  <Select value={selectedTier} onValueChange={setSelectedTier}>
                    <SelectTrigger className="w-full rounded-xl border-soft-brown/30 text-soft-brown bg-white focus:border-gold focus:ring-gold transition-all duration-300 hover:border-soft-brown/50">
                      <SelectValue placeholder="All Tiers" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-soft-brown/20 rounded-xl shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)]">
                      <SelectItem
                        value="all"
                        className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        All Tiers
                      </SelectItem>
                      <SelectItem
                        value="Premium"
                        className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        Premium Partners
                      </SelectItem>
                      <SelectItem
                        value="Featured"
                        className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        Featured Partners
                      </SelectItem>
                      <SelectItem
                        value="Partner"
                        className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        Partners
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Specialty Filter */}
                <div>
                  <label className="block text-soft-brown mb-2 text-sm">
                    Specialty
                  </label>
                  <Select
                    value={selectedSpecialty}
                    onValueChange={setSelectedSpecialty}
                  >
                    <SelectTrigger className="w-full rounded-xl border-soft-brown/30 text-soft-brown bg-white focus:border-gold focus:ring-gold transition-all duration-300 hover:border-soft-brown/50">
                      <SelectValue placeholder="All Specialties" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-soft-brown/20 rounded-xl shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)]">
                      <SelectItem
                        value="all"
                        className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        All Specialties
                      </SelectItem>
                      {allSpecialties.map((specialty) => (
                        <SelectItem
                          key={specialty}
                          value={specialty}
                          className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                        >
                          {specialty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-soft-brown mb-2 text-sm">
                    Minimum Rating
                  </label>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger className="w-full rounded-xl border-soft-brown/30 text-soft-brown bg-white focus:border-gold focus:ring-gold transition-all duration-300 hover:border-soft-brown/50">
                      <SelectValue placeholder="Any Rating" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-soft-brown/20 rounded-xl shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)]">
                      <SelectItem
                        value="all"
                        className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        Any Rating
                      </SelectItem>
                      <SelectItem
                        value="4.5"
                        className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        4.5+ Stars
                      </SelectItem>
                      <SelectItem
                        value="4.0"
                        className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
                      >
                        4.0+ Stars
                      </SelectItem>
                      <SelectItem
                        value="3.5"
                        className="text-soft-brown hover:bg-beige focus:bg-beige cursor-pointer"
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
              <div className="text-soft-brown">
                Search results for "{searchTerm}"
              </div>
            )}
          </div>
        </div>

        {/* Developers Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-gold" />
            <span className="ml-3 text-soft-brown">Loading developers...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-beige rounded-3xl flex items-center justify-center mx-auto mb-6">
              <X className="w-12 h-12 text-warm-gray" />
            </div>
            <h3 className="text-soft-brown mb-4">Failed to load developers</h3>
            <p className="text-warm-gray mb-6 max-w-md mx-auto">{error}</p>
            <Button
              onClick={fetchDevelopers}
              className="bg-gold hover:bg-gold/90 text-white rounded-xl px-6 py-3"
            >
              Try Again
            </Button>
          </div>
        ) : filteredDevelopers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDevelopers.map((developer) => {
              const tier = getTierFromPartnershipStatus(
                developer.partnership_status
              );
              return (
                <Card
                  key={developer._id}
                  onClick={() => onPartnerSelect?.(developer)}
                  className="group cursor-pointer p-6 bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_12px_40px_-4px_rgba(139,115,85,0.15),0_6px_20px_-4px_rgba(139,115,85,0.1)] transition-all duration-300 border-0 hover:-translate-y-2"
                >
                  <div className="space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-14 h-14 bg-beige rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                          <ImageWithFallback
                            src={developer.logo || developer.image || ""}
                            alt={`${developer.name} logo`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-[rgba(30,26,26,1)] mb-1 group-hover:text-gold transition-colors duration-300 leading-tight text-lg font-medium">
                            {developer.name}
                          </h3>
                          <Badge className={`${getTierColor(tier)} text-xs`}>
                            {tier} Partner
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Star className="w-4 h-4 text-gold fill-gold" />
                        <span className="text-soft-brown font-medium text-sm">
                          {developer.rating || "N/A"}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {/* <p className="text-[rgba(30,26,26,0.8)] text-sm leading-relaxed">
                      {developer.description || "No description available."}
                    </p> */}

                    <p className="text-[rgba(30,26,26,0.8)] text-sm leading-relaxed line-clamp-4">
                      {developer.description || "No description available."}
                      {developer.description &&
                        (developer.description.split("\n").length > 4 ||
                          developer.description.length > 200) &&
                        "..."}
                    </p>

                    {/* Key Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-beige rounded-xl">
                        <div className="text-lg text-soft-brown mb-1">
                          {developer.projects}
                        </div>
                        <p className="text-warm-gray text-xs">Projects</p>
                      </div>
                      <div className="text-center p-3 bg-beige rounded-xl">
                        <div className="text-lg text-gold mb-1">
                          {developer.active ? "Active" : "Inactive"}
                        </div>
                        <p className="text-warm-gray text-xs">Status</p>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <p className="text-warm-gray text-xs mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-1">
                        {developer.specialities &&
                        developer.specialities.length > 0 ? (
                          <>
                            {developer.specialities
                              .slice(0, 2)
                              .map((specialty, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="border-soft-brown/20 text-warm-gray text-xs"
                                >
                                  {specialty}
                                </Badge>
                              ))}
                            {developer.specialities.length > 2 && (
                              <Badge
                                variant="outline"
                                className="border-soft-brown/20 text-warm-gray text-xs"
                              >
                                +{developer.specialities.length - 2}
                              </Badge>
                            )}
                          </>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-soft-brown/20 text-warm-gray text-xs"
                          >
                            General Development
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      size="sm"
                      className="w-full bg-beige hover:bg-gold text-soft-brown rounded-xl group-hover:bg-soft-brown group-hover:text-white transition-all duration-300"
                    >
                      View Properties
                      <TrendingUp className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          /* No Results State */
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-beige rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-warm-gray" />
            </div>
            <h3 className="text-soft-brown mb-4">No developers found</h3>
            <p className="text-warm-gray mb-6 max-w-md mx-auto">
              We couldn't find any developers matching your search criteria. Try
              adjusting your filters or search terms.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-gold hover:bg-gold/90 text-soft-brown rounded-xl px-6 py-3"
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
                  className="border-soft-brown text-soft-brown hover:bg-soft-brown hover:text-white rounded-xl px-6 py-2"
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
