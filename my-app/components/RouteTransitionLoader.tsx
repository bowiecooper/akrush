"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function RouteTransitionLoader() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const prevPathnameRef = useRef<string | null>(null);

  useEffect(() => {
    // Only show loading when pathname actually changes (not on initial mount)
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 500);
      prevPathnameRef.current = pathname;
      return () => clearTimeout(timer);
    }
    prevPathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    // Listen for link clicks to show loader immediately
    const handleLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      if (link && link.href && !link.target) {
        // Only for internal links
        try {
          const url = new URL(link.href);
          if (url.origin === window.location.origin) {
            // Check if it's a different page
            const linkPathname = url.pathname;
            if (linkPathname !== pathname) {
              setIsLoading(true);
            }
          }
        } catch {
          // Invalid URL, ignore
        }
      }
    };

    // Listen for all link clicks
    document.addEventListener("click", handleLinkClick);

    return () => {
      document.removeEventListener("click", handleLinkClick);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#E5F2FF]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo above spinner */}
        <div className="w-32 h-12 relative">
          <Image
            src="/logo.webp"
            alt="Alpha Kappa Psi"
            fill
            className="object-contain"
            sizes="128px"
            priority
          />
        </div>

        {/* Spinner */}
        <div className="h-10 w-10 rounded-full border-4 border-[#4D84C6]/30 border-t-[#4D84C6] animate-spin" />
      </div>
    </div>
  );
}

