import Navbar from "@/components/Navbar";
import AboutIntro from "@/components/about/AboutIntro";
import LogoMarquee from "@/components/about/LogoMarquee";
import ValueCards from "@/components/about/ValueCards";
import FAQ from "@/components/about/FAQ";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <AboutIntro />
      <ValueCards />
      <LogoMarquee
        title="OUR NETWORK"
        speedSeconds={70}     // faster
        logoHeight={30}       // smaller
        logos={[
          { src: "/carouselgallery/amazon.svg", alt: "Amazon" },
          { src: "/carouselgallery/apple.png", alt: "Apple" },
          { src: "/carouselgallery/bain.svg", alt: "Bain & Company" },
          { src: "/carouselgallery/barclays.svg", alt: "Barclays" },
          { src: "/carouselgallery/bcg.svg", alt: "Boston Consulting Group" },
          { src: "/carouselgallery/blackrock.svg", alt: "BlackRock" },
          { src: "/carouselgallery/citadel.svg", alt: "Citadel" },
          { src: "/carouselgallery/citi.svg", alt: "Citi" },
          { src: "/carouselgallery/deloitte.svg", alt: "Deloitte" },
          { src: "/carouselgallery/evercore.svg", alt: "Evercore" },
          { src: "/carouselgallery/ey.svg", alt: "Ernst & Young" },
          { src: "/carouselgallery/goldmansachs.svg", alt: "Goldman Sachs" },
          { src: "/carouselgallery/google.svg", alt: "Google" },
          { src: "/carouselgallery/guggenheim.svg", alt: "Guggenheim Partners" },
          { src: "/carouselgallery/jpmc.svg", alt: "JPMorgan Chase" },
          { src: "/carouselgallery/js.svg", alt: "Jane Street" },
          { src: "/carouselgallery/kkr.svg", alt: "KKR" },
          { src: "/carouselgallery/lazard.svg", alt: "Lazard" },
          { src: "/carouselgallery/mckinsey.svg", alt: "McKinsey & Company" },
          { src: "/carouselgallery/meta.svg", alt: "Meta" },
          { src: "/carouselgallery/microsoft.svg", alt: "Microsoft" },
          { src: "/carouselgallery/ms.svg", alt: "Morgan Stanley" },
          { src: "/carouselgallery/notion.svg", alt: "Notion" },
          { src: "/carouselgallery/nvidia.svg", alt: "NVIDIA" },
          { src: "/carouselgallery/optiver.svg", alt: "Optiver" },
          { src: "/carouselgallery/pwc.svg", alt: "PwC" },
          { src: "/carouselgallery/rothschild.svg", alt: "Rothschild & Co" },
        ]}
      />
      <FAQ />
      <Footer />
    </main>
  );
}

