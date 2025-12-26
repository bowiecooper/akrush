'use client'

import { useState, useEffect } from 'react'
import MemberCard from './MemberCard'

type Member = {
  full_name: string
  headshot_path: string | null
  title: string | null
  major: string | null
  major2: string | null
  minor: string | null
  linkedin_url: string | null
}

type MembersDisplayProps = {
  eboardMembers: Member[]
  directorMembers: Member[]
  activeMembers: Member[]
}

type MembersView = "BOARD" | "DIRECTORS" | "ACTIVES"

export default function MembersDisplay({
  eboardMembers,
  directorMembers,
  activeMembers
}: MembersDisplayProps) {
  const [view, setView] = useState<MembersView>("BOARD")
  const roles = [
    "business leaders",
    "investment bankers",
    "consultants",
    "industry engineers",
    "startup founders",
    "philanthropists",
  ]
  const [roleIndex, setRoleIndex] = useState(0)
  const [roleVisible, setRoleVisible] = useState(true)

  // Get current members based on view
  const getCurrentMembers = () => {
    switch (view) {
      case "BOARD":
        return eboardMembers
      case "DIRECTORS":
        return directorMembers
      case "ACTIVES":
        return activeMembers
      default:
        return []
    }
  }

  const currentMembers = getCurrentMembers()

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleVisible(false)
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % roles.length)
        setRoleVisible(true)
      }, 250) // Half of transition duration for smooth fade
    }, 3000) // Change every 3 seconds

    return () => clearInterval(interval)
  }, [roles.length])

  return (
    <section className="pt-32 pb-20 bg-white">
      <div className="mx-auto max-w-7xl px-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-[#4D84C6] text-center">
          OUR MEMBERS
        </h1>
        <p className="mt-6 text-base md:text-lg text-black/70 max-w-3xl mx-auto text-center pl-2 md:pl-4">
          We are{" "}
          <span className="inline-block min-w-[180px] text-left">
            <span
              className={`font-semibold text-[#4D84C6] inline-block transition-opacity duration-500 ${
                roleVisible ? "opacity-100" : "opacity-0"
              }`}
            >
              {roles[roleIndex]}
            </span>
          </span>
        </p>

        {/* Toggle buttons */}
        <div className="mt-10 flex justify-center">
          <div className="inline-flex rounded-full bg-[#0B1B4B]/5 p-1 gap-1">
            {(["BOARD", "DIRECTORS", "ACTIVES"] as MembersView[]).map((label) => {
              const isActive = view === label
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => setView(label)}
                  className={`px-5 py-2 text-xs md:text-sm font-semibold rounded-full transition-all ${
                    isActive
                      ? "bg-[#4D84C6] text-white shadow-sm"
                      : "bg-transparent text-[#4D84C6] hover:bg-[#4D84C6]/10"
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Members grid - 5 per row */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {currentMembers.map((member, index) => (
            <MemberCard
              key={`${member.full_name}-${index}`}
              headshotPath={member.headshot_path}
              name={member.full_name}
              title={member.title}
              major={member.major}
              major2={member.major2}
              minor={member.minor}
              linkedinUrl={member.linkedin_url}
            />
          ))}
        </div>

        {currentMembers.length === 0 && (
          <div className="mt-10 text-center text-black/80">
            <p className="text-lg md:text-xl font-semibold">
              {view === "BOARD" && "Executive Board"}
              {view === "DIRECTORS" && "Directors"}
              {view === "ACTIVES" && "Active Members"}
            </p>
            <p className="mt-3 text-sm md:text-base">
              No members found in this category.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

