import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function HeroSection() {
  return (
    <section id="home" className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Dubai skyline with luxury towers"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-6 text-4xl md:text-6xl lg:text-7xl tracking-tight text-[rgba(255,255,255,1)]">
            Find Your Next Investment in Dubai
          </h1>
          <p className="mb-8 text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto">
            Browse top projects from verified developers
          </p>
          
          {/* CTA Buttons */}
          <div className="flex justify-center items-center">
            <Button size="lg" className="bg-emerald-green hover:bg-emerald-green/90 text-white px-8 py-3">
              Explore Listings
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
}