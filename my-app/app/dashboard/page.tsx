import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RusheeDashboard from "@/components/dashboards/RusheeDashboard";
import ActiveDashboard from "@/components/dashboards/ActiveDashboard";
import MemcoDashboard from "@/components/dashboards/MemcoDashboard";
import DirectorDashboard from "@/components/dashboards/DirectorDashboard";
import EboardDashboard from "@/components/dashboards/EboardDashboard";

type UserRole = "rushee" | "active" | "memco" | "director" | "eboard";

export default async function Dashboard() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check user's role in BrotherDatabase
  const { data: brotherData, error: brotherError } = await supabase
    .from("BrotherDatabase")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (brotherError || !brotherData) {
    redirect("/auth/error");
  }

  const userRole = brotherData.role?.toLowerCase() as UserRole | null;
  
  // Validate role
  const validRoles: UserRole[] = ["rushee", "active", "memco", "director", "eboard"];
  if (!userRole || !validRoles.includes(userRole)) {
    redirect("/auth/error");
  }

  // Render appropriate dashboard based on role
  return (
    <main className="min-h-screen bg-[#E5F2FF]">
      <Navbar />
      {userRole === "rushee" && <RusheeDashboard userData={brotherData} />}
      {userRole === "active" && <ActiveDashboard userData={brotherData} />}
      {userRole === "memco" && <MemcoDashboard userData={brotherData} />}
      {userRole === "director" && <DirectorDashboard userData={brotherData} />}
      {userRole === "eboard" && <EboardDashboard userData={brotherData} />}
      <Footer />
    </main>
  );
}

