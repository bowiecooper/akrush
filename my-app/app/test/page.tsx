"use client";

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/ui/aurora-background";
import Navbar from "@/components/Navbar";

export default function TestPage() {
  return (
    <>
      <Navbar />
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
            Alpha Kappa Psi Test Page
          </div>
          <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
            Aurora background effect demo
          </div>
          <button className="bg-[#0B1B4B] hover:bg-[#E9D8A6] hover:text-[#0B1B4B] rounded-full w-fit text-white px-6 py-3 transition-all font-bold">
            Explore Now
          </button>
        </motion.div>
      </AuroraBackground>
    </>
  );
}
