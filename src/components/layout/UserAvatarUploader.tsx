"use client"

import { ChangeEvent, useRef, useState, useTransition } from "react"
import { Camera, Loader2, User } from "lucide-react"

type UserAvatarUploaderProps = {
  name: string
  imageUrl?: string | null
}

export default function UserAvatarUploader({ name, imageUrl }: UserAvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState(imageUrl ?? null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      setError("Select an image file.")
      event.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.")
      event.target.value = ""
      return
    }

    setError(null)

    startTransition(async () => {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const response = await fetch("/api/profile/photo", {
          method: "POST",
          body: formData,
        })

        const payload = await response.json()
        if (!response.ok || !payload.success) {
          throw new Error(payload.error ?? "Upload failed")
        }

        setPreviewUrl(payload.imageUrl)
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : "Upload failed")
      } finally {
        event.target.value = ""
      }
    })
  }

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative h-9 w-9 rounded-full border-2 border-white bg-slate-200 shadow-sm overflow-hidden group"
        aria-label="Update profile picture"
        title="Update profile picture"
      >
        {previewUrl ? (
          <img src={previewUrl} alt={name} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-slate-200">
            <User className="w-5 h-5 text-slate-500" />
          </div>
        )}

        <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/35 transition-colors flex items-center justify-center">
          {isPending ? (
            <Loader2 className="w-4 h-4 text-white animate-spin" />
          ) : (
            <Camera className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {error && (
        <p className="absolute right-0 top-full mt-2 w-40 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-[11px] text-red-700 shadow-sm">
          {error}
        </p>
      )}

      {!previewUrl && initials && (
        <span className="sr-only">{initials}</span>
      )}
    </div>
  )
}
