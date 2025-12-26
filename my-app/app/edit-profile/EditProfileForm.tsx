"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { updateProfile } from "./actions";
import HeadshotUpload from "@/components/HeadshotUpload";

type UserData = {
  id: string;
  full_name: string;
  email: string;
  graduation_year: number | null;
  major: string | null;
  major2: string | null;
  minor: string | null;
  role: string | null;
  title: string | null;
  headshot_path: string | null;
  linkedin_url: string | null;
  [key: string]: any;
};

type EditProfileFormProps = {
  userData: UserData;
  userId: string;
};

export default function EditProfileForm({ userData, userId }: EditProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format status based on role
  const role = userData.role?.toLowerCase();
  const showStatus = role === "memco" || role === "director" || role === "eboard";
  const statusDisplay = role === "memco" 
    ? "On Memco" 
    : (role === "director" || role === "eboard") && userData.title
    ? userData.title
    : null;

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    await updateProfile(formData);
    setIsSubmitting(false);
  };

  const handleCancel = () => {
    router.push("/profile");
  };

  return (
    <form action={handleSubmit} className="flex flex-col h-full">
      <div className="flex flex-col md:flex-row gap-8 flex-1">
        {/* Profile Picture Section */}
        <div className="flex-shrink-0 space-y-4">
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
          <HeadshotUpload 
            userId={userId} 
            currentHeadshotPath={userData.headshot_path}
          />
        </div>

        {/* User Information */}
        <div className="flex-1 space-y-3 text-lg text-black">
          {/* Name - Read Only */}
          <div>
            <span className="font-semibold text-[#4D84C6]">Name:</span>{" "}
            <span className="text-black">{userData.full_name}</span>
          </div>

          {/* Email - Read Only */}
          <div>
            <span className="font-semibold text-[#4D84C6]">Email:</span>{" "}
            <span className="text-black">{userData.email}</span>
          </div>

          {/* Graduation Year - Editable */}
          <div>
            <label htmlFor="graduation_year" className="font-semibold text-[#4D84C6] block mb-1">
              Graduation Year:
            </label>
            <input
              type="number"
              id="graduation_year"
              name="graduation_year"
              defaultValue={userData.graduation_year || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
              placeholder="e.g., 2025"
            />
          </div>

          {/* Major - Editable */}
          <div>
            <label htmlFor="major" className="font-semibold text-[#4D84C6] block mb-1">
              Major:
            </label>
            <input
              type="text"
              id="major"
              name="major"
              defaultValue={userData.major || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
              placeholder="Enter major"
            />
          </div>

          {/* Major 2 - Editable */}
          <div>
            <label htmlFor="major2" className="font-semibold text-[#4D84C6] block mb-1">
              Major 2 (Optional):
            </label>
            <input
              type="text"
              id="major2"
              name="major2"
              defaultValue={userData.major2 || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
              placeholder="Enter second major (optional)"
            />
          </div>

          {/* Minor - Editable */}
          <div>
            <label htmlFor="minor" className="font-semibold text-[#4D84C6] block mb-1">
              Minor (Optional):
            </label>
            <input
              type="text"
              id="minor"
              name="minor"
              defaultValue={userData.minor || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
              placeholder="Enter minor (optional)"
            />
          </div>

          {/* LinkedIn URL - Editable */}
          <div>
            <label htmlFor="linkedin_url" className="font-semibold text-[#4D84C6] block mb-1">
              LinkedIn URL (Optional):
            </label>
            <input
              type="url"
              id="linkedin_url"
              name="linkedin_url"
              defaultValue={userData.linkedin_url || ""}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4D84C6] text-black"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          {/* Permission Level - Read Only (if applicable) */}
          {showStatus && statusDisplay && (
            <div>
              <span className="font-semibold text-[#4D84C6]">Permissions Granted:</span>{" "}
              <span className="text-black">{statusDisplay}</span>
            </div>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-16 flex justify-center gap-4">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 py-3 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
          disabled={isSubmitting}
        >
          CANCEL
        </button>
        <button
          type="submit"
          className="px-6 py-3 bg-[#4D84C6] text-white font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "SAVING..." : "SAVE"}
        </button>
      </div>
    </form>
  );
}

