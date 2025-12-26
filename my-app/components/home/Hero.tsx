"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import FluidCanvas from "./FluidCanvas";
import { Button } from "@/components/ui/neon-button";

export default function Hero() {
  const sentences = [
    "Michigan's Premier Professional Business Fraternity",
    "Shaping future ethical, skilled, and experienced business leaders",
    "Creating lifelong friendships and connections",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sentences.length);
        setIsVisible(true);
      }, 250); // Half of transition duration for smooth fade
    }, 4000); // Change sentence every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative">
      {/* FluidCanvas background */}
      <div className="relative h-[520px] md:h-screen w-full overflow-hidden">
        <FluidCanvas />
      </div>

      {/* Centered content - Logo and Button */}
      <div className="absolute inset-0 flex items-center justify-center px-6 z-20 pointer-events-none">
        <div className="text-center max-w-3xl">
          <div className="flex justify-center">
            <Image
              src="/AKPsi LogoONLY W+Gold (1).png"
              alt="Alpha Kappa Psi"
              width={800}
              height={300}
              className="w-64 md:w-96 h-auto"
              priority
            />
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/rush" className="pointer-events-auto cursor-pointer">
              <Button variant="ghost" className="text-white border-[#4D84C6] text-sm font-semibold">
                WINTER '26 APPLICATION
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Carousel at bottom */}
      <div className="absolute bottom-8 left-0 right-0 px-6 z-20 pointer-events-none">
        <p className="text-center text-white/85 text-base md:text-lg font-medium min-h-[60px] flex items-center justify-center">
          <span
            className={`inline-block font-bold transition-opacity duration-500 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
          >
            {sentences[currentIndex]}
          </span>
        </p>
      </div>
    </section>
  );
}
