import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RusheeTracker from "./RusheeTracker";

export default async function RusheeTrackerPage() {
  const supabase = await createClient();

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Get user data to check role
  const { data: userData, error: userError } = await supabase
    .from("BrotherDatabase")
    .select("role")
    .eq("user_id", user.id)
    .single();

  if (userError || !userData) {
    redirect("/auth/error");
  }

  // Check if user has access (active, eboard, memco, or director)
  const allowedRoles = ["active", "eboard", "memco", "director"];
  if (!userData.role || !allowedRoles.includes(userData.role)) {
    redirect("/dashboard");
  }

  // Get RushSettings to check current_stage
  const { data: rushSettings, error: rushSettingsError } = await supabase
    .from("RushSettings")
    .select("current_stage")
    .single();

  const currentStage = rushSettings?.current_stage || null;

  // Redirect if current_stage is OPEN (rushee tracker not accessible during open rush)
  if (currentStage === "OPEN") {
    redirect("/dashboard");
  }

  return <RusheeTracker currentStage={currentStage} />;
}

