import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MembersDisplay from "@/components/members/MembersDisplay";

export default async function MembersPage() {
  const supabase = await createClient();

  // Fetch all members - no filters on user_id or login status
  // Using case-insensitive matching for roles
  const { data: allMembers } = await supabase
    .from("BrotherDatabase")
    .select("full_name, headshot_path, title, major, major2, minor, role, linkedin_url")
    .order("full_name", { ascending: true });

  // Define eboard title order for custom sorting
  const eboardTitleOrder = [
    "President",
    "VP Internal",
    "VP External",
    "VP Membership",
    "VP Finance",
    "VP Operations"
  ];

  // Filter and sort eboard members
  // Exclude MOR and sort by custom order
  const eboardMembers = (allMembers || [])
    .filter(
      (member) => 
        member.role?.toLowerCase() === "eboard" && 
        member.title?.toLowerCase() !== "mor"
    )
    .sort((a, b) => {
      const aTitle = a.title || "";
      const bTitle = b.title || "";
      const aIndex = eboardTitleOrder.indexOf(aTitle);
      const bIndex = eboardTitleOrder.indexOf(bTitle);
      
      // If both titles are in the order list, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      }
      // If only one is in the list, prioritize it
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      // If neither is in the list, maintain alphabetical order
      return aTitle.localeCompare(bTitle);
    });
  
  const directorMembers = (allMembers || []).filter(
    (member) => member.role?.toLowerCase() === "director"
  );
  
  const activeMembers = (allMembers || []).filter(
    (member) => member.role?.toLowerCase() === "active"
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <MembersDisplay
        eboardMembers={eboardMembers}
        directorMembers={directorMembers}
        activeMembers={activeMembers}
      />
      <Footer />
    </main>
  );
}


