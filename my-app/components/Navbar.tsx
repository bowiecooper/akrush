"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useState, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const isLoggingOutRef = useRef(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
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

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
      if (user) {
        // Get user name from user_metadata (Google OAuth should provide this)
        const fullName = user.user_metadata?.full_name || 
                        user.user_metadata?.name || 
                        user.email?.split("@")[0] || 
                        "there";
        // Extract just the first name
        const firstName = fullName.split(" ")[0];
        setUserName(firstName);
      }
      setAuthChecked(true);
    };

    checkAuth();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Don't update logged in state if we're in the middle of logging out
      // This keeps the links visible until the redirect happens
      if (!isLoggingOutRef.current) {
        setIsLoggedIn(!!session?.user);
        if (session?.user) {
          // Get user name from user_metadata (Google OAuth should provide this)
          const fullName = session.user.user_metadata?.full_name || 
                          session.user.user_metadata?.name || 
                          session.user.email?.split("@")[0] || 
                          "there";
          // Extract just the first name
          const firstName = fullName.split(" ")[0];
          setUserName(firstName);
        } else {
          setUserName(null);
        }
        setAuthChecked(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    // Morning: 6AM - 12PM
    if (hour >= 6 && hour < 12) {
      return { greeting: "morning", emoji: "☀️" };
    } 
    // Afternoon: 12PM - 6PM
    else if (hour >= 12 && hour < 18) {
      return { greeting: "afternoon", emoji: "☀️" };
    } 
    // Evening: 6PM - 10PM
    else if (hour >= 18 && hour < 22) {
      return { greeting: "evening", emoji: "🌙" };
    } 
    // Night: 10PM - 6AM (covers 22:00-23:59 and 0:00-5:59)
    else {
      return { greeting: "night", emoji: "🌙" };
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    isLoggingOutRef.current = true;
    // Small delay to ensure the loading screen appears before auth state changes
    await new Promise(resolve => setTimeout(resolve, 100));
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

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
            {authChecked && (isLoggedIn || isLoggingOut) && (
              <>
                <Link
                  href="/dashboard"
                  className="text-[#E9D8A6] hover:text-white transition-colors"
                >
                  DASHBOARD
                </Link>
                {userName && (
                  <span className="text-[#E9D8A6] text-sm font-bold flex items-center gap-1.5">
                    <span>{getTimeOfDay().emoji}</span>
                    <span>
                      Good {getTimeOfDay().greeting}, {userName}
                    </span>
                  </span>
                )}
                <button
                  onClick={handleLogout}
                  className="text-[#E9D8A6] hover:text-white transition-colors cursor-pointer"
                  disabled={isLoggingOut}
                >
                  LOGOUT
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}