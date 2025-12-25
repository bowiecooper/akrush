import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-[#0B1B4B] text-white py-12">
      <div className="mx-auto w-full px-6">
        <div className="flex flex-col gap-6">
          {/* Logo placeholder */}
          <div className="w-32 h-12 relative">
            <Image
              src="/AKPsi LogoONLY W+Gold (1).png"
              alt="Alpha Kappa Psi"
              width={128}
              height={48}
              className="h-full w-auto object-contain"
            />
          </div>

          {/* Email contact */}
          <div>
            <a
              href="mailto:vp-external@akpsi-phi.com"
              className="text-[#E9D8A6] hover:text-white transition-colors text-sm md:text-base"
            >
              vp-external@akpsi-phi.com
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm md:text-base text-white/80">
            © 2025 Brothers of Alpha Kappa Psi - Phi Chapter
          </div>
        </div>
      </div>
    </footer>
  );
}

