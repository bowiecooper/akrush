import Link from "next/link";

type CutRejectionProps = {
  userData: {
    full_name: string;
    [key: string]: any;
  };
};

export default function CutRejection({ userData }: CutRejectionProps) {
  return (
    <section className="flex-1 pt-32 pb-20 bg-[#E5F2FF]">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
          APPLICATION UPDATE
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <div className="text-center space-y-6">
            {/* Rejection Message */}
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-[#4D84C6]">
                Thank You, {userData.full_name}
              </h2>

              <div className="space-y-3 text-black">
                <p className="text-lg">
                  We wanted to reach out and thank you for taking the time to apply to Alpha Kappa Psi.
                </p>
                <p>
                  After careful consideration, we have decided not to move forward with your application at this time.
                </p>
                <p>
                  This decision was not easy, and we truly appreciate your interest in our fraternity. We encourage you to continue pursuing your goals and wish you the best of luck in your future endeavors.
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  If you have any questions, please feel free to reach out to us.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-[#4D84C6] text-white font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

