"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function submitApplication(formData: FormData) {
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

  // Check if already submitted
  if (currentData.rushee_status && currentData.rushee_status !== "APPLICATION_NOT_SUBMITTED") {
    return { error: "Application already submitted" };
  }

  // Helper function to format predictable fields to FIRSTWORD_SECONDWORD
  const formatField = (value: string): string => {
    return value.toUpperCase().replace(/\s+/g, '_');
  };

  // Get and format form data
  const rushee_uniqname = formData.get("rushee_uniqname")?.toString() || null;
  
  // Academic year
  const academicYear = formData.get("rushee_academic_year")?.toString();
  const academicYearOther = formData.get("rushee_academic_year_other")?.toString();
  const rushee_academic_year = academicYear === "OTHER" && academicYearOther
    ? formatField(academicYearOther)
    : academicYear ? formatField(academicYear) : null;

  // College (required)
  const rushee_college = formData.get("rushee_college")?.toString() || null;
  
  // Set rushee_in_ross to TRUE if Ross School of Business is selected
  const rushee_in_ross = rushee_college === "ROSS";

  // Phone number (already formatted by frontend)
  const rushee_phone_number = formData.get("rushee_phone_number")?.toString() || null;
  
  // Address
  const rushee_address = formData.get("rushee_address")?.toString() || null;
  
  // Gender
  const gender = formData.get("gender")?.toString();
  const genderOther = formData.get("gender_other")?.toString();
  const formattedGender = gender === "OTHER" && genderOther
    ? formatField(genderOther)
    : gender ? formatField(gender) : null;
  
  // Previously rushed (boolean)
  const previouslyRushed = formData.get("rushee_previously_rushed")?.toString();
  const rushee_previously_rushed = previouslyRushed === "true";
  
  // High school info
  const rushee_high_school = formData.get("rushee_high_school")?.toString() || null;
  const rushee_hs_city = formData.get("rushee_hs_city")?.toString() || null;
  const rushee_hs_state = formData.get("rushee_hs_state")?.toString() || null;
  
  // High school grad year (validate range)
  const hsGradYear = formData.get("rushee_hs_grad_year")?.toString();
  const rushee_hs_grad_year = hsGradYear ? parseInt(hsGradYear) : null;
  if (rushee_hs_grad_year && (rushee_hs_grad_year < 2000 || rushee_hs_grad_year > 2050)) {
    return { error: "High school graduation year must be between 2000 and 2050" };
  }
  
  // Major - single selection (required)
  const major = formData.get("rushee_major")?.toString();
  const majorOther = formData.get("rushee_major_other")?.toString();
  const rushee_major = major === "OTHER" && majorOther
    ? formatField(majorOther)
    : major ? formatField(major) : null;
  if (!rushee_major) {
    return { error: "Please select a major" };
  }
  
  // Major 2 - single selection (optional)
  const major2 = formData.get("rushee_major2")?.toString();
  const major2Other = formData.get("rushee_major2_other")?.toString();
  const rushee_major2 = major2 === "OTHER" && major2Other
    ? formatField(major2Other)
    : major2 ? formatField(major2) : null;
  
  // Minor - single selection (optional)
  const minor = formData.get("rushee_minor")?.toString();
  const minorOther = formData.get("rushee_minor_other")?.toString();
  const rushee_minor = minor === "OTHER" && minorOther
    ? formatField(minorOther)
    : minor ? formatField(minor) : null;
  
  // Major 3 and above (optional checkbox)
  const rushee_major3andabove = formData.get("rushee_major3andabove") === "true";
  
  // Minor 2 and above (optional checkbox)
  const rushee_minor2andabove = formData.get("rushee_minor2andabove") === "true";

  // Honors (text as-is)
  const rushee_honors = formData.get("rushee_honors")?.toString() || null;

  // Business Interest - multiple selections
  const businessInterestValues = formData.getAll("rushee_business_interest");
  const businessInterestOther = formData.get("rushee_business_interest_other")?.toString();
  
  // Process business interest selections
  const businessInterestArray: string[] = [];
  
  // First, add all checkbox selections (excluding "OTHER")
  businessInterestValues.forEach(value => {
    const val = value.toString();
    if (val !== "OTHER") {
      // Use the value as-is (already formatted as FIRSTWORD_SECONDWORD)
      businessInterestArray.push(val);
    }
  });
  
  // Then, if "OTHER" is selected, process and append the comma-separated values
  const hasOther = businessInterestValues.some(v => v.toString() === "OTHER");
  if (hasOther && businessInterestOther) {
    // Split by commas, trim each entry, and format as FIRSTWORD_SECONDWORD
    const otherInterests = businessInterestOther
      .split(',')
      .map(interest => interest.trim())
      .filter(interest => interest.length > 0)
      .map(interest => formatField(interest));
    
    // Append formatted "Other" interests to the array
    businessInterestArray.push(...otherInterests);
  }
  
  // Join all interests with commas
  const rushee_business_interest = businessInterestArray.length > 0 
    ? businessInterestArray.join(',') 
    : null;

  // Accommodations (text as-is)
  const rushee_accomodations = formData.get("rushee_accomodations")?.toString() || null;

  // Helper function to count words
  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Why AKPsi Response (required, max 150 words)
  const whyAkpsiResponse = formData.get("rushee_why_akpsi_response")?.toString() || null;
  if (!whyAkpsiResponse || whyAkpsiResponse.trim().length === 0) {
    return { error: "Why AKPsi Response is required" };
  }
  const whyAkpsiWordCount = countWords(whyAkpsiResponse);
  if (whyAkpsiWordCount > 150) {
    return { error: "Why AKPsi Response must be 150 words or less" };
  }
  const rushee_why_akpsi_response = whyAkpsiResponse;

  // Q1 Response (required, max 150 words)
  const q1Response = formData.get("rushee_q1_response")?.toString() || null;
  if (!q1Response || q1Response.trim().length === 0) {
    return { error: "Q1 Response is required" };
  }
  const q1WordCount = countWords(q1Response);
  if (q1WordCount > 150) {
    return { error: "Q1 Response must be 150 words or less" };
  }
  const rushee_q1_response = q1Response;

  // Q2 Response (required, max 250 words)
  const q2Response = formData.get("rushee_q2_response")?.toString() || null;
  if (!q2Response || q2Response.trim().length === 0) {
    return { error: "Q2 Response is required" };
  }
  const q2WordCount = countWords(q2Response);
  if (q2WordCount > 250) {
    return { error: "Q2 Response must be 250 words or less" };
  }
  const rushee_q2_response = q2Response;

  // Resume URL (optional)
  const rushee_resume_url = formData.get("rushee_resume_url")?.toString() || null;

  // Update the database to mark application as submitted
  const { error: updateError } = await supabase
    .from("BrotherDatabase")
    .update({ 
      rushee_status: "APPLICATION_SUBMITTED",
      rushee_uniqname,
      rushee_academic_year,
      rushee_college,
      rushee_phone_number,
      rushee_address,
      rushee_gender: formattedGender,
      rushee_previously_rushed,
      rushee_high_school,
      rushee_hs_city,
      rushee_hs_state,
      rushee_hs_grad_year,
      rushee_major,
      rushee_major2,
      rushee_minor,
      rushee_major3andabove,
      rushee_minor2andabove,
      rushee_in_ross,
      rushee_honors,
      rushee_business_interest,
      rushee_accomodations,
      rushee_why_akpsi_response,
      rushee_q1_response,
      rushee_q2_response,
      rushee_resume_url,
    })
    .eq("id", currentData.id);

  if (updateError) {
    return { error: "Error submitting application: " + updateError.message };
  }

  // Revalidate paths
  revalidatePath("/dashboard");
  revalidatePath("/rush/submit");
  revalidatePath("/rush/status");

  return { success: true };
}

