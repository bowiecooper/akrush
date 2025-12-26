import Link from "next/link";

export default function EboardTitleError() {
  return (
    <section className="pt-32 pb-20 bg-[#E5F2FF] flex-1">
      <div className="mx-auto max-w-7xl px-6 h-full">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
          ERROR
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-red-600 mb-4">No Matching Title Found</h2>
          <p className="text-black mb-6">
            No matching title was found for eboard position. Let me know at{" "}
            <a 
              href="mailto:joshxie@umich.edu" 
              className="text-[#4D84C6] hover:underline font-semibold"
            >
              joshxie@umich.edu
            </a>{" "}
            if you run into this issue.
          </p>
          
          <div className="mt-6">
            <Link 
              href="/profile" 
              className="inline-block px-6 py-3 bg-[#4D84C6] text-white font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer"
            >
              Go to Profile
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

