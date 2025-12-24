import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#E5F2FF]">
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


