import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RusheeDashboard from "@/components/dashboards/RusheeDashboard";
import ActiveDashboard from "@/components/dashboards/ActiveDashboard";
import MemcoDashboard from "@/components/dashboards/MemcoDashboard";
import DirectorDashboard from "@/components/dashboards/DirectorDashboard";
import PresidentDashboard from "@/components/dashboards/PresidentDashboard";
import MORDashboard from "@/components/dashboards/MORDashboard";
import VPInternalDashboard from "@/components/dashboards/VPInternalDashboard";
import VPExternalDashboard from "@/components/dashboards/VPExternalDashboard";
import VPFinanceDashboard from "@/components/dashboards/VPFinanceDashboard";
import VPOperationsDashboard from "@/components/dashboards/VPOperationsDashboard";
import EboardTitleError from "@/components/dashboards/EboardTitleError";

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

  // If no record exists or full_name is missing, redirect to signup
  if (brotherError || !brotherData || !brotherData.full_name) {
    redirect("/auth/signup");
  }

  const userRole = brotherData.role?.toLowerCase() as UserRole | null;
  
  // Validate role
  const validRoles: UserRole[] = ["rushee", "active", "memco", "director", "eboard"];
  if (!userRole || !validRoles.includes(userRole)) {
    redirect("/auth/error");
  }

  // For eboard, check title to determine which dashboard to show
  const userTitle = brotherData.title as string | null;
  
  // Valid eboard titles
  const validEboardTitles = ["President", "MOR", "VP Internal", "VP External", "VP Finance", "VP Operations"];
  const hasValidEboardTitle = userRole === "eboard" && userTitle && validEboardTitles.includes(userTitle);
  
  // Render appropriate dashboard based on role and title
  return (
    <main className="min-h-screen bg-[#E5F2FF] flex flex-col">
      <Navbar />
      <div className="flex-1">
        {userRole === "rushee" && <RusheeDashboard userData={brotherData} />}
        {userRole === "active" && <ActiveDashboard userData={brotherData} />}
        {userRole === "memco" && <MemcoDashboard userData={brotherData} />}
        {userRole === "director" && <DirectorDashboard userData={brotherData} />}
        {userRole === "eboard" && (
          <>
            {userTitle === "President" && <PresidentDashboard userData={brotherData} />}
            {userTitle === "MOR" && <MORDashboard userData={brotherData} />}
            {userTitle === "VP Internal" && <VPInternalDashboard userData={brotherData} />}
            {userTitle === "VP External" && <VPExternalDashboard userData={brotherData} />}
            {userTitle === "VP Finance" && <VPFinanceDashboard userData={brotherData} />}
            {userTitle === "VP Operations" && <VPOperationsDashboard userData={brotherData} />}
            {!hasValidEboardTitle && <EboardTitleError />}
          </>
        )}
      </div>
      <Footer />
    </main>
  );
}

