"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import confetti from "canvas-confetti";
import { acceptBid } from "./actions";

type BidPageProps = {
  userData: {
    full_name: string;
    [key: string]: any;
  };
};

export default function BidPage({ userData }: BidPageProps) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    // Trigger confetti on page load
    const duration = 3000;
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

  const handleAccept = async () => {
    if (!confirm("Are you sure you want to accept this bid?")) {
      return;
    }

    setIsAccepting(true);
    const result = await acceptBid();
    
    if (result?.error) {
      alert("Error accepting bid: " + result.error);
      setIsAccepting(false);
    } else {
      router.push("/rush/bid-accepted");
    }
  };

  return (
    <section className="flex-1 pt-32 pb-20 bg-[#E5F2FF]">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
          BID OFFER
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4D84C6] mb-4">
            Congratulations, {userData.full_name}!
          </h2>
          
          <div className="space-y-6">
            {/* Status Circles - 4 filled with connecting lines */}
            <div className="flex items-center">
              {[
                { label: "Application Submitted" },
                { label: "Top 90" },
                { label: "Top 50" },
                { label: "Bid" },
              ].map((step, index) => {
                const isLast = index === 3;
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

            {/* Bid Message */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <p className="text-black font-semibold">You've Received a Bid!</p>
              </div>
              <p className="text-black mt-2 ml-6">
                Alpha Kappa Psi would like to extend a bid to you. Please review and accept if you'd like to join our fraternity.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-4">
              <button
                onClick={handleAccept}
                disabled={isAccepting}
                className="flex-1 px-6 py-3 bg-[#4D84C6] text-white font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAccepting ? "ACCEPTING..." : "ACCEPT BID"}
              </button>
              <Link
                href="/dashboard"
                className="flex-1 px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors cursor-pointer text-center"
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

