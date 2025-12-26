import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BidPage from "./BidPage";

export default async function BidPageWrapper() {
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

  // Check if status is actually BID
  if (userData.rushee_status !== "BID") {
    redirect("/rush/status");
  }

  return (
    <main className="min-h-screen bg-[#E5F2FF] flex flex-col">
      <Navbar />
      <BidPage userData={userData} />
      <Footer />
    </main>
  );
}

