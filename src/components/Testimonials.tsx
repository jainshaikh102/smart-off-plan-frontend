import { useState, useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    country: "United Kingdom",
    quote:
      "Smart Off Plan made my Dubai property investment seamless. Their expertise and personalized service exceeded my expectations.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b9a82fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    property: "Marina Heights Tower",
    date: "December 2023",
  },
  {
    id: 2,
    name: "Ahmed Al-Rashid",
    country: "Saudi Arabia",
    quote:
      "Outstanding market insights and professional guidance. I've successfully invested in three properties through their recommendations.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    property: "Downtown Residences",
    date: "November 2023",
  },
  {
    id: 3,
    name: "Maria Rodriguez",
    country: "Spain",
    quote:
      "The team's knowledge of Dubai's property market is exceptional. They helped me find the perfect investment opportunity.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    property: "Palm Jumeirah Villa",
    date: "October 2023",
  },
  {
    id: 4,
    name: "James Chen",
    country: "Singapore",
    quote:
      "Professional, reliable, and results-driven. Smart Off Plan delivered exactly what they promised for my Dubai investment.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    property: "Business Bay Tower",
    date: "September 2023",
  },
  {
    id: 5,
    name: "Elena Petrov",
    country: "Russia",
    quote:
      "Excellent service from start to finish. Their market analysis helped me make an informed investment decision.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    property: "Dubai Hills Estate",
    date: "August 2023",
  },
  {
    id: 6,
    name: "David Thompson",
    country: "Australia",
    quote:
      "Smart Off Plan's expertise in off-plan properties is unmatched. Highly recommend their services to international investors.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=200",
    property: "Emirates Living",
    date: "July 2023",
  },
];

export function Testimonials() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance slides
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide(
        (prev) => (prev + 1) % Math.ceil(testimonials.length / 3)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 3));
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.ceil(testimonials.length / 3)) %
        Math.ceil(testimonials.length / 3)
    );
    setIsAutoPlaying(false);
  };

  const visibleTestimonials = () => {
    const startIndex = currentSlide * 3;
    return testimonials.slice(startIndex, startIndex + 3);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="mb-4 text-[rgba(30,26,26,1)]">
            Client Success Stories
          </h2>
          <p className="text-[rgba(30,26,26,1)] max-w-2xl mx-auto leading-relaxed">
            Hear from our satisfied clients who have successfully invested in
            Dubai's property market
          </p>
        </div>

        {/* Testimonials Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-beige border-0 p-0"
          >
            <ChevronLeft className="w-5 h-5 text-[#8b7355]" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg hover:bg-beige border-0 p-0 text-[rgba(30,26,26,1)]"
          >
            <ChevronRight className="w-5 h-5 text-[#8b7355]" />
          </Button>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-12">
            {visibleTestimonials().map((testimonial, index) => (
              <Card
                key={testimonial.id}
                className="shadow-[0_4px_20px_-2px_rgba(139,115,85,0.08),0_2px_8px_-2px_rgba(139,115,85,0.04)] hover:shadow-[0_8px_32px_-4px_rgba(139,115,85,0.12),0_4px_16px_-4px_rgba(139,115,85,0.08)] transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0 bg-white"
              >
                <CardContent className="p-6">
                  {/* Header with image and info */}
                  <div className="flex items-center mb-4">
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div className="flex-1">
                      <h4 className="text-[rgba(30,26,26,1)] text-sm mb-1">
                        {testimonial.name}
                      </h4>
                      <p className="text-warm-gray text-xs">
                        {testimonial.country}
                      </p>
                    </div>

                    {/* Rating */}
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <p className="text-[rgba(30,26,26,0.7)] text-sm leading-relaxed mb-4 italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Property Info */}
                  <div className="pt-3 border-t border-border/30">
                    <p className="text-[rgba(30,26,26,1)] text-xs">
                      {testimonial.property}
                    </p>
                    <p className="text-warm-gray text-xs">{testimonial.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.ceil(testimonials.length / 3) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentSlide(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? "bg-gold w-6" : "bg-soft-gray"
                  }`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
