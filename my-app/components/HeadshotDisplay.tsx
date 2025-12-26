'use client'

import { useState } from 'react'

export default function HeadshotDisplay({ 
  headshotUrl, 
  name 
}: { 
  headshotUrl: string | null
  name: string 
}) {
  const [imgError, setImgError] = useState(false)

  if (!headshotUrl || imgError) {
    // Fallback avatar with initials
    const initials = name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)

    return (
      <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
        {initials}
      </div>
    )
  }

  return (
    <img
      src={headshotUrl}
      alt={`${name}'s headshot`}
      className="w-32 h-32 rounded-full object-cover"
      onError={() => setImgError(true)}
    />
  )
}