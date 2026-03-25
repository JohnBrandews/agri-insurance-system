"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"

function SetupPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const role = searchParams.get("role") || "USER"

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing setup token. Please check your email link.")
    }
  }, [token])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.")
      return
    }

    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/setup-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, role: role.toUpperCase() })
      })
      const data = await res.json()
      
      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(data.error || "Failed to setup password.")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-premium p-8">
      <div className="flex justify-center mb-6">
        <div className="flex items-center space-x-2">
          <span className="text-green-600 text-2xl">▲</span>
          <span className="text-2xl font-bold tracking-tight text-slate-900">FarmMan</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Welcome to your Account</h2>
      <p className="text-slate-500 text-center mb-8">Set a secure password to activate your profile.</p>

      {error && <div className="mb-4 text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</div>}
      
      {success ? (
        <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
          <h3 className="text-green-800 font-semibold text-lg mb-2">Setup Complete!</h3>
          <p className="text-green-600 mb-4">Redirecting you to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 border-t border-slate-100 pt-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
            <input 
              type="password" 
              placeholder="Enter new password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={!token}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              placeholder="Confirm password" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
              required
              disabled={!token}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading || !token}
            className="w-full mt-6 bg-[#46A316] hover:bg-green-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? "Activating..." : "Set Password & Activate"}
          </button>
        </form>
      )}
    </div>
  )
}

export default function SetupPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Suspense fallback={<div>Loading setup...</div>}>
        <SetupPasswordForm />
      </Suspense>
    </div>
  )
}
