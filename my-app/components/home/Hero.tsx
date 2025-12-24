import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative">
      {/* Image + overlay */}
      <div className="relative h-[520px] md:h-screen w-full overflow-hidden">
        <Image
          src="/hero.jpeg"
          alt="Group photo"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
      </div>

      {/* Centered content */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="text-center max-w-3xl">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold tracking-widest">
            ALPHA KAPPA PSI
          </h1>
          <p className="mt-4 text-white/85 text-base md:text-lg font-medium">
            Shaping the world's next ethical, skilled, and resourceful business leaders.
          </p>

          <div className="mt-8 flex justify-center">
            <Link
              href="/apply"
              className="inline-flex items-center justify-center rounded-md bg-[#4D84C6] px-7 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#3E73B3] transition-colors"
            >
              WINTER ’26 APPLICATION
            </Link>
          </div>
        </div>
      </div>

      {/* Optional: subtle bottom divider like screenshot */}
      <div className="h-[10px] bg-white" />
    </section>
  );
}
