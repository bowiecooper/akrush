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
    { key: "TOP50", label: "Top 50", concealedLabel: status === "TOP90" ? "Top 50" : "Closed Rush 2nd Round" },
    { key: "BID", label: "Bid", concealedLabel: "Final rounds" },
  ];

  // Find current status index
  const currentIndex = statusSteps.findIndex(step => step.key === status);

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
              <div className="flex items-start">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  const isConcealed = index > currentIndex;
                  const isLast = index === statusSteps.length - 1;
                  
                  return (
                    <div key={step.key} className="flex items-start flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div
                          className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all flex-shrink-0 ${
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
                        <div className={`flex-1 h-1 mx-2 mt-6 ${isCompleted ? "bg-[#4D84C6]" : "bg-gray-200"}`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Status-specific content */}
            {status === "APPLICATION_SUBMITTED" && (
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-4">
                  <p className="text-black">
                    Thank you for submitting your application to Alpha Kappa Psi. We appreciate your interest in joining our fraternity.
                  </p>
                  <p className="text-black">
                    Results will be posted on this page shortly after the application deadline. Please check back here for updates on your application status.
                  </p>
                </div>
              </div>
            )}

            {status === "TOP90" && (
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-[#4D84C6]">
                      Congratulations on making Top 90! 🎉
                    </p>
                    <p className="text-base font-bold text-[#4D84C6]">
                      Your application was impressive, and we are excited to get to know you better!
                    </p>
                  </div>
                  <p className="text-black">
                    As part of our rush process, we have a few more upcoming events to have some more chances at networking, and to get to know you and your background better. Moving forward, please be on the lookout for emails from our VP Memberships for updates on general informmation about rush, and continue to check back here for updates on your application status.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-[#4D84C6] mb-2">Upcoming Event: Speed Dating</h4>
                    <p className="text-black mb-2">
                      <strong>Date:</strong> January 24<br />
                      <strong>Time:</strong> 4PM - 6PM<br />
                      <strong>Location:</strong> TBD
                    </p>
                    <p className="text-black">
                      This event is designed to be informal and casual. Think of it as 1-on-1 chats with brothers where you can learn more about AKPsi and we can learn more about you. You will also be asked to participate in group games and challenges with other rushees. The dress code is casual, and we encourage you to arrive 5-10 minutes early if you are able.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-black font-semibold">Important Reminders:</p>
                    <ul className="list-disc list-inside space-y-1 text-black ml-4">
                      <li><strong>Attendance is mandatory</strong> for all post-application events. Please let us know as soon as possible if you have any time conflicts.</li>
                      <li><strong>Save the date</strong> for upcoming events:
                        <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                          <li>Top 50 Social Event: January 25</li>
                          <li>Top 50 Reception: January 26</li>
                          <li>Brief Individual Interviews: January 27-28</li>
                        </ul>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-black">
                      <strong>Questions or Concerns?</strong> Please reach out to us at <a href="mailto:vp-membership@akpsi-phi.com" className="text-[#4D84C6] underline">vp-membership@akpsi-phi.com</a> if you have any concerns throughout the rush process. AKPsi just wants what's best for you.
                    </p>
                  </div>

                  <p className="text-black font-semibold">
                    Congratulations once more, and we are so excited to meet you!
                  </p>
                  <p className="text-black mt-2">
                    Claire & Nanda
                  </p>
                </div>
              </div>
            )}

            {status === "TOP50" && (
              <div className="pt-4 border-t border-gray-200">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-[#4D84C6]">
                      Congratulations on making Top 50! 🎉
                    </p>
                    <p className="text-base font-bold text-[#4D84C6]">
                      We really enjoyed getting to know you at Top 90, and on behalf of the entire AKPsi brotherhood, we'd like to invite you to our Top 50 rush events!
                    </p>
                  </div>
                  <p className="text-black">
                    As part of our rush process, we have a few more upcoming events to have some more chances at networking, and to get to know you and your background better. Moving forward, please be on the lookout for emails from our VP Memberships for updates on general information about rush, and continue to check back here for updates on your application status.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-bold text-[#4D84C6] mb-3">Upcoming Events:</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-black mb-1">
                          <strong>Top 50 Social</strong><br />
                          <strong>Date:</strong> January 25<br />
                          <strong>Time:</strong> 3PM - 5PM<br />
                          <strong>Location:</strong> Arbor Blu Rooftop (624 Church St)
                        </p>
                      </div>
                      <div>
                        <p className="text-black mb-1">
                          <strong>Top 50 Reception</strong><br />
                          <strong>Date:</strong> January 26<br />
                          <strong>Time:</strong> 7PM - 9PM<br />
                          <strong>Location:</strong> TBD
                        </p>
                      </div>
                      <div>
                        <p className="text-black mb-2">
                          <strong>Top 50 Interviews</strong><br />
                          <strong>Date:</strong> January 27-28<br />
                          <strong>Time:</strong> 7PM - 10PM<br />
                          <strong>Location:</strong> Ross School of Business
                        </p>
                        <Link
                          href="/rush/interviews"
                          className="inline-block px-4 py-2 bg-[#4D84C6] text-white font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer mt-2"
                        >
                          Secure Your Interview Spot
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-black font-semibold mb-2">Interview Information:</p>
                    <p className="text-black mb-2">
                      Prior to your interview, please meet us near the couches on the second floor of Ross and we'll help direct you to your interview room!
                    </p>
                    <p className="text-black">
                      We'll be sending out additional information about the interview, along with a time slot confirmation, closer to the date. <strong>Dress code is business professional</strong> and please <strong>bring 3 printed copies of your resume</strong>.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-black font-semibold">Important Reminders:</p>
                    <ul className="list-disc list-inside space-y-1 text-black ml-4">
                      <li><strong>Attendance is mandatory</strong> for all post-application events. Please let us know as soon as possible if you have any time conflicts.</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-black">
                      <strong>Questions or Concerns?</strong> Please reach out to us at <a href="mailto:vp-membership@akpsi-phi.com" className="text-[#4D84C6] underline">vp-membership@akpsi-phi.com</a> if you have any concerns throughout the rush process. AKPsi just wants what's best for you.
                    </p>
                  </div>

                  <p className="text-black">
                    It's been awesome to get to know you, and congratulations once more!
                  </p>
                  <p className="text-black mt-2">
                    Claire & Nanda
                  </p>
                </div>
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

