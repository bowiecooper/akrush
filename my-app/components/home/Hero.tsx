"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Hero() {
  const sentences = [
    "Michigan's Premier Professional Business Fraternity",
    "Shaping future ethical, skilled, and experienced business leaders",
    "Creating lifelong friendships and connections",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [imageOffset, setImageOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

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

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const scrollProgress = Math.max(0, -rect.top);
      // Move image upward as user scrolls down (opposite direction)
      setImageOffset(scrollProgress * 0.5); // 0.5 is the parallax speed multiplier
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} className="relative">
      {/* Image + overlay */}
      <div className="relative h-[520px] md:h-screen w-full overflow-hidden">
        <div
          style={{
            transform: `translateY(${imageOffset}px)`,
            transition: "transform 0.1s ease-out",
          }}
          className="absolute inset-0"
        >
          <Image
            src="/hero.jpeg"
            alt="Group photo"
            fill
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Centered content */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-widest">
            ALPHA KAPPA PSI
          </h1>
          <p className="mt-4 text-white/85 text-base md:text-lg font-medium min-h-[60px] flex items-center justify-center">
            <span
              className={`inline-block font-bold transition-opacity duration-500 ${
                isVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {sentences[currentIndex]}
            </span>
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-md bg-[#4D84C6] px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#3E73B3] transition-colors"
            >
              WINTER ’26 APPLICATION
            </Link>
          </div>
        </div>
      </div>

      {/* Optional: subtle bottom divider like screenshot */}
      <div className="h-[10px] bg-white" />
    </section>
  );
}
