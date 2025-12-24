"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { LinkedinIcon, InstagramIcon, FacebookIcon } from "./home/icons";

type NavbarProps = {
  /**
   * Pixels scrolled before navbar becomes opaque.
   * Example: 24 means after ~24px, background appears.
   */
  solidAfter?: number;

  /**
   * Pixels scrolled before navbar hides.
   * Example: 420 means after 420px, navbar hides.
   */
  hideAfter?: number;
};

export default function Navbar({
  solidAfter = 24,
  hideAfter = 520,
}: NavbarProps) {
  const [y, setY] = useState(0);

  useEffect(() => {
    const onScroll = () => setY(window.scrollY || 0);
    onScroll(); // initialize
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isSolid = y > solidAfter;
  const isHidden = y > hideAfter;

  const headerClass = useMemo(() => {
    // Base: fixed overlay on top of page
    const base =
      "fixed inset-x-0 top-0 z-50 transition-all duration-300 will-change-transform";

    // Transparent vs solid background
    const bg = isSolid
      ? "bg-[#0B1B4B]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B1B4B]/85 shadow-sm"
      : "bg-transparent";

    // Hidden after far scroll
    const visibility = isHidden ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100";

    return `${base} ${bg} ${visibility}`;
  }, [isSolid, isHidden]);

  return (
    <header className={headerClass}>
      <div className="mx-auto flex w-full items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.webp"
              alt="Alpha Kappa Psi"
              width={100}
              height={36}
              className="h-9 w-20"
              priority
            />
          </div>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {[
              ["HOME", "/"],
              ["ABOUT US", "/about"],
              ["LEADERSHIP", "/leadership"],
              ["RUSH PORTAL", "/rush"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="text-[#E9D8A6] hover:text-white font-bold transition-all duration-200 hover:-translate-y-1"
              >
                {label}
              </Link>
            ))}
            <div className="flex items-center gap-4 ml-2">
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E9D8A6] hover:text-pink-400 transition-all duration-200 hover:-translate-y-1"
                aria-label="Instagram"
              >
                <InstagramIcon />
              </Link>
              <Link
                href="https://www.linkedin.com"
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
          </nav>
        </div>
      </div>
    </header>
  );
}
