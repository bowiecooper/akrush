"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function acceptBid() {
  const supabase = await createClient();

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get the user's current record
  const { data: currentData, error: fetchError } = await supabase
    .from("BrotherDatabase")
    .select("id, rushee_status")
    .eq("user_id", user.id)
    .single();

  if (fetchError || !currentData) {
    return { error: "User not found" };
  }

  // Check if status is BID
  if (currentData.rushee_status !== "BID") {
    return { error: "No bid to accept" };
  }

  // Update the database to mark bid as accepted
  const { error: updateError } = await supabase
    .from("BrotherDatabase")
    .update({ 
      rushee_status: "BID_ACCEPTED",
    })
    .eq("id", currentData.id);

  if (updateError) {
    return { error: "Error accepting bid: " + updateError.message };
  }

  // Revalidate paths
  revalidatePath("/dashboard");
  revalidatePath("/rush/bid");
  revalidatePath("/rush/bid-accepted");

  return { success: true };
}

