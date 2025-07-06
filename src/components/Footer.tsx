"use client";

import { useRouter } from "next/navigation";

export function Footer() {
  const router = useRouter();

  const handlePageNavigation = (page: string) => {
    router.push(`/${page}`);
  };

  return (
    <footer className="bg-[#8b7355] text-white">
      <div className="section-padding">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Company Info */}
            <div>
              <h3 className="mb-6 text-white">Smart Off Plan</h3>
              <p className="text-tan text-sm mb-6 leading-relaxed">
                Your trusted partner for Dubai developments. Connecting
                international investors with premium off-plan opportunities.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-[#8b7355] transition-all duration-300 cursor-pointer">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-[#8b7355] transition-all duration-300 cursor-pointer">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-[#8b7355] transition-all duration-300 cursor-pointer">
                  <span className="text-sm">in</span>
                </div>
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-gold hover:text-[#8b7355] transition-all duration-300 cursor-pointer">
                  <span className="text-sm">ig</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="mb-6 text-white">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => router.push("/")}
                    className="text-tan hover:text-gold transition-colors text-sm"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/properties")}
                    className="text-tan hover:text-gold transition-colors text-sm"
                  >
                    Projects
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/services")}
                    className="text-tan hover:text-gold transition-colors text-sm"
                  >
                    Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/about")}
                    className="text-tan hover:text-gold transition-colors text-sm"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/contact")}
                    className="text-tan hover:text-gold transition-colors text-sm"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="mb-6 text-white">Services</h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => router.push("/services/company-formation")}
                    className="text-tan hover:text-gold transition-colors text-sm"
                  >
                    Company Formation
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/services/mortgages")}
                    className="text-tan hover:text-gold transition-colors text-sm"
                  >
                    Mortgages
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => router.push("/services/golden-visa")}
                    className="text-tan hover:text-gold transition-colors text-sm"
                  >
                    Golden Visa
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="mb-6 text-white">Get In Touch</h4>
              <div className="space-y-4">
                <div>
                  {/* <p className="text-tan text-sm">Phone</p> */}
                  <p className="text-tan text-sm">📞 +971 4 123 4567</p>
                </div>
                <div>
                  {/* <p className="text-tan text-sm">Email</p> */}
                  <p className="text-tan text-sm">📧 info@smartoffplan.ae</p>
                </div>
                <div>
                  {/* <p className="text-tan text-sm">Address</p> */}
                  <p className="text-tan text-sm">
                    📍 Business Bay, Dubai, UAE
                  </p>
                </div>
              </div>

              <div>
                <h5 className="text-white mb-3">Working Hours</h5>
                <div className="text-tan text-sm">
                  <div>Mon - Fri: 9:00 AM - 7:00 PM</div>
                  <div>Sat: 10:00 AM - 4:00 PM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10 my-12"></div>

          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-tan text-sm">
              © 2024 Smart Off Plan. All rights reserved. Powered by Blacklion
            </div>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <button
                onClick={() => handlePageNavigation("privacy-policy")}
                className="text-tan hover:text-gold transition-colors text-sm"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => handlePageNavigation("terms-of-service")}
                className="text-tan hover:text-gold transition-colors text-sm"
              >
                Terms of Service
              </button>
              <button
                onClick={() => handlePageNavigation("cookie-policy")}
                className="text-tan hover:text-gold transition-colors text-sm"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
