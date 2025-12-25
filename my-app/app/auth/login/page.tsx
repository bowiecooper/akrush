"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import GoogleSignIn from "@/components/GoogleSignIn";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for error in query params
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError("Authentication failed. Please try again.");
    }

    // Check if user is already logged in
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (user) {
        // Check if email is @umich.edu
        if (user.email?.endsWith("@umich.edu")) {
          router.push("/dashboard");
        } else {
          router.push("/auth/error");
        }
      }
    };

    checkUser();
  }, [router, supabase, searchParams]);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <section className="min-h-[80vh] flex items-center justify-center bg-[#E5F2FF] py-20">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#4D84C6] mb-4">
              Sign In
            </h1>
            <p className="text-base md:text-lg text-black/70 mb-8">
              Sign in with your @umich.edu email to access the rush portal.
            </p>
            
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="flex justify-center">
              <GoogleSignIn />
            </div>
            
            <p className="mt-6 text-sm text-gray-500">
              By signing in, you agree to use your University of Michigan email address.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

