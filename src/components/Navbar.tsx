import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Menu, X, TrendingUp, ChevronDown } from "lucide-react";
import Image from "next/image";
import TransparentLogoDark from "../../public/Logo/LogoDark.png";

interface NavbarProps {
  onNavigate?: (page: string) => void;
  onLogoClick?: () => void;
  currentPage?: string;
}

export function Navbar({
  onNavigate,
  onLogoClick,
  currentPage = "home",
}: NavbarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    // Check if window is available (client-side)
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (route: string) => {
    // Always use Next.js router for navigation to ensure proper routing
    router.push(route);
    setIsOpen(false); // Close mobile menu after navigation
    setActiveDropdown(null); // Close dropdown after navigation
  };

  const handleDropdownEnter = (dropdownName: string) => {
    setActiveDropdown(dropdownName);
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  const navItems = [
    { name: "Home", route: "/" },
    { name: "Projects", route: "/properties" },
    { name: "Developers", route: "/developers" },
    { name: "Services", route: "/services", hasDropdown: true },
    { name: "About", route: "/about" },
    { name: "Contact", route: "/contact" },
  ];

  const serviceItems = [
    { name: "Company Formation", route: "/services/company-formation" },
    { name: "Mortgages", route: "/services/mortgages" },
    { name: "Golden Visa", route: "/services/golden-visa" },
  ];

  const joinItems = [
    { name: "Join As A Partner", route: "/join-us/join-as-partner" },
    { name: "Become a Franchisee", route: "/join-us/become-franchisee" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)]"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo Only */}
          <button
            onClick={onLogoClick || (() => router.push("/"))}
            className="hover:opacity-80 transition-opacity text-[16px]"
          >
            <Image
              src={TransparentLogoDark}
              alt="Smart Off Plan Logo"
              className="h-14 w-auto"
              priority
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <div key={item.name} className="relative">
                {item.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => handleDropdownEnter(item.name)}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <button className="relative px-4 py-2 text-[#8b7355] hover:text-gold transition-all duration-300 group flex items-center">
                      <span className="relative z-10 text-sm font-medium tracking-wide text-[rgba(30,26,26,1)]">
                        {item.name}
                      </span>
                      <ChevronDown
                        className={`w-3 h-3 ml-1 transition-transform duration-300 ${
                          activeDropdown === item.name
                            ? "rotate-180"
                            : "group-hover:rotate-180"
                        }`}
                      />
                      <div
                        className={`absolute inset-0 bg-beige/50 rounded-lg transition-transform duration-300 origin-center ${
                          activeDropdown === item.name
                            ? "scale-100"
                            : "scale-0 group-hover:scale-100"
                        }`}
                      />
                      <div
                        className={`absolute bottom-0 left-1/2 h-0.5 bg-gold transition-all duration-300 ${
                          activeDropdown === item.name
                            ? "w-6 -translate-x-1/2"
                            : "w-0 group-hover:w-6 group-hover:left-1/2 group-hover:-translate-x-1/2"
                        }`}
                      />
                    </button>

                    {/* Services Dropdown */}
                    <div
                      className={`absolute top-full left-0 pt-1 w-64 z-50 transition-all duration-300 ${
                        activeDropdown === item.name
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible translate-y-2 pointer-events-none"
                      }`}
                    >
                      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] border border-gold/10 overflow-hidden">
                        <div className="p-2">
                          {serviceItems.map((service) => (
                            <button
                              key={service.name}
                              onClick={() => handleNavigation(service.route)}
                              className="w-full text-left px-4 py-3 text-sm text-[#8b7355] hover:text-gold hover:bg-beige/50 rounded-xl transition-all duration-300 flex items-center group/item"
                            >
                              <TrendingUp className="w-4 h-4 mr-3 text-gold group-hover/item:scale-110 transition-transform duration-200" />
                              <span className="group-hover/item:translate-x-1 transition-transform duration-200">
                                {service.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleNavigation(item.route)}
                    className={`relative px-4 py-2 transition-all duration-300 group ${
                      currentPage === item.route.replace("/", "") ||
                      (item.route === "/" && currentPage === "home")
                        ? "text-gold"
                        : "text-[#8b7355] hover:text-gold"
                    }`}
                  >
                    <span className="relative z-10 text-sm font-medium tracking-wide text-[rgba(30,26,26,1)]">
                      {item.name}
                    </span>
                    <div className="absolute inset-0 bg-beige/50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 origin-center" />
                    <div
                      className={`absolute bottom-0 left-1/2 h-0.5 bg-gold transition-all duration-300 ${
                        currentPage === item.route.replace("/", "") ||
                        (item.route === "/" && currentPage === "home")
                          ? "w-6 -translate-x-1/2"
                          : "w-0 group-hover:w-6 group-hover:-translate-x-1/2"
                      }`}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button with Dropdown */}
          <div className="hidden lg:flex items-center space-x-4">
            <div
              className="relative"
              onMouseEnter={() => handleDropdownEnter("join-us")}
              onMouseLeave={handleDropdownLeave}
            >
              <Button
                className={`bg-gold hover:bg-gold/90 text-[#8b7355] px-6 py-2 rounded-xl transition-all duration-300 hover:shadow-[0_4px_16px_-2px_rgba(212,175,55,0.3)] flex items-center cursor-default ${
                  activeDropdown === "join-us"
                    ? "scale-105 shadow-[0_4px_16px_-2px_rgba(212,175,55,0.3)]"
                    : "hover:scale-105"
                }`}
              >
                Join Us
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform duration-300 ${
                    activeDropdown === "join-us" ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {/* Join Us Dropdown */}
              <div
                className={`absolute top-full right-0 pt-1 w-56 z-50 transition-all duration-300 ${
                  activeDropdown === "join-us"
                    ? "opacity-100 visible translate-y-0"
                    : "opacity-0 invisible translate-y-2 pointer-events-none"
                }`}
              >
                <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] border border-gold/10 overflow-hidden">
                  <div className="p-2">
                    {joinItems.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.route)}
                        className="w-full text-left px-4 py-3 text-sm text-[#8b7355] hover:text-gold hover:bg-beige/50 rounded-xl transition-all duration-300 flex items-center group/item"
                      >
                        <TrendingUp className="w-4 h-4 mr-3 text-gold group-hover/item:scale-110 transition-transform duration-200" />
                        <span className="group-hover/item:translate-x-1 transition-transform duration-200">
                          {item.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden w-10 h-10 flex items-center justify-center text-[#8b7355] hover:text-gold transition-colors duration-300"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gold/10 shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] z-40">
            <div className="container py-6">
              <div className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.hasDropdown ? (
                      <div className="space-y-2">
                        <div className="px-4 py-3 text-[#8b7355] text-sm font-medium border-b border-gold/10">
                          {item.name}
                        </div>
                        {serviceItems.map((service) => (
                          <button
                            key={service.name}
                            onClick={() => handleNavigation(service.route)}
                            className="w-full text-left px-8 py-3 text-warm-gray hover:text-gold hover:bg-beige/50 transition-all duration-300 rounded-xl flex items-center group/mobile"
                          >
                            <TrendingUp className="w-4 h-4 mr-3 text-gold group-hover/mobile:scale-110 transition-transform duration-200" />
                            <span className="group-hover/mobile:translate-x-1 transition-transform duration-200">
                              {service.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleNavigation(item.route)}
                        className={`w-full text-left px-4 py-3 transition-all duration-300 rounded-xl ${
                          currentPage === item.route.replace("/", "") ||
                          (item.route === "/" && currentPage === "home")
                            ? "text-gold bg-beige/50"
                            : "text-[#8b7355] hover:text-gold hover:bg-beige/50"
                        }`}
                      >
                        <span className="text-sm font-medium tracking-wide">
                          {item.name}
                        </span>
                      </button>
                    )}
                  </div>
                ))}

                {/* Mobile Join Options */}
                <div className="pt-4 border-t border-gold/10 space-y-2">
                  {/* Main Join Us Button */}
                  <div className="w-full text-left px-4 py-3 text-[#8b7355] cursor-default rounded-xl">
                    <span className="text-sm font-medium tracking-wide">
                      Join Us
                    </span>
                  </div>

                  {/* Sub-options */}
                  <div className="px-4 py-2 text-[#8b7355] text-xs font-medium opacity-70">
                    More Options
                  </div>
                  {joinItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.route)}
                      className="w-full text-left px-8 py-3 text-warm-gray hover:text-gold hover:bg-beige/50 transition-all duration-300 rounded-xl flex items-center group/mobile"
                    >
                      <TrendingUp className="w-4 h-4 mr-3 text-gold group-hover/mobile:scale-110 transition-transform duration-200" />
                      <span className="group-hover/mobile:translate-x-1 transition-transform duration-200">
                        {item.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
