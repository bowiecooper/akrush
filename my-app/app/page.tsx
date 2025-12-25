import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import PresidentsWelcome from "@/components/home/PresidentsWelcome";
import Footer from "@/components/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <PresidentsWelcome />
      <Footer />
    </main>
  );
}
