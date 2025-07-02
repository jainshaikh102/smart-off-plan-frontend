import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import {
  Building2,
  TrendingUp,
  Users,
  Award,
  Search,
  Filter,
  X,
  Loader2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
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
  const [sortBy, setSortBy] = useState("name");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const router = useRouter();

  // API state management
  const [apiDevelopers, setApiDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const filteredDevelopers = useMemo(() => {
    let filtered = apiDevelopers.filter((developer) => {
      const matchesSearch = developer.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return matchesSearch;
    });

    // Sort filtered results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "rating":
        default:
          return a.name.localeCompare(b.name); // Default to name sorting since API doesn't have rating
      }
    });

    // Apply maxItems limit if specified
    if (maxItems) {
      filtered = filtered.slice(0, maxItems);
    }

    return filtered;
  }, [searchTerm, sortBy, maxItems, apiDevelopers]);

  const hasActiveFilters = searchTerm !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setSortBy("name");
    setFiltersOpen(false);
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
                    value="name"
                    className="text-[#8b7355] hover:bg-beige focus:bg-beige cursor-pointer"
                  >
                    Sort by Name
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-warm-gray mb-6">
            <div>
              Showing {filteredDevelopers.length} of {apiDevelopers.length}{" "}
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
        ) : filteredDevelopers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDevelopers.map((developer) => (
              <Card
                key={developer.id}
                onClick={() => handleDeveloperSelect(developer)}
                className="group cursor-pointer p-6 bg-white rounded-3xl shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_12px_40px_-4px_rgba(139,115,85,0.15),0_6px_20px_-4px_rgba(139,115,85,0.1)] transition-all duration-300 border-0 hover:-translate-y-2"
              >
                <div className="space-y-5">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-beige rounded-2xl flex items-center justify-center overflow-hidden flex-shrink-0">
                        <Building2 className="w-8 h-8 text-gold" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-[rgba(30,26,26,1)] mb-1 group-hover:text-gold transition-colors duration-300 leading-tight text-lg font-medium">
                          {developer.name}
                        </h3>
                        <Badge className="bg-gold/15 text-gold border-gold/30 text-xs">
                          Developer Partner
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-[rgba(30,26,26,0.8)] text-sm leading-relaxed">
                    Trusted developer partner offering premium off-plan
                    properties in Dubai.
                  </p>

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
