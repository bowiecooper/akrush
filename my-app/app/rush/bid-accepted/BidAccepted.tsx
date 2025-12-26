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
            <div className="flex items-start">
              {[
                { label: "Application Submitted" },
                { label: "Top 90" },
                { label: "Top 50" },
                { label: "Bid" },
                { label: "Bid Accepted" },
              ].map((step, index) => {
                const isLast = index === 4;
                return (
                  <div key={index} className="flex items-start flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div className="w-12 h-12 rounded-full bg-[#4D84C6] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        ✓
                      </div>
                      <p className="text-xs mt-2 text-center font-semibold text-[#4D84C6]">
                        {step.label}
                      </p>
                    </div>
                    {!isLast && (
                      <div className="flex-1 h-1 mx-2 mt-6 bg-[#4D84C6]"></div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Congratulations Message */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-3xl font-bold text-[#4D84C6] text-center mb-6">
                WELCOME TO THE GAMMA LAMBDA CLASS
              </p>
            </div>

            {/* Welcome and Acceptance Message */}
            <div className="pt-4 border-t border-gray-200">
              <div className="space-y-4">
                <p className="text-black">
                  Congratulations on accepting your bid! We can't wait to see you on Saturday!
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-bold text-[#4D84C6] mb-2">Pledge Class Bonding!!!</h4>
                  <p className="text-black mb-2">
                    <strong>Date:</strong> January 31<br />
                    <strong>Time:</strong> TBD<br />
                    <strong>Location:</strong> TBD
                  </p>
                  <p className="text-black mb-2">
                    Please clear your nights for this mandatory pledge class bonding event. This is one of the fraternity's favorite events and we are very excited!
                  </p>
                  <p className="text-black">
                    Please email <a href="mailto:vp-membership@akpsi-phi.com" className="text-[#4D84C6] underline">vp-membership@akpsi-phi.com</a> or text us (see below) to confirm that you will be there. More specific information will be given to you once we get confirmation from everyone.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-black">
                    <strong>Important Note:</strong> As a heads up, alcohol will be offered at the bonding event, but drinking is absolutely, 100% never required at any event for AKPsi. If you don't drink, feel free to text us and we will ensure that this is fully respected and that you are not offered any alcohol.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-black mb-2">
                    <strong>Questions or Concerns?</strong> Feel free to reach out to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-black ml-4">
                    <li>Nanda: <a href="tel:6169169224" className="text-[#4D84C6] underline">(616) 916-9224</a></li>
                    <li>Claire: <a href="tel:2019833218" className="text-[#4D84C6] underline">(201) 983-3218</a></li>
                    <li>Email: <a href="mailto:vp-membership@akpsi-phi.com" className="text-[#4D84C6] underline">vp-membership@akpsi-phi.com</a></li>
                  </ul>
                </div>

                <p className="text-black font-semibold">
                  Congratulations once more for accepting your bid!
                </p>
                <p className="text-black mt-2">
                  Claire & Nanda
                </p>
              </div>
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

