"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

const screenshots = [
  {
    src: "/screenshot1.png",
    alt: "Daňové zatížení - tax burden dashboard",
  },
  {
    src: "/screenshot2.png",
    alt: "Kalkulace - price calculation tool",
  },
  {
    src: "/screenshot3.png",
    alt: "Faktury overview - invoice management",
  },
];

export function ScreenshotShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Handle scroll to fade out screenshots
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      
      // Calculate opacity based on scroll position
      // Fade out when scrolling past the section
      if (rect.top < 0) {
        const fadeProgress = Math.abs(rect.top) / (rect.height * 0.5);
        setIsVisible(fadeProgress < 1);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto-rotate screenshots
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screenshots.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % screenshots.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + screenshots.length) % screenshots.length);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const getSlidePosition = (index: number) => {
    const diff = index - currentIndex;
    
    if (diff === 0) return "translate-x-0 scale-100 z-30 opacity-100";
    if (diff === 1 || diff === -(screenshots.length - 1)) {
      return "translate-x-[70%] scale-75 z-20 opacity-60";
    }
    if (diff === -1 || diff === screenshots.length - 1) {
      return "translate-x-[-70%] scale-75 z-20 opacity-60";
    }
    return "translate-x-[200%] scale-50 z-10 opacity-0";
  };

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      style={{
        opacity: isVisible ? 1 : 0,
        transition: "opacity 0.6s ease-out",
      }}
    >
      {/* Background accent */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none"
        style={{
          width: "600px",
          height: "400px",
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,255,136,0.15) 0%, rgba(0,128,68,0.1) 50%, transparent 80%)",
          filter: "blur(60px)",
          opacity: 0.6,
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Сучасний інтерфейс для{" "}
            <span className="text-money">ефективної роботи</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Інтуїтивно зрозумілий дизайн, який допомагає керувати бізнесом
          </p>
        </div>

        {/* Screenshot Carousel */}
        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center">
          {/* Screenshots */}
          <div
            className="relative w-full max-w-5xl h-full"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {screenshots.map((screenshot, index) => (
              <div
                key={index}
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out cursor-grab active:cursor-grabbing ${getSlidePosition(
                  index
                )}`}
                style={{
                  width: "85%",
                  maxWidth: "900px",
                }}
              >
                <div
                  className="relative rounded-2xl overflow-hidden shadow-2xl"
                  style={{
                    boxShadow: `
                      0 25px 50px -12px rgba(0, 0, 0, 0.8),
                      0 0 0 1px rgba(255, 255, 255, 0.1),
                      0 0 40px rgba(0, 255, 136, 0.15)
                    `,
                    background: "linear-gradient(to bottom, #1a1a1a, #000000)",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                  }}
                >
                  {/* Browser chrome mockup */}
                  <div className="bg-gray-900 border-b border-gray-800 px-4 py-3 flex items-center gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <div className="flex-1 flex justify-center">
                      <div className="bg-gray-800 rounded px-4 py-1 text-xs text-gray-500 max-w-xs w-full text-center">
                        faktix.cz
                      </div>
                    </div>
                  </div>

                  {/* Screenshot */}
                  <div className="relative aspect-[16/10] bg-black">
                    <Image
                      src={screenshot.src}
                      alt={screenshot.alt}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 900px"
                      priority={index === 0}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/70 border border-gray-700 hover:border-money/50 rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-40 bg-black/50 hover:bg-black/70 border border-gray-700 hover:border-money/50 rounded-full p-3 transition-all duration-300 backdrop-blur-sm"
            aria-label="Next screenshot"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Dots Navigation */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40 flex gap-3">
            {screenshots.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-8 h-2 bg-money"
                    : "w-2 h-2 bg-gray-600 hover:bg-gray-500"
                }`}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Features Below */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-2">Аналітика в реальному часі</h3>
            <p className="text-gray-400 text-sm">
              Контролюйте всі показники бізнесу одним поглядом
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-3">🧮</div>
            <h3 className="text-lg font-semibold mb-2">Розумні калькуляції</h3>
            <p className="text-gray-400 text-sm">
              AI-асистент допоможе створити точну калькуляцію
            </p>
          </div>
          <div className="p-6">
            <div className="text-3xl mb-3">💼</div>
            <h3 className="text-lg font-semibold mb-2">Управління фактурами</h3>
            <p className="text-gray-400 text-sm">
              Створюйте, відправляйте та відстежуйте фактури легко
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

