import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type UserData = {
  id: string;
  full_name: string;
  email: string;
  role: string | null;
  [key: string]: any;
};

type EboardDashboardProps = {
  userData: UserData;
};

export default async function EboardDashboard({ userData }: EboardDashboardProps) {
  const supabase = await createClient();

  return (
    <section className="pt-32 pb-20 bg-[#E5F2FF]">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
          EBOARD DASHBOARD
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4D84C6] mb-4">Welcome, {userData.full_name}!</h2>
          <p className="text-black mb-6">
            This is your executive board dashboard. Here you have full access to manage all aspects of the fraternity and rush process.
          </p>
          
          <div className="space-y-4">
            <Link href="/profile" className="block">
              <div className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <h3 className="font-semibold text-black mb-2">Profile</h3>
                <p className="text-black">View user profile.</p>
              </div>
            </Link>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-black mb-2">Full System Access</h3>
              <p className="text-black">Access all features and administrative functions.</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-black mb-2">User Management</h3>
              <p className="text-black">Manage all users, roles, and permissions.</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-black mb-2">Rush Administration</h3>
              <p className="text-black">Oversee and manage the entire rush process.</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-black mb-2">Analytics & Reports</h3>
              <p className="text-black">View comprehensive analytics and generate reports.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

