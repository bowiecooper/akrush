"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type Logo = {
  src: string;
  alt: string;
  width?: number; // optional hint
};

export default function LogoMarquee({
  title = "Backed by",
  logos,
  speedSeconds, // smaller = faster
  logoHeight,   // smaller logos
}: {
  title?: string;
  logos: Logo[];
  speedSeconds?: number;
  logoHeight?: number;
}) {
  // Duplicate to make the loop seamless
  const items = [...logos, ...logos];
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure layout is calculated before animation starts
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes marquee {
            0% {
              transform: translate3d(0, 0, 0);
            }
            100% {
              transform: translate3d(-50%, 0, 0);
            }
          }
          .marquee-track {
            animation: marquee var(--marquee-duration, 18s) linear infinite;
            animation-play-state: paused;
            will-change: transform;
            display: flex;
            backface-visibility: hidden;
            perspective: 1000px;
          }
          .marquee-track.ready {
            animation-play-state: running;
          }
          @media (prefers-reduced-motion: reduce) {
            .marquee-track {
              animation: none;
            }
          }
        `
      }} />
      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center text-3xl md:text-4xl font-semibold mb-8 text-[#4D84C6]">
            {title}
          </h2>

          {/* viewport */}
          <div className="relative overflow-hidden">
            {/* fading edges (optional, looks nice) */}
            <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-white to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent z-10" />

            {/* animated track */}
            <div
              className={`marquee-track flex w-max items-center gap-16 ${isReady ? "ready" : ""}`}
              style={
                {
                  "--marquee-duration": `${speedSeconds}s`,
                } as React.CSSProperties & { "--marquee-duration": string }
              }
            >
              {items.map((logo, i) => (
                <div
                  key={`${logo.src}-${i}`}
                  className="relative flex items-center justify-center shrink-0"
                  style={{ height: logoHeight }}
                >
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width ?? 160}
                    height={logoHeight}
                    className="h-full w-auto object-contain opacity-90"
                    priority={i < Math.min(6, logos.length)} // load first few eagerly
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
