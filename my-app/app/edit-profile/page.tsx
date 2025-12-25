import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EditProfileForm from "./EditProfileForm";

export default async function EditProfilePage() {
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

  if (error || !userData) {
    redirect("/auth/error");
  }

  return (
    <main className="min-h-screen bg-[#E5F2FF] flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-32 pb-20 bg-[#E5F2FF]">
        <div className="mx-auto max-w-7xl px-6 h-full">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
            EDIT PROFILE
          </h1>
          
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm flex flex-col">
            <EditProfileForm userData={userData} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

