"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  // Building2,
  Users,
  Phone,
  Calculator,
  Building,
} from "lucide-react";

interface BottomNavigationProps {
  onNavigate?: (page: string) => void;
}

export function BottomNavigation({ onNavigate }: BottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState("home");

  // Update active tab based on current pathname
  useEffect(() => {
    if (pathname === "/") {
      setActiveTab("home");
    } else if (pathname.startsWith("/properties")) {
      setActiveTab("properties");
    } else if (pathname.startsWith("/developers")) {
      setActiveTab("developers");
    } else if (pathname.startsWith("/mortgages")) {
      setActiveTab("mortgages");
    } else if (pathname.startsWith("/company-formation")) {
      setActiveTab("company-formation");
    } else if (pathname.startsWith("/contact")) {
      setActiveTab("contact");
    }
  }, [pathname]);

  const handleNavigation = (tab: string, route: string) => {
    setActiveTab(tab);

    // Use onNavigate prop if provided (for single-page app navigation)
    if (onNavigate) {
      onNavigate(tab);
    } else {
      // Use Next.js router for multi-page navigation
      router.push(route);
    }
  };

  const navItems = [
    // {
    //   id: "home",
    //   label: "Home",
    //   icon: Home,
    //   route: "/",
    // },
    // {
    //   id: "properties",
    //   label: "Projects",
    //   icon: Building2,
    //   route: "/properties",
    // },
    {
      id: "developers",
      label: "Developers",
      icon: Users,
      route: "/developers",
    },
    {
      id: "mortgages",
      label: "Mortgages",
      icon: Calculator,
      route: "/mortgages",
    },
    {
      id: "company-formation",
      label: "Company",
      icon: Building,
      route: "/company-formation",
    },
    {
      id: "contact",
      label: "Contact",
      icon: Phone,
      route: "/contact",
    },
  ];

  return (
    <>
      {/* Bottom Navigation - Only visible on mobile and tablet (hidden on desktop lg:hidden) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gold/20 shadow-[0_-4px_20px_-2px_rgba(139,115,85,0.08),0_-2px_8px_-2px_rgba(139,115,85,0.04)] lg:hidden">
        <div className="flex items-center justify-around py-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item.id, item.route)}
                className={`flex flex-col items-center justify-center py-2 px-3 min-w-0 flex-1 transition-all duration-300 ${
                  isActive ? "text-gold" : "text-warm-gray hover:text-gold"
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-gold/10 scale-110"
                      : "hover:bg-beige/50 hover:scale-105"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`transition-all duration-300 ${
                      isActive ? "stroke-2" : "stroke-1.5"
                    }`}
                  />
                </div>
                <span
                  className={`text-xs font-medium mt-1 transition-all duration-300 ${
                    isActive ? "text-gold" : "text-warm-gray"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom padding spacer - Only on mobile and tablet to prevent content from being hidden behind bottom nav */}
      <div className="h-20 lg:hidden"></div>
    </>
  );
}
