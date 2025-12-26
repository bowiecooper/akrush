"use client";

import { useEffect } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";

type BidAcceptedProps = {
  userData: {
    full_name: string;
    [key: string]: any;
  };
};

export default function BidAccepted({ userData }: BidAcceptedProps) {
  useEffect(() => {
    // Trigger confetti on page load
    const duration = 5000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }, []);
  return (
    <section className="flex-1 pt-32 pb-20 bg-[#E5F2FF]">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
          BID ACCEPTED
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4D84C6] mb-4">
            Congratulations, {userData.full_name}!
          </h2>
          
          <div className="space-y-6">
            {/* Status Circles - All 5 filled with connecting lines */}
            <div className="flex items-center">
              {[
                { label: "Application Submitted" },
                { label: "Top 90" },
                { label: "Top 50" },
                { label: "Bid" },
                { label: "Bid Accepted" },
              ].map((step, index) => {
                const isLast = index === 4;
                return (
                  <div key={index} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-12 h-12 rounded-full bg-[#4D84C6] text-white flex items-center justify-center text-sm font-semibold">
                        ✓
                      </div>
                      <p className="text-xs mt-2 text-center font-semibold text-[#4D84C6]">
                        {step.label}
                      </p>
                    </div>
                    {!isLast && (
                      <div className="flex-1 h-1 mx-2 bg-[#4D84C6]"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Success Message */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-black font-semibold">Welcome to Alpha Kappa Psi!</p>
              </div>
              <p className="text-black mt-2 ml-6">
                You have successfully accepted your bid and are now a member of Alpha Kappa Psi. We're excited to have you join our fraternity!
              </p>
            </div>

            {/* Placeholder for additional text */}
            <div className="pt-4">
              <p className="text-black text-center text-sm">
                {/* Additional information will go here */}
              </p>
            </div>

            <div className="pt-4">
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-[#4D84C6] text-white font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

