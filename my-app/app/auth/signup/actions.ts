"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function completeSignup(formData: FormData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get required fields
  const full_name = formData.get("full_name")?.toString();
  const graduation_year = formData.get("graduation_year")?.toString();
  const major = formData.get("major")?.toString();
  
  // Validate required fields
  if (!full_name || !graduation_year || !major) {
    return { error: "Full name, graduation year, and major are required" };
  }

  // Get optional fields
  const major2 = formData.get("major2")?.toString() || null;
  const minor = formData.get("minor")?.toString() || null;
  const linkedin_url = formData.get("linkedin_url")?.toString() || null;
  const headshot_path = formData.get("headshot_path")?.toString() || null;

  // Parse graduation year
  const year = parseInt(graduation_year);
  if (isNaN(year)) {
    return { error: "Invalid graduation year" };
  }

  // Check if user already has a record
  const { data: existingData, error: fetchError } = await supabase
    .from("BrotherDatabase")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (fetchError && fetchError.code !== "PGRST116") {
    // PGRST116 is "not found" error, which is expected for new users
    return { error: "Error checking existing profile: " + fetchError.message };
  }

  // Prepare update data
  const updateData: {
    full_name: string;
    graduation_year: number;
    major: string;
    major2?: string | null;
    minor?: string | null;
    linkedin_url?: string | null;
    headshot_path?: string | null;
  } = {
    full_name,
    graduation_year: year,
    major,
    major2,
    minor,
    linkedin_url,
    headshot_path,
  };

  if (existingData) {
    // Update existing record (created by trigger)
    const { error: updateError } = await supabase
      .from("BrotherDatabase")
      .update(updateData)
      .eq("id", existingData.id);

    if (updateError) {
      return { error: "Error updating profile: " + updateError.message };
    }
  } else {
    // Create new record (in case trigger didn't fire)
    const { error: insertError } = await supabase
      .from("BrotherDatabase")
      .insert({
        user_id: user.id,
        email: user.email,
        role: "rushee",
        ...updateData,
      });

    if (insertError) {
      return { error: "Error creating profile: " + insertError.message };
    }
  }

  // Revalidate paths
  revalidatePath("/dashboard");
  revalidatePath("/auth/signup");

  return { success: true };
}

