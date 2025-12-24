import Navbar from "@/components/Navbar";

export default function RushLegoTestPage() {
  return (
    <main
      className="min-h-screen relative"
      style={{
        background: `
          linear-gradient(to bottom, rgba(74, 109, 149, 0.9) 0%, rgba(232, 214, 190, 0.9) 100%),
          url('/noise.svg')
        `,
        backgroundColor: '#2C4563'
      }}
    >
      {/* Cross grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.05,
          backgroundImage: `

            radial-gradient(circle, #d4d4d4 8px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
          backgroundPosition: 'center',
          mixBlendMode: 'normal'
        }}
      />

      <Navbar />

      {/* Content starts below navbar - add top padding */}
      <div className="pt-24 px-6 max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold text-white mb-6">
          Test Page
        </h1>

        <div className="space-y-4">
          <p className="text-gray-300">
            This is a test page for the Alpha Kappa Psi website.
          </p>

          <div className="bg-[#0B1B4B] text-white p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Navy Blue Section</h2>
            <p>This uses the primary color #0B1B4B</p>
          </div>

          <div className="bg-[#E9D8A6] text-[#0B1B4B] p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">Cream Section</h2>
            <p>This uses the secondary color #E9D8A6</p>
          </div>

          <div className="border-2 border-[#0B1B4B] p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-[#0B1B4B] mb-2">
              Testing Area
            </h2>
            <p className="text-gray-700">
              Use this page to test new components or features.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
