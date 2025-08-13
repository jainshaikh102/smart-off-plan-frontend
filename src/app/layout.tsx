import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "../styles/globals.css";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { LayoutWrapper } from "@/components/LayoutWrapper";
import { Providers } from "@/components/providers/Providers";
import Script from "next/script";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Smart Off Plan - Premium Dubai Real Estate",
  description:
    "Your trusted partner for Dubai developments. Connecting international investors with premium off-plan opportunities.",
  keywords:
    "Dubai real estate, off-plan properties, luxury developments, property investment, Dubai properties",
  authors: [{ name: "Smart Off Plan" }],
  creator: "Smart Off Plan",
  publisher: "Smart Off Plan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://smartoffplan.ae"),
  openGraph: {
    title: "Smart Off Plan - Premium Dubai Real Estate",
    description:
      "Your trusted partner for Dubai developments. Connecting international investors with premium off-plan opportunities.",
    url: "https://smartoffplan.ae",
    siteName: "Smart Off Plan",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Smart Off Plan - Premium Dubai Real Estate",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Off Plan - Premium Dubai Real Estate",
    description:
      "Your trusted partner for Dubai developments. Connecting international investors with premium off-plan opportunities.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#d4af37" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
      </head>
      <body
        className={`${inter.className} antialiased`}
        suppressHydrationWarning={true}
      >
        <Providers>
          <LayoutWrapper>
            <Script
              src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&language=en`}
              strategy="afterInteractive"
            />
            {children}
          </LayoutWrapper>
          <ToastProvider />
        </Providers>
      </body>
    </html>
  );
}
