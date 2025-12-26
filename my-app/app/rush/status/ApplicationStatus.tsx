import Link from "next/link";

type ApplicationStatusProps = {
  userData: {
    full_name: string;
    rushee_status: string | null;
    rushee_resume_url?: string | null;
    [key: string]: any;
  };
};

export default function ApplicationStatus({ userData }: ApplicationStatusProps) {
  const status = userData.rushee_status || "APPLICATION_SUBMITTED";
  
  // Define status progression with 4 circles
  const statusSteps = [
    { key: "APPLICATION_SUBMITTED", label: "Application Submitted", concealedLabel: null },
    { key: "TOP90", label: "Top 90", concealedLabel: "Closed Rush 1st Round" },
    { key: "TOP50", label: "Top 50", concealedLabel: "Closed Rush 2nd Round" },
    { key: "BID", label: "Bid", concealedLabel: "Final rounds" },
  ];

  // Find current status index
  const currentIndex = statusSteps.findIndex(step => step.key === status);
  const currentLabel = currentIndex >= 0 ? statusSteps[currentIndex].label : "Application Submitted";

  return (
    <section className="flex-1 pt-32 pb-20 bg-[#E5F2FF]">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center mb-12">
          APPLICATION STATUS
        </h1>
        
        <div className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-[#4D84C6] mb-4">
            Application Status for {userData.full_name}
          </h2>
          
          <div className="space-y-6">
            {/* Horizontal Circles with connecting lines */}
            <div className="space-y-4">
              <div className="flex items-center">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  const isConcealed = index > currentIndex;
                  const isLast = index === statusSteps.length - 1;
                  
                  return (
                    <div key={step.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                            isCompleted
                              ? "bg-[#4D84C6] text-white"
                              : "bg-gray-200 text-gray-500"
                          } ${isCurrent ? "ring-2 ring-[#4D84C6] ring-offset-2" : ""}`}
                        >
                          {isCompleted ? "✓" : index + 1}
                        </div>
                        <p
                          className={`text-xs mt-2 text-center ${
                            isCurrent ? "font-semibold text-[#4D84C6]" : "text-gray-600"
                          }`}
                        >
                          {isConcealed ? step.concealedLabel : step.label}
                        </p>
                      </div>
                      {!isLast && (
                        <div className={`flex-1 h-1 mx-2 ${isCompleted ? "bg-[#4D84C6]" : "bg-gray-200"}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Current Status Display */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#4D84C6] rounded-full"></div>
                <p className="text-black font-semibold">Current Status: {currentLabel}</p>
              </div>
            </div>

            {/* Placeholder for additional text */}
            <div className="pt-4">
              <p className="text-black text-center text-sm">
                {/* Additional status text will go here */}
              </p>
            </div>

            {/* Resume Display - Only show for APPLICATION_SUBMITTED status */}
            {status === "APPLICATION_SUBMITTED" && userData.rushee_resume_url && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xl font-bold text-[#4D84C6] mb-3">
                  Your Resume
                </h3>
                <div className="space-y-2">
                  <a
                    href={userData.rushee_resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 bg-gray-100 text-[#4D84C6] font-semibold rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
                  >
                    View Resume (Opens in new tab)
                  </a>
                  <p className="text-sm text-gray-600">
                    Your resume has been successfully uploaded and submitted with your application.
                  </p>
                </div>
              </div>
            )}

            {status === "APPLICATION_SUBMITTED" && !userData.rushee_resume_url && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xl font-bold text-[#4D84C6] mb-3">
                  Your Resume
                </h3>
                <p className="text-sm text-gray-600">
                  No resume was uploaded with your application.
                </p>
              </div>
            )}

            <div className="pt-4">
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

