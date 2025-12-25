import Image from "next/image";

type ValueCard = {
  title: string;
  description: string;
  imageSrc?: string;
};

export default function ValueCards() {
  const cards: ValueCard[] = [
    {
      title: "Friendship",
      description: "The people you meet will go on to be your closest friends, roomates, study buddies, and everything in between. The lifelong friendships you make will be the most valuable aseets you take away from AKPsi.",
      imageSrc: undefined, // Placeholder for image
    },
    {
      title: "Members",
      description: "From pledging to brotherhood, the opportunities to lead and grow as a leader are endless. From running events to leading committees, there is always a way to get involved and make a difference.",
      imageSrc: undefined, // Placeholder for image
    },
    {
      title: "Network",
      description: "The Alpha Kappa Psi network is one of the largest and most diverse networks in the world. We have access to a large alumni network spanning top companies and careers paths across the globe.",
      imageSrc: undefined, // Placeholder for image
    },
    {
      title: "Development",
      description: "From professional development to personal growth, the opportunities to grow as a person are endless. The brotherhood will always be here to help you grow as a student, professional, and person.",
      imageSrc: undefined, // Placeholder for image
    },
  ];

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section title */}
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-[#4D84C6]">
          BENEFITS
        </h2>

        {/* Cards grid */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col items-center text-center bg-[#E9D8A6] hover:bg-[#F5E6B8] rounded-xl px-6 py-12 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
            >
              {/* Title */}
              <h3 className="text-2xl md:text-3xl font-bold text-[#4D84C6] mb-6">
                {card.title}
              </h3>

              {/* Image placeholder */}
              <div className="w-full max-w-sm h-64 bg-[#F5E6B8] rounded-lg mb-6 flex items-center justify-center">
                {card.imageSrc ? (
                  <Image
                    src={card.imageSrc}
                    alt={card.title}
                    width={400}
                    height={256}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <span className="text-gray-400 text-sm">Image placeholder</span>
                )}
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-[#4D84C6] leading-relaxed max-w-md">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

