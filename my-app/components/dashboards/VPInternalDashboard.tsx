import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type UserData = {
  id: string;
  full_name: string;
  email: string;
  role: string | null;
  [key: string]: any;
};

type VPInternalDashboardProps = {
  userData: UserData;
};

export default async function VPInternalDashboard({ userData }: VPInternalDashboardProps) {
  const supabase = await createClient();

  return (
    <section className="pt-32 pb-20 bg-[#E5F2FF] flex-1">
      <div className="mx-auto max-w-7xl px-6 h-full">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
          VP INTERNAL DASHBOARD
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4D84C6] mb-4">Welcome, {userData.full_name}!</h2>
          <p className="text-black mb-6">
            This is your VP Internal dashboard. Here you have access to manage internal fraternity operations and brotherhood activities.
          </p>
          
          <div className="space-y-4">
            <Link href="/profile" className="block">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <h3 className="font-semibold text-black mb-2">Profile</h3>
                <p className="text-black">View/change user profile.</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

