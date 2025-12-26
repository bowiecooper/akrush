"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { completeSignup } from "./actions";
import HeadshotUpload from "@/components/HeadshotUpload";

type SignupFormProps = {
  userEmail: string;
  userId: string;
};

export default function SignupForm({ userEmail, userId }: SignupFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [headshotPath, setHeadshotPath] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    
    // Add headshot_path if available
    if (headshotPath) {
      formData.append("headshot_path", headshotPath);
    }

    const result = await completeSignup(formData);
    
    if (result?.error) {
      alert("Error completing signup: " + result.error);
      setIsSubmitting(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <section className="flex-1 pt-32 pb-20 bg-[#E5F2FF]">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
          COMPLETE YOUR PROFILE
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <form action={handleSubmit} className="space-y-6">
            {/* Email - Read Only */}
            <div>
              <label className="font-semibold text-[#4D84C6] block mb-1">
                Email:
              </label>
              <p className="text-black">{userEmail}</p>
            </div>

            {/* Full Name - Required */}
            <div>
              <label htmlFor="full_name" className="font-semibold text-[#4D84C6] block mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                placeholder="Enter your full name"
              />
            </div>

            {/* Graduation Year - Required */}
            <div>
              <label htmlFor="graduation_year" className="font-semibold text-[#4D84C6] block mb-1">
                Graduation Year <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="graduation_year"
                name="graduation_year"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                placeholder="e.g., 2025"
                min="2020"
                max="2030"
              />
            </div>

            {/* Major - Required */}
            <div>
              <label htmlFor="major" className="font-semibold text-[#4D84C6] block mb-1">
                Major <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="major"
                name="major"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                placeholder="Enter your major"
              />
            </div>

            {/* Major 2 - Optional */}
            <div>
              <label htmlFor="major2" className="font-semibold text-[#4D84C6] block mb-1">
                Major 2 (Optional):
              </label>
              <input
                type="text"
                id="major2"
                name="major2"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                placeholder="Enter second major (optional)"
              />
            </div>

            {/* Minor - Optional */}
            <div>
              <label htmlFor="minor" className="font-semibold text-[#4D84C6] block mb-1">
                Minor (Optional):
              </label>
              <input
                type="text"
                id="minor"
                name="minor"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                placeholder="Enter minor (optional)"
              />
            </div>

            {/* LinkedIn URL - Optional */}
            <div>
              <label htmlFor="linkedin_url" className="font-semibold text-[#4D84C6] block mb-1">
                LinkedIn URL (Optional):
              </label>
              <input
                type="url"
                id="linkedin_url"
                name="linkedin_url"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>

            {/* Headshot Upload */}
            <div>
              <label className="font-semibold text-[#4D84C6] block mb-1 mb-4">
                Profile Picture (Optional):
              </label>
              <div className="flex flex-col items-center space-y-4">
                {headshotPath && (
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-[#4D84C6]">
                    <Image
                      src={headshotPath}
                      alt="Profile preview"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <HeadshotUpload 
                  userId={userId} 
                  currentHeadshotPath={headshotPath}
                  onUploadSuccess={(url) => setHeadshotPath(url)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#4D84C6] text-white font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "CREATING PROFILE..." : "COMPLETE SIGNUP"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

