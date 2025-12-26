'use client'

import { useState } from 'react'
import Image from 'next/image'

type MemberCardProps = {
  headshotPath: string | null
  name: string
  title: string | null
  major: string | null
  major2: string | null
  minor: string | null
  linkedinUrl: string | null
}

export default function MemberCard({
  headshotPath,
  name,
  title,
  major,
  major2,
  minor,
  linkedinUrl
}: MemberCardProps) {
  const [imgError, setImgError] = useState(false)

  // Split name into first and last name
  // Last name = last word, First name = everything before last word
  const nameParts = name.trim().split(/\s+/)
  const lastName = nameParts.length > 0 ? nameParts[nameParts.length - 1] : name
  const firstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : ''

  // Generate initials for fallback
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const handleCardClick = () => {
    if (linkedinUrl) {
      window.open(linkedinUrl, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div 
      className="group relative bg-white border border-gray-200 rounded-lg p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Hover overlay with LinkedIn icon */}
      {linkedinUrl && (
        <div className="absolute inset-0 bg-black/40 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-[#4D84C6]"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </div>
        </div>
      )}

      {/* Card content */}
      <div className="flex flex-col items-center space-y-2">
        {/* Headshot */}
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-[#4D84C6] mb-4">
          {headshotPath && !imgError ? (
            <Image
              src={headshotPath}
              alt={name}
              width={128}
              height={128}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-gray-400 text-4xl font-bold">
              {initials}
            </span>
          )}
        </div>

        {/* Text content - left aligned */}
        <div className="w-full text-left space-y-2">
          {/* Name - First and Last on separate lines */}
          <div>
            {firstName && (
              <h3 className="font-bold text-black text-xl">{firstName}</h3>
            )}
            <h3 className="font-bold text-black text-xl">{lastName}</h3>
          </div>

          {/* Title */}
          {title && (
            <p className="text-[#4D84C6] font-bold text-sm">{title}</p>
          )}

          {/* Major */}
          {major && (
            <p className="text-black text-sm">{major}</p>
          )}

          {/* Major 2 */}
          {major2 && (
            <p className="text-black text-sm">{major2}</p>
          )}

          {/* Minor */}
          {minor && (
            <p className="text-black text-sm">Minor in {minor}</p>
          )}
        </div>
      </div>
    </div>
  )
}

