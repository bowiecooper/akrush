"use client";

import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RushPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  const checkpoints = [
    { title: "APPLICATIONS OPEN", header: "January 7", description: "Applications for the Winter 2026 semester are currently live. Head over to the rush portal to get started!" },
    { title: "WINTERFEST", header: "January 12-13, 4PM-7PM @ Michigan Union", description: "Come meet the brothers and learn more about rush at Winterfest! This is a great opportunity to ask general questions about AKPsi and the rush process, and to meet other fellow rushees." },
    { title: "MASS MEETING", header: "January 14, 5:30PM-6:30PM @ Robertson Auditorium", description: "This is our first formal AKPsi-hosted rush event. Come to learn more about our organization through presentations given by our brothers and a personal networking session for 1-1 interactions with our members." },
    { title: "COFFEE CHATS", header: "January 20, 5PM-7PM @ TBD", description: "Grab a coffee and have a chance to have casual chats with our brothers to get to know them better. This is generally a more relaxed event that is another networking opportunity for rushees." },
    { title: "DEI EVENT", header: "January 21, 6PM-7:30PM @ Trotter Multicultural Center", description: "Learn more about the unique backgrounds of brothers that makes AKPsi adiverse melting pot of cultures from around the world. This event is generally more serious, and we ask that you help us maintain a respectful and professional environment throughout the event." },
    { title: "WINTER OLYMPICS", header: "January 22, 6PM-8PM @ TBD", description: "Participate in winter olympics to play some themed games and have fun with the brothers! This is a great opportunity to get a true experience of social events within AKPsi." },
    { title: "APPLICATIONS DUE", header: "January 22, 11:59PM", description: "Applications are due by this time. Updates to application statuses will be sent out shortly after applications close." },
  ];

  const handleApplyClick = () => {
    if (contentRef.current) {
      const heroHeight = window.innerHeight;
      window.scrollTo({
        top: heroHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col bg-[#E5F2FF] pt-20 md:pt-32">
        <div className="flex-1 flex items-center justify-center pt-12 md:pt-20">
          <div className="text-center px-6">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#4D84C6] mb-6">
              RUSH
            </h1>
            <h2 className="text-2xl md:text-3xl font-normal text-black mb-4">
              Welcome to rush.
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
              You've come to the right place and we can't wait to meet you.
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-4 pb-16 md:pb-24">
          <button
            className="px-8 py-4 bg-[#4D84C6] text-white font-bold text-lg rounded-lg hover:bg-[#2f65a3] transition-colors duration-200 flex items-center gap-2"
          >
            ACCESS PORTAL
          </button>
          <button
            onClick={handleApplyClick}
            className="px-8 py-4 bg-[#4D84C6] text-white font-bold text-lg rounded-lg hover:bg-[#2f65a3] transition-colors duration-200 animate-bounce-slow flex items-center gap-2"
          >
            LEARN MORE
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </button>
        </div>
      </section>

      {/* Interest Form Section */}
      <div ref={contentRef} className="min-h-[33vh] bg-white pt-20 pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#4D84C6] text-center mb-6">
            INTEREST FORM
          </h2>
          <p className="text-base md:text-lg text-black/70 max-w-3xl mx-auto text-center mb-8">
            Join our interest form to remain up-to-date with all things AKPsi! We strongly encourage all students interested in rushing to join this form as this will be the main point of contact for all rush updates.
          </p>
          <div className="flex justify-center">
            <a
              href="#"
              className="px-8 py-4 bg-[#4D84C6] text-white font-bold text-lg rounded-lg hover:bg-[#2f65a3] transition-colors duration-200 inline-block"
            >
              INTEREST FORM
            </a>
          </div>
        </div>
      </div>

      {/* Rush Schedule Section */}
      <section className="bg-[#E5F2FF] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#4D84C6] text-center mb-12">
            RUSH SCHEDULE
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
            {/* Left: Progress Bar */}
            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#4D84C6]" />
              
              {/* Checkpoints */}
              <div className="flex flex-col gap-8">
                {checkpoints.map((checkpoint, index) => (
                  <div key={index} className="flex items-start gap-4 relative">
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-full border-2 border-[#4D84C6] z-10 ${
                        index === 0 ? "bg-[#4D84C6]" : "bg-white"
                      }`}
                    />
                    <div className="pt-1">
                      <h3 className="text-xl md:text-2xl font-bold text-[#4D84C6] mb-2">
                        {checkpoint.title}
                      </h3>
                      <h4 className="text-lg md:text-xl font-semibold text-black mb-2">
                        {checkpoint.header}
                      </h4>
                      <p className="text-base md:text-lg text-black/70">
                        {checkpoint.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: YouTube Video and Images */}
            <div className="w-full flex flex-col gap-6">
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center w-full">
                <p className="text-gray-400">YouTube Video Placeholder</p>
              </div>
              
              {/* Scrapbook Images */}
              <div className="flex flex-col gap-4 flex-1">
                {[1, 2, 3, 4].map((index) => (
                  <div
                    key={index}
                    className={`bg-gray-200 rounded-lg border-4 border-white shadow-lg flex items-center justify-center ${
                      index === 1 ? "h-32 rotate-2" :
                      index === 2 ? "h-28 -rotate-1" :
                      index === 3 ? "h-32 rotate-[-2deg]" :
                      "h-28 rotate-1"
                    }`}
                  >
                    <p className="text-gray-400 text-sm">Image {index}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ready to Dive In Section */}
      <section className="min-h-[50vh] bg-white flex items-center justify-center py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#4D84C6] mb-6">
            READY TO DIVE IN?
          </h2>
          <p className="text-base md:text-lg text-black/70 max-w-3xl mx-auto mb-8">
                What are you waiting for? Apply now to start your journey with AKPsi!
          </p>
          <a
            href="#"
            className="inline-block px-8 py-4 bg-[#4D84C6] text-white font-bold text-lg rounded-lg hover:bg-[#2f65a3] transition-colors duration-200"
          >
            I'M READY
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}

