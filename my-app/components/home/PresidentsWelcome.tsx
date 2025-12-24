import Image from "next/image";

export default function PresidentsWelcome() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16">
        {/* top divider line */}
        <div className="mx-auto mb-12 h-[2px] w-[100%] bg-[#4D84C6]" />

        {/* Make image and text side by side on medium+ screens */}
        <div className="flex flex-col md:flex-row items-start gap-16">
          {/* left image */}
          <div className="mx-auto w-full max-w-[420px] md:mx-0">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-gray-100 shadow-sm">
              <Image
                src="/president.jpeg"
                alt="President portrait"
                fill
                className="object-cover"
                priority={false}
              />
            </div>
          </div>

          {/* right content */}
          <div className="mx-auto w-full max-w-2xl text-center md:text-left md:mx-0">
            <h2 className="text-[#4D84C6] text-4xl md:text-5xl font-extrabold tracking-wide">
              PRESIDENT&apos;S WELCOME
            </h2>

            <p className="mt-6 text-xl md:text-2xl font-extrabold uppercase leading-snug text-black text-center md:text-left">
              On behalf of the brothers of the Phi Chapter here at the University of Michigan,
              I welcome you to our fraternity&apos;s official website.
            </p>

            <div className="mt-10 space-y-8 text-[17px] leading-8 text-black/80">
              <p>
                As the premier business fraternity, Alpha Kappa Psi is nationally recognized as a
                developer of principled, ethical business leaders. It is with great excitement and
                pride that we invite you to explore our organization.
              </p>

              <p>
                Our brotherhood is composed of the most driven, inspiring, and talented students here 
                at the University of Michigan. Since 1987, our brothers have spanned the community as 
                leaders of several other student organizations, young entrepreneurs, achievers in academia, 
                varsity collegiate athletes, and young professionals in the business world. The Phi Chapter&apos;s 
                invaluable network connects us not only throughout campus, but across the nation and abroad. 
                We pride ourselves on our ability to explore our mutual interests in business while building 
                a diverse family on campus. We strive to collaborate by building on our strengths, bettering our community, 
                and providing the resources for academic, professional, and personal success.
              </p>

              <p>
                I am incredibly excited for my 7th semester as a brother of Alpha Kappa Psi. Much of my amazing 
                experiences here at the University of Michigan have been centered around being a member of this 
                great organization. Alpha Kappa Psi has infinite experiences, opportunities, and friendships to offer, 
                and I encourage you to continue your exploration by attending our rush events. Thank you for your interest 
                and I am excited to get to know you better!
              </p>

              <p>Sincerely,</p>
              <p>Isabella</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
