import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SignupForm from "./SignupForm";

export default async function SignupPage() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check if user already has a complete profile
  const { data: brotherData } = await supabase
    .from("BrotherDatabase")
    .select("*")
    .eq("user_id", user.id)
    .single();

  // If user has full_name, they've already completed signup
  if (brotherData?.full_name) {
    redirect("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#E5F2FF] flex flex-col">
      <Navbar />
      <SignupForm userEmail={user.email || ""} userId={user.id} />
      <Footer />
    </main>
  );
}

