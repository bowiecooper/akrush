import Link from "next/link";
import Image from "next/image"
import { SiInstagram, SiFacebook } from "@icons-pack/react-simple-icons";
import { LinkedinIcon } from "./icons";

export default function Navbar() {
  return (
    <header className="bg-[#0B1B4B]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Alpha Kappa Psi Seal" width={200} height={200} />
        </Link>

        {/* Nav + social */}
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {[
              ["Home", "/"],
              ["About Us", "/about"],
              ["Leadership", "/leadership"],
              ["Rush", "/rush"],
              ["Apply", "/apply"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-[#E9D8A6] hover:text-white transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 text-[#E9D8A6]">
            <Link href="#" aria-label="Instagram" className="hover:text-white transition-colors">
              <SiInstagram size={20} />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="hover:text-white transition-colors">
              <LinkedinIcon />
            </Link>
            <Link href="#" aria-label="Facebook" className="hover:text-white transition-colors">
              <SiFacebook size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
