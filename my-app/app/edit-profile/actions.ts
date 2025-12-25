"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get the user's current record to get the id
  const { data: currentData, error: fetchError } = await supabase
    .from("BrotherDatabase")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (fetchError || !currentData) {
    return { error: "User not found" };
  }

  // Extract form data - only editable fields
  const graduation_year = formData.get("graduation_year")?.toString();
  const major = formData.get("major")?.toString() || null;
  const major2 = formData.get("major2")?.toString() || null;
  const minor = formData.get("minor")?.toString() || null;

  // Prepare update object
  const updateData: {
    graduation_year?: number | null;
    major?: string | null;
    major2?: string | null;
    minor?: string | null;
  } = {};

  if (graduation_year) {
    const year = parseInt(graduation_year);
    updateData.graduation_year = isNaN(year) ? null : year;
  } else {
    updateData.graduation_year = null;
  }

  updateData.major = major || null;
  updateData.major2 = major2 || null;
  updateData.minor = minor || null;

  // Update the database
  const { error: updateError } = await supabase
    .from("BrotherDatabase")
    .update(updateData)
    .eq("id", currentData.id);

  if (updateError) {
    return { error: updateError.message };
  }

  // Revalidate the profile page to show updated data
  revalidatePath("/profile");
  revalidatePath("/edit-profile");

  redirect("/profile");
}

