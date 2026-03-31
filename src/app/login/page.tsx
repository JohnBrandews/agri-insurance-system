"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Shield, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [isFarmerMode, setIsFarmerMode] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleStandardLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (data.success) {
        // Set cookie manually for Server Components to read
        document.cookie = `farmshield_token=${data.token}; path=/; max-age=86400; SameSite=Lax`

        // simple redirect based on role
        if (data.user.role === "SUPER_ADMIN") router.push("/super-admin")
        else if (data.user.role === "INSURER") router.push("/insurer")
        else router.push("/agent")
      } else {
        setError(data.error || "Login failed")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const handleFarmerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      if (!otpSent) {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone })
        })
        const data = await res.json()
        if (data.success) setOtpSent(true)
        else setError(data.error || "Phone number not registered.")
      } else {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, otp })
        })
        const data = await res.json()
        if (data.success) {
          document.cookie = `farmshield_token=${data.token}; path=/; max-age=86400; SameSite=Lax`
          router.push("/farmer")
        } else {
          setError(data.error || "Invalid OTP.")
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 lg:flex">
      {/* Left side - Branding and Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <Image 
          src="/images/guy.jpg"
          alt="Farmer"
          fill
          className="object-cover"
          priority
        />
        {/* Translucent Emerald Overlay for readability */}
        <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-[2px]"></div>
        
        <div className="relative z-10 flex flex-col justify-between w-full p-16">
          <div>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                <Shield className="w-7 h-7 text-[#A7E92F]" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">FarmMan <span className="text-[#A7E92F]">Insurance</span></span>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold text-white leading-tight">
              Protecting Farms,<br />
              <span className="text-emerald-200">Securing Futures</span>
            </h1>
            <p className="text-xl text-emerald-100 max-w-md">
              Data-driven micro-insurance for modern agriculture. Weather-indexed policies with instant payouts.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10K+</div>
              <div className="text-sm text-emerald-200">Farmers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">50K+</div>
              <div className="text-sm text-emerald-200">Acres Covered</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">24/7</div>
              <div className="text-sm text-emerald-200">Support</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full items-center justify-center p-4 sm:p-6 lg:w-1/2 lg:p-12">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-800">FarmMan</span>
          </div>

          {/* Login Card */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl shadow-slate-200/50 sm:p-8 md:p-10">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Welcome Back</h2>
              <p className="text-slate-500">Sign in to access your dashboard</p>
            </div>

            {/* Toggle Mode */}
            <div className="bg-slate-100 rounded-2xl p-1.5 mb-8 flex">
              <button
                onClick={() => { setIsFarmerMode(false); setError(""); }}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  !isFarmerMode 
                    ? 'bg-white text-emerald-600 shadow-md' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Staff Login</span>
                </div>
              </button>
              <button
                onClick={() => { setIsFarmerMode(true); setError(""); }}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                  isFarmerMode 
                    ? 'bg-white text-emerald-600 shadow-md' 
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Farmer OTP</span>
                </div>
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">Login Error</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {!isFarmerMode ? (
              <form onSubmit={handleStandardLogin} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50 text-slate-900 font-medium"
                      placeholder="you@company.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50 text-slate-900 font-medium"
                      placeholder="........"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                    <span className="text-sm text-slate-600">Remember me</span>
                  </label>
                  <a href="#" className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">
                    Forgot Password?
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>Authenticating...</span>
                  ) : (
                    <>
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleFarmerLogin} className="space-y-5">
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-4">
                  <p className="text-sm text-emerald-800 font-medium">
                    {otpSent 
                      ? "Enter the 4-digit code sent to your phone" 
                      : "Enter your phone number to receive a secure login code"}
                  </p>
                </div>

                {!otpSent ? (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all bg-slate-50 text-slate-900 font-medium"
                        placeholder="0712 345 678"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Enter Verification Code
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      className="w-full rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-4 text-center font-mono text-xl font-bold tracking-[0.8em] text-slate-800 transition-all focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 sm:text-2xl sm:tracking-[1.2em]"
                      placeholder="0000"
                      maxLength={4}
                      required
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-slate-950 text-white font-bold py-4 rounded-xl transition-all hover:shadow-lg hover:shadow-slate-900/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      <span>{otpSent ? "Verify & Enter" : "Send Connect Code"}</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-center text-sm text-slate-500">
                Need help?{" "}
                <a href="#" className="font-semibold text-emerald-600 hover:text-emerald-700 hover:underline">
                  Contact Support
                </a>
              </p>
            </div>
          </div>

          {/* Footer text */}
          <p className="text-center text-sm text-slate-400 mt-8">
            © 2026 FarmMan Insurance. Secure authentication.
          </p>
        </div>
      </div>
    </div>
  )
}



