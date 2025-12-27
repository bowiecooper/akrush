import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type UserData = {
  id: string;
  full_name: string;
  email: string;
  role: string | null;
  [key: string]: any;
};

type VPFinanceDashboardProps = {
  userData: UserData;
};

export default async function VPFinanceDashboard({ userData }: VPFinanceDashboardProps) {
  const supabase = await createClient();

  // Get RushSettings to check current_stage
  const { data: rushSettings } = await supabase
    .from("RushSettings")
    .select("current_stage")
    .single();

  const currentStage = rushSettings?.current_stage || null;
  const isTrackerDisabled = currentStage === "OPEN";

  return (
    <section className="pt-32 pb-20 bg-[#E5F2FF] flex-1">
      <div className="mx-auto max-w-7xl px-6 h-full">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
          VP FINANCE DASHBOARD
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4D84C6] mb-4">Welcome, {userData.full_name}!</h2>
          <p className="text-black mb-6">
            This is your VP Finance dashboard. Here you have access to manage financial records, budgets, and related financial operations.
          </p>
          
          <div className="space-y-4">
            <Link href="/profile" className="block">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <h3 className="font-semibold text-black mb-2">Profile</h3>
                <p className="text-black">View/change user profile.</p>
              </div>
            </Link>
            {isTrackerDisabled ? (
              <div className="p-4 bg-gray-100 rounded-lg opacity-50 cursor-not-allowed">
                <h3 className="font-semibold text-gray-500 mb-2">Rushee Tracker</h3>
                <p className="text-gray-500">Track and manage rushee applications.</p>
              </div>
            ) : (
              <Link href="/rush/tracker" className="block">
                <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <h3 className="font-semibold text-black mb-2">Rushee Tracker</h3>
                  <p className="text-black">Track and manage rushee applications.</p>
                </div>
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

