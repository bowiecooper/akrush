"use client";

import { useEffect, useState } from "react";

type StatItem = {
  label: string;
  targetValue: number;
};

export default function AboutIntro() {
  // Update these target values with your actual numbers
  const stats: StatItem[] = [
    { label: "Members", targetValue: 100 }, // Replace with actual member count
    { label: "Alumni", targetValue: 500 }, // Replace with actual alumni count
    { label: "Majors", targetValue: 10 }, // Replace with actual count
    { label: "Industries Entered", targetValue: 20 }, // Replace with actual years or another stat
  ];

  const [displayValues, setDisplayValues] = useState(stats.map(() => 0));

  useEffect(() => {
    const duration = 1500; // 1.5 seconds animation
    const steps = 60; // 60 frames
    const stepDuration = duration / steps;

    // Ease-out cubic function: starts fast, slows down at the end
    const easeOutCubic = (t: number): number => {
      return 1 - Math.pow(1 - t, 3);
    };

    const intervals: NodeJS.Timeout[] = [];

    stats.forEach((stat, index) => {
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = Math.min(currentStep / steps, 1);
        const easedProgress = easeOutCubic(progress);
        const newValue = Math.floor(stat.targetValue * easedProgress);

        setDisplayValues((prev) => {
          const updated = [...prev];
          updated[index] = newValue;
          return updated;
        });

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);

      intervals.push(interval);
    });

    return () => {
      intervals.forEach((interval) => clearInterval(interval));
    };
  }, []);

  return (
    <section
      className="relative text-white"
      style={{
        background: `
          linear-gradient(to bottom, rgba(74, 109, 149, 0.9) 0%, rgba(232, 214, 190, 0.9) 100%),
          url('/noise.svg')
        `,
        backgroundColor: '#2C4563'
      }}
    >
      <div className="min-h-screen flex flex-col items-center justify-center px-6 pt-32 pb-16">
        <div className="max-w-3xl text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-wide">
            ABOUT US
          </h1>
          <p className="mt-8 text-lg md:text-xl leading-relaxed text-white/85">
            Alpha Kappa Psi is Michigan's oldest and most premier business fraternity. We are a co-ed
            organization with access to a large alumni network spanning top companies and careers paths
            across the globe. We are an organization that prides itself on diversity and uniqueness. As a
            brotherhood, we seek to balance professional development and social bonding. The benefits of
            AKPsi don't stop after pledging or even graduation — Alpha Kappa Psi is truly a lifelong organization.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 w-full max-w-5xl mt-8">
          {stats.map((stat, index) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl md:text-5xl font-extrabold text-white">
                {displayValues[index].toLocaleString()}+
              </div>
              <div className="mt-2 text-sm md:text-base text-white/80 font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}