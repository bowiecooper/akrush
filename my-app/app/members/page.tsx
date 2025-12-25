"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type MembersView = "BOARD" | "DIRECTORS" | "ACTIVES";

export default function MembersPage() {
  const [view, setView] = useState<MembersView>("BOARD");
  const roles = [
    "business leaders",
    "investment bankers",
    "consultants",
    "industry engineers",
    "startup founders",
    "philanthropists",
  ];
  const [roleIndex, setRoleIndex] = useState(0);
  const [roleVisible, setRoleVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleVisible(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length);
        setRoleVisible(true);
      }, 250); // Half of transition duration for smooth fade
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center">
            OUR MEMBERS
          </h1>
          <p className="mt-6 text-base md:text-lg text-black/70 max-w-3xl mx-auto text-center pl-2 md:pl-4">
            We are{" "}
            <span className="inline-block min-w-[180px] text-left">
              <span
                className={`font-semibold text-[#4D84C6] inline-block transition-opacity duration-500 ${
                  roleVisible ? "opacity-100" : "opacity-0"
                }`}
              >
                {roles[roleIndex]}
              </span>
            </span>
          </p>

          {/* Toggle buttons */}
          <div className="mt-10 flex justify-center">
            <div className="inline-flex rounded-full bg-[#0B1B4B]/5 p-1 gap-1">
              {(["BOARD", "DIRECTORS", "ACTIVES"] as MembersView[]).map((label) => {
                const isActive = view === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setView(label)}
                    className={`px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-all ${
                      isActive
                        ? "bg-[#4D84C6] text-white shadow-sm"
                        : "bg-transparent text-[#4D84C6] hover:bg-[#4D84C6]/10"
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* View content placeholder */}
          <div className="mt-10">
            {view === "BOARD" && (
              <div className="text-center text-black/80">
                <p className="text-lg md:text-xl font-semibold">Executive Board</p>
                <p className="mt-3 text-sm md:text-base max-w-3xl mx-auto">
                  LEAVE THIS FOR NOW WE NEED THE BACKEND FOR THIS PART
                </p>
              </div>
            )}

            {view === "DIRECTORS" && (
              <div className="text-center text-black/80">
                <p className="text-lg md:text-xl font-semibold">Directors</p>
                <p className="mt-3 text-sm md:text-base max-w-3xl mx-auto">
                  Placeholder for Directors. You can showcase committee leads and
                  operational roles here.
                </p>
              </div>
            )}

            {view === "ACTIVES" && (
              <div className="text-center text-black/80">
                <p className="text-lg md:text-xl font-semibold">Members</p>
                <p className="mt-3 text-sm md:text-base max-w-3xl mx-auto">
                  Placeholder for general members. You can highlight active brothers,
                  pledge classes, and more here.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}


