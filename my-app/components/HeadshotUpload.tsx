'use client'

import { createClient } from '@/lib/supabase/client'
import { useState, useRef } from 'react'

export default function HeadshotUpload({ 
  userId, 
  currentHeadshotPath,
  onUploadSuccess
}: { 
  userId: string
  currentHeadshotPath: string | null
  onUploadSuccess?: (url: string) => void
}) {
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const handleChooseFileClick = () => {
    fileInputRef.current?.click()
  }

  const uploadHeadshot = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = event.target.files[0]
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return
      }

      // Create unique filename
      const fileExt = file.name.split('.').pop()
      const filePath = `${userId}/headshot.${fileExt}`

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('headshots')
        .upload(filePath, file, { upsert: true }) // upsert replaces existing file

      if (uploadError) throw uploadError

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('headshots')
        .getPublicUrl(filePath)

      setPreviewUrl(publicUrl)
      
      // Call callback if provided (for signup form - don't update DB yet)
      if (onUploadSuccess) {
        onUploadSuccess(publicUrl)
      } else {
        // Update database with new headshot path (for edit profile)
        const { error: dbError } = await supabase
          .from('BrotherDatabase')
          .update({ headshot_path: publicUrl })
          .eq('user_id', userId)

        if (dbError) throw dbError

        // Refresh the page to show updated headshot
        window.location.reload()
      }

    } catch (error) {
      // Error uploading headshot - silently fail
    } finally {
      setUploading(false)
    }
  }

  const deleteHeadshot = async () => {
    if (!currentHeadshotPath) return
    
    if (!confirm('Are you sure you want to delete your headshot?')) {
      return
    }

    try {
      setDeleting(true)

      // Extract file path from URL to delete from storage
      // Assuming the URL format is: https://[project].supabase.co/storage/v1/object/public/headshots/[userId]/headshot.[ext]
      const urlParts = currentHeadshotPath.split('/headshots/')
      if (urlParts.length > 1) {
        const filePath = urlParts[1]
        
        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('headshots')
          .remove([filePath])

        if (storageError) throw storageError
      }

      // Update database to remove headshot path
      const { error: dbError } = await supabase
        .from('BrotherDatabase')
        .update({ headshot_path: null })
        .eq('user_id', userId)

      if (dbError) throw dbError
      
      // Refresh the page to show updated headshot
      window.location.reload()

    } catch (error) {
      // Error deleting headshot - silently fail
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*"
        onChange={uploadHeadshot}
        disabled={uploading || deleting}
        ref={fileInputRef}
        className="hidden"
      />

      {/* Custom Choose File button */}
      <button
        type="button"
        onClick={handleChooseFileClick}
        disabled={uploading || deleting}
        className="px-4 py-2 bg-[#4D84C6] text-white text-sm font-semibold rounded-lg hover:bg-[#3a6ba5] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? 'Uploading...' : 'Choose File'}
      </button>

      {/* Delete button - aligned with Choose File button */}
      {currentHeadshotPath && (
        <button
          type="button"
          onClick={deleteHeadshot}
          disabled={deleting || uploading}
          className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </button>
      )}
    </div>
  )
}