import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default async function ProfilePage() {
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

  // Format majors
  const majorsDisplay = userData.major2
    ? `${userData.major}, ${userData.major2}`
    : userData.major || "";

  // Format status based on role
  const role = userData.role?.toLowerCase();
  const showStatus = role === "memco" || role === "director" || role === "eboard";
  const statusDisplay = role === "memco" 
    ? "Memco" 
    : (role === "director" || role === "eboard") && userData.title
    ? userData.title
    : null;

  return (
    <main className="min-h-screen bg-[#E5F2FF] flex flex-col">
      <Navbar />
      
      <section className="flex-1 pt-32 pb-20 bg-[#E5F2FF]">
        <div className="mx-auto max-w-7xl px-6 h-full">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
            PROFILE
          </h1>
          
          <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm flex flex-col">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Profile Picture Section */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-[#4D84C6]">
                  {userData.headshot_path ? (
                    <Image
                      src={userData.headshot_path}
                      alt={userData.full_name}
                      width={192}
                      height={192}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-6xl font-bold">
                      {userData.full_name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>

              {/* User Information */}
              <div className="flex-1 space-y-3 text-lg text-black">
                <p>
                  <span className="font-semibold text-[#4D84C6]">Name:</span> {userData.full_name}
                </p>
                <p>
                  <span className="font-semibold text-[#4D84C6]">Email:</span> {userData.email}
                </p>
                {userData.graduation_year && (
                  <p>
                    <span className="font-semibold text-[#4D84C6]">Graduation Year:</span> {userData.graduation_year}
                  </p>
                )}
                {majorsDisplay && (
                  <p>
                    <span className="font-semibold text-[#4D84C6]">
                      Major{userData.major2 ? "s" : ""}:
                    </span> {majorsDisplay}
                  </p>
                )}
                {userData.minor && (
                  <p>
                    <span className="font-semibold text-[#4D84C6]">Minor:</span> {userData.minor}
                  </p>
                )}
                {showStatus && statusDisplay && (
                  <p>
                    <span className="font-semibold text-[#4D84C6]">Permissions Granted:</span> {statusDisplay}
                  </p>
                )}
                {userData.linkedin_url && (
                  <p>
                    <span className="font-semibold text-[#4D84C6]">LinkedIn:</span>{" "}
                    <a
                      href={userData.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4D84C6] hover:underline"
                    >
                      {userData.linkedin_url}
                    </a>
                  </p>
                )}
              </div>
            </div>
            
            {/* Edit Button - Centered between content and bottom */}
            <div className="mt-16 flex justify-center">
              <Link
                href="/edit-profile"
                className="px-6 py-3 bg-[#4D84C6] text-white font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer"
              >
                EDIT
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

