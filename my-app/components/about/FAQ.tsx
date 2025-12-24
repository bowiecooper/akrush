"use client";

import { useState } from "react";
import Link from "next/link";

type FAQItem = {
  question: string;
  answer: React.ReactNode;
};

const faqItems: FAQItem[] = [
  {
    question: "Why should I join Alpha Kappa Psi?",
    answer: (
      <>
        As a nationally recognized business organization, Alpha Kappa Psi offers
        business-related, social and philanthropic opportunities that complement
        your experience as a University of Michigan student. Our fraternity is
        comprised of diverse students with a variety of backgrounds, interests,
        and aspirations, and we strive to excel throughout our college career.
      </>
    ),
  },
  {
    question: "Can I rush more than once?",
    answer: (
      <>
        Yes, you can - in fact, we encourage it! Many of the brothers in our
        organization rushed more than one time, and you will not be penalized by
        any means for coming out a second time. Additionally, we offer rush in
        both fall and winter semesters.
      </>
    ),
  },
  {
    question: "What is the time commitment like?",
    answer: (
      <>
        Mandatory requirements for the pledging process include attendance at
        weekly meetings and additional events as well as a brotherhood interview
        requirement. While the pledging process is rigorous at times, what
        you put into our organization is likely what you will get out of it. The
        resources and opportunities within our organization are vast, and you
        will be given every opportunity to grow as a leader, business
        professional, and brother.
      </>
    ),
  },
  {
    question: "Do I need to be a business major?",
    answer: (
      <>
        No! Although many of our members are pursuing business-related majors,
        AKPsi accepts all majors. We believe that a keen sense of business is
        important in all fields. Our members are concentrating in a variety of
        fields and are pursuing an equal diverse range of career paths and
        oppportunities. That we all hold the same drive for professional and
        business success, in any industry, is what unites us as an organization.
      </>
    ),
  },
  {
    question: "Will being in Alpha Kappa Psi hinder my academic success?",
    answer: (
      <>
        The members of Alpha Kappa Psi pride themselves on being hard working
        and organized individuals. As a professional organization, it is a top
        priority of our members to maintain the highest academic standard. At no
        time will you be asked to put pledging or a social lifestyle before your
        academics.
      </>
    ),
  },
  {
    question: "How do I apply?",
    answer: (
      <>
        Applications for the Winter 2026 semester are currently open and will
        close on January 27, 2026. You can apply by clicking{" "}
        <Link
          href="/rush"
          className="underline underline-offset-2 text-[#4D84C6] hover:text-[#2f65a3]"
        >
          here
        </Link>
        . Feel free to contact us at vp-membership@akpsi-phi.com with any
        questions.
      </>
    ),
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-[#4D84C6]">
          FAQ
        </h2>

        <div className="mt-10 space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <button
                key={item.question}
                type="button"
                onClick={() => toggleIndex(index)}
                className="w-full text-left rounded-xl border border-[#E0E0E0] bg-white/90 hover:bg-[#F7FAFF] px-5 py-4 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-base md:text-lg font-semibold text-[#0B1B4B]">
                    {item.question}
                  </span>
                  <span className="text-[#4D84C6] text-2xl font-bold leading-none">
                    {isOpen ? "−" : "+"}
                  </span>
                </div>
                <div
                  className={`mt-3 text-sm md:text-base text-black/80 transition-all duration-300 ${
                    isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  {item.answer}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}


