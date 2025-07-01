import { useEffect, useState } from "react";
import Image from "next/image";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isExiting, setIsExiting] = useState(false);

  const handleSkip = () => {
    console.log("🎬 SplashScreen: Skip clicked");
    if (!isExiting) {
      setIsExiting(true);
      setTimeout(() => {
        onComplete();
      }, 500);
    }
  };

  useEffect(() => {
    console.log("🎬 SplashScreen: Starting splash screen animation");

    // Reduced timing for testing - normally 3000ms
    const exitTimer = setTimeout(() => {
      console.log("🎬 SplashScreen: Starting exit animation");
      setIsExiting(true);

      // Complete transition after exit animation (1000ms exit animation)
      setTimeout(() => {
        console.log("🎬 SplashScreen: Calling onComplete");
        onComplete();
      }, 1000);
    }, 2000); // Reduced from 3000ms to 2000ms for testing

    // Cleanup timer on unmount
    return () => {
      console.log("🎬 SplashScreen: Cleaning up timers");
      clearTimeout(exitTimer);
    };
  }, [onComplete]);

  return (
    <div className={`splash-screen ${isExiting ? "splash-screen-exit" : ""}`}>
      {/* Floating ambient particles */}
      <div className="splash-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="splash-particle" />
        ))}
      </div>

      {/* Pulsing ambient lights */}
      <div className="splash-ambient-light" />
      <div className="splash-ambient-light" />
      <div className="splash-ambient-light" />

      {/* Main splash content */}
      <div className="splash-content">
        {/* Logo container with four-stage animation */}
        <div className="splash-logo-container">
          <Image
            src="/Logo.png"
            alt="Smart Off Plan Logo"
            width={280}
            height={100}
            className="splash-logo"
            priority
          />
        </div>

        {/* Brand text with luxury typography */}
        <h1 className="splash-brand-text">Smart Off Plan</h1>

        {/* Tagline */}
        <p className="splash-tagline">
          Your Gateway to Dubai's Premium Properties
        </p>

        {/* Loading experience section */}
        <div className="splash-loading-section">
          {/* Loading experience text */}
          <div className="splash-loading-text">Loading Experience</div>

          {/* Circular pulse animation */}
          <div className="splash-pulse-container">
            <div className="splash-pulse-circle" />
          </div>

          {/* Progress line */}
          <div className="splash-progress-container">
            <div className="splash-progress-bar" />
          </div>

          {/* Skip button for testing */}
          <button
            onClick={handleSkip}
            className="absolute bottom-8 right-8 text-white/50 hover:text-white text-sm transition-colors"
          >
            Skip →
          </button>
        </div>
      </div>
    </div>
  );
}
