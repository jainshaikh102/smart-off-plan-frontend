"use client";

import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Show button after a short delay for better UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleWhatsAppClick = () => {
    const phoneNumber = "+923454954954";
    const message =
      "Hello! I'm interested in your off-plan properties. Could you please provide more information?";

    // Use WhatsApp Web URL which works better with Windows WhatsApp app
    // This will open WhatsApp Web first, then offer to open the desktop app
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };

  if (!isVisible) return null;

  return (
    <>
      {/* WhatsApp Floating Button */}
      <div className="whatsapp-button fixed bottom-6 right-6 z-50">
        <button
          onClick={handleWhatsAppClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
          aria-label="Contact us on WhatsApp"
        >
          {/* WhatsApp Icon */}
          <MessageCircle
            size={24}
            className="transition-transform duration-300 group-hover:rotate-12"
          />

          {/* Pulse Animation */}
          <div className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></div>

          {/* Tooltip */}
          {isHovered && (
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap opacity-0 animate-fade-in">
              Chat with us on WhatsApp
              <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          )}
        </button>
      </div>

      {/* Responsive positioning - moves up on mobile/tablet when bottom nav is present */}
      <style jsx>{`
        @media (max-width: 1023px) {
          .whatsapp-button {
            bottom: 6rem !important; /* Move up when bottom navigation is visible */
          }
        }
        @media (min-width: 1024px) {
          .whatsapp-button {
            bottom: 1.5rem !important; /* Normal position on desktop */
          }
        }
      `}</style>
    </>
  );
}
