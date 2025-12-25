import Image from "next/image";
import Link from "next/link";
import { LinkedinIcon, InstagramIcon, FacebookIcon } from "./home/icons";

export default function Footer() {
  return (
    <footer className="bg-[#0B1B4B] text-white py-12">
      <div className="mx-auto w-full px-6">
        <div className="flex flex-col gap-6">
          {/* Top row - Logo and Social Icons */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="w-32 h-12 relative">
              <Image
                src="/AKPsi LogoONLY W+Gold (1).png"
                alt="Alpha Kappa Psi"
                width={128}
                height={48}
                className="h-full w-auto object-contain"
              />
            </div>

            <div className="flex items-center gap-6">
              <Link
                href="https://www.instagram.com/akpsi_umich/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E9D8A6] hover:text-pink-400 transition-all duration-200 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </Link>
              <Link
                href="https://www.linkedin.com/company/umichakpsi/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E9D8A6] hover:text-sky-400 transition-all duration-200 hover:-translate-y-1"
                aria-label="LinkedIn"
              >
                <LinkedinIcon />
              </Link>
              <Link
                href="https://www.facebook.com/akpsiphi"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E9D8A6] hover:text-blue-600 transition-all duration-200 hover:-translate-y-1"
                aria-label="Facebook"
              >
                <FacebookIcon />
              </Link>
            </div>
          </div>

          {/* Bottom row - Copyright and Email */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-sm md:text-base text-white/80">
              © 2025 Brothers of Alpha Kappa Psi - Phi Chapter
            </div>

            <a
              href="mailto:vp-external@akpsi-phi.com"
              className="text-[#E9D8A6] hover:text-white transition-colors text-sm md:text-base"
            >
              vp-external@akpsi-phi.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

