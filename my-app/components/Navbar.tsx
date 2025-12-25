"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";

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

  /**
   * On home page, pixels scrolled before logo appears.
   * Example: 400 means logo shows after scrolling 400px.
   */
  showLogoAfter?: number;
};

export default function Navbar({
  solidAfter = 24,
  hideAfter = 520,
  showLogoAfter = 400,
}: NavbarProps) {
  const [y, setY] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const onScroll = () => setY(window.scrollY || 0);
    onScroll(); // initialize
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
    checkDesktop(); // initialize
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const isSolid = y > solidAfter;
  // Only hide on mobile view, never hide on desktop
  const isHidden = !isDesktop && y > hideAfter;
  const showLogo = !isHomePage || y > showLogoAfter;

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

  // Don't render navbar on mobile view at all
  if (!isDesktop) {
    return null;
  }

  return (
    <header className={headerClass}>
      <div className="mx-auto flex w-full items-center justify-between px-6 py-5">
        <Link href="/" className="flex items-center gap-3">
          <div
            className={`flex items-center gap-3 transition-all duration-500 ${
              showLogo
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4 pointer-events-none"
            }`}
          >
            <Image
              src="/AKPsi LogoONLY W+Gold (1).png"
              alt="Alpha Kappa Psi"
              width={100}
              height={36}
              className="h-9 w-auto"
              priority
            />
          </div>
        </Link>

        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-7 text-sm font-bold">
            {[
              ["HOME", "/"],
              ["ABOUT US", "/about"],
              ["OUR MEMBERS", "/members"],
              ["RUSH", "/rush"],
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
        </div>
      </div>
    </header>
  );
}
