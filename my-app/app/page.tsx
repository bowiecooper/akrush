import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PresidentsWelcome from "@/components/PresidentsWelcome";

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <PresidentsWelcome />
    </main>
  );
}
