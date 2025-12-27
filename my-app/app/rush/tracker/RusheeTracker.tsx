"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

type RusheeTrackerProps = {
  currentStage: string | null;
};

type TabType = "APPLIED" | "CUT" | "TOP90" | "TOP50" | "BIDDED";

type Rushee = {
  id: string;
  full_name: string | null;
  email: string;
  rushee_uniqname: string | null;
  rushee_major: string | null;
  rushee_major2: string | null;
  rushee_minor: string | null;
  rushee_phone_number: string | null;
  headshot_path: string | null;
  [key: string]: any;
};

export default function RusheeTracker({ currentStage }: RusheeTrackerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("APPLIED");
  const [rushees, setRushees] = useState<Rushee[]>([]);
  const [loading, setLoading] = useState(false);

  // Determine which tabs are accessible based on current_stage
  const isTabAccessible = (tab: TabType): boolean => {
    switch (tab) {
      case "APPLIED":
        return true; // Always accessible
      case "CUT":
        return currentStage === "TOP90" || currentStage === "TOP50" || currentStage === "BIDS_OFFERED";
      case "TOP90":
        return currentStage === "TOP90" || currentStage === "TOP50" || currentStage === "BIDS_OFFERED";
      case "TOP50":
        return currentStage === "TOP50" || currentStage === "BIDS_OFFERED";
      case "BIDDED":
        return currentStage === "BIDS_OFFERED";
      default:
        return false;
    }
  };

  const tabs: { key: TabType; label: string; displayLabel: string }[] = [
    { key: "APPLIED", label: "APPLIED", displayLabel: "Applied" },
    { key: "CUT", label: "CUT", displayLabel: "Cut" },
    { key: "TOP90", label: "TOP 90", displayLabel: "Top 90" },
    { key: "TOP50", label: "TOP 50", displayLabel: "Top 50" },
    { key: "BIDDED", label: "BIDDED", displayLabel: "Bidded" },
  ];

  // Filter tabs to only show accessible ones
  const accessibleTabs = tabs.filter((tab) => isTabAccessible(tab.key));

  const fetchRushees = async (tab: TabType) => {
    setLoading(true);
    const supabase = createClient();

    let query = supabase
      .from("BrotherDatabase")
      .select("*")
      .eq("role", "rushee") // Only show users with rushee role
      .order("created_at", { ascending: false });

    // Apply filters based on tab
    switch (tab) {
      case "APPLIED":
        // Show all rushees who have submitted their application (regardless of current status)
        query = query.in("rushee_status", [
          "APPLICATION_SUBMITTED",
          "CUT",
          "TOP90",
          "TOP50",
          "BID",
          "BID_ACCEPTED"
        ]);
        break;
      case "CUT":
        // Show rushees with status = CUT
        query = query.eq("rushee_status", "CUT");
        break;
      case "TOP90":
        // Show rushees with rushee_reached_top_90 = TRUE
        query = query.eq("rushee_reached_top_90", true);
        break;
      case "TOP50":
        // Show rushees with rushee_reached_top_50 = TRUE
        query = query.eq("rushee_reached_top_50", true);
        break;
      case "BIDDED":
        // Show rushees with rushee_bidded = TRUE
        query = query.eq("rushee_bidded", true);
        break;
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching rushees:", error);
      setRushees([]);
    } else {
      setRushees(data || []);
    }
    setLoading(false);
  };

  // Set initial tab to first accessible tab when currentStage changes
  useEffect(() => {
    const accessible = tabs.filter((tab) => isTabAccessible(tab.key));
    if (accessible.length > 0 && !isTabAccessible(activeTab)) {
      const newTab = accessible[0].key;
      setActiveTab(newTab);
      fetchRushees(newTab);
    }
  }, [currentStage]);

  // Fetch rushees when tab changes or on mount
  useEffect(() => {
    if (isTabAccessible(activeTab)) {
      fetchRushees(activeTab);
    }
  }, [activeTab]);

  const handleTabChange = (tab: TabType) => {
    if (isTabAccessible(tab)) {
      setActiveTab(tab);
    }
  };

  // Generate initials for fallback
  const getInitials = (name: string | null): string => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <main className="min-h-screen bg-[#E5F2FF]">
      <Navbar />
      <section className="flex-1 pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6]">
              RUSHEE TRACKER
            </h1>
            <Link
              href="/dashboard"
              className="px-6 py-3 bg-[#4D84C6] text-white font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer"
            >
              Back to Dashboard
            </Link>
          </div>

          {/* Toggle buttons - similar to Our Members */}
          <div className="mb-10 flex justify-center">
            <div className="inline-flex rounded-full bg-[#0B1B4B]/5 p-1 gap-1">
              {accessibleTabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabChange(tab.key)}
                    className={`px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-all ${
                      isActive
                        ? "bg-[#4D84C6] text-white shadow-sm"
                        : "bg-transparent text-[#4D84C6] hover:bg-[#4D84C6]/10"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="mt-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading...</p>
            ) : (
              <div>
                <h2 className="text-xl font-semibold text-[#4D84C6] mb-6 text-center">
                  {tabs.find((t) => t.key === activeTab)?.displayLabel} Rushees ({rushees.length})
                </h2>
                {rushees.length === 0 ? (
                  <p className="text-gray-500 text-center">No rushees found in this category.</p>
                ) : (
                  <div className="space-y-4">
                    {rushees.map((rushee) => (
                      <div
                        key={rushee.id}
                        className="w-full bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-6">
                          {/* Headshot or Initials */}
                          <RusheeHeadshot
                            headshotPath={rushee.headshot_path}
                            name={rushee.full_name}
                            initials={getInitials(rushee.full_name)}
                          />

                          {/* Rushee Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-black text-xl mb-2">
                              {rushee.full_name || "Unknown"}
                            </h3>
                            <div className="space-y-1 text-sm text-gray-600">
                              {rushee.rushee_uniqname && (
                                <p>
                                  <span className="font-semibold">Uniqname:</span> {rushee.rushee_uniqname}
                                </p>
                              )}
                              {rushee.email && (
                                <p>
                                  <span className="font-semibold">Email:</span> {rushee.email}
                                </p>
                              )}
                              {rushee.rushee_phone_number && (
                                <p>
                                  <span className="font-semibold">Phone:</span> {rushee.rushee_phone_number}
                                </p>
                              )}
                              {rushee.rushee_major && (
                                <p>
                                  <span className="font-semibold">Major:</span> {rushee.rushee_major}
                                </p>
                              )}
                              {rushee.rushee_major2 && (
                                <p>
                                  <span className="font-semibold">2nd Major:</span> {rushee.rushee_major2}
                                </p>
                              )}
                              {rushee.rushee_minor && (
                                <p>
                                  <span className="font-semibold">Minor:</span> {rushee.rushee_minor}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

// Separate component for headshot with error handling
function RusheeHeadshot({
  headshotPath,
  name,
  initials,
}: {
  headshotPath: string | null;
  name: string | null;
  initials: string;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-[#4D84C6] flex-shrink-0">
      {headshotPath && !imgError ? (
        <Image
          src={headshotPath}
          alt={name || "Rushee"}
          width={96}
          height={96}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-gray-400 text-2xl font-bold">{initials}</span>
      )}
    </div>
  );
}
