import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ApplicationStatus from "./ApplicationStatus";

export default async function ApplicationStatusPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user data from BrotherDatabase
  const { data: userData, error } = await supabase
    .from("BrotherDatabase")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // If no record exists or full_name is missing, redirect to signup
  if (error || !userData || !userData.full_name) {
    redirect("/auth/signup");
  }

  // Check if user is a rushee
  if (userData.role?.toLowerCase() !== "rushee") {
    redirect("/dashboard");
  }

  // Check if application has been submitted
  const rusheeStatus = userData.rushee_status || "APPLICATION_NOT_SUBMITTED";
  if (rusheeStatus === "APPLICATION_NOT_SUBMITTED") {
    redirect("/rush/submit");
  }

  // Route to appropriate page based on status
  if (rusheeStatus === "CUT") {
    redirect("/rush/cut");
  }
  
  if (rusheeStatus === "BID") {
    redirect("/rush/bid");
  }
  
  if (rusheeStatus === "BID_ACCEPTED") {
    redirect("/rush/bid-accepted");
  }

  return (
    <main className="min-h-screen bg-[#E5F2FF] flex flex-col">
      <Navbar />
      <ApplicationStatus userData={userData} />
      <Footer />
    </main>
  );
}

