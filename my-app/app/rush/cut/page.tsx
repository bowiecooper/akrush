import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CutRejection from "./CutRejection";

export default async function CutPage() {
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

  // Check if status is actually CUT
  if (userData.rushee_status !== "CUT") {
    redirect("/rush/status");
  }

  return (
    <main className="min-h-screen bg-[#E5F2FF] flex flex-col">
      <Navbar />
      <CutRejection userData={userData} />
      <Footer />
    </main>
  );
}

