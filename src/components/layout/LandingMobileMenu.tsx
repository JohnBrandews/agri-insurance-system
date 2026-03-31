"use client"

import Link from "next/link"
import { Menu, Shield, X } from "lucide-react"
import { useEffect, useState } from "react"
import SessionMenu from "./SessionMenu"

type LandingMobileMenuProps = {
  currentUser: {
    name: string
    profileImageUrl?: string | null
    role: string
  } | null
  dashboardHref?: string
}

export default function LandingMobileMenu({
  currentUser,
  dashboardHref = "/",
}: LandingMobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        aria-label="Open site menu"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-white backdrop-blur-md md:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            aria-label="Close site menu"
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          />

          <div className="absolute right-0 top-0 flex h-full w-[88%] max-w-sm flex-col bg-slate-950/95 p-5 text-white shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10">
                  <Shield className="h-5 w-5 text-[#A7E92F]" />
                </div>
                <span className="text-lg font-black uppercase tracking-tight text-[#A7E92F]">FarmMan</span>
              </Link>

              <button
                type="button"
                aria-label="Close site menu"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/15 bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-3 text-base font-semibold">
              <Link href="#features" onClick={() => setIsOpen(false)} className="rounded-2xl px-4 py-3 hover:bg-white/10">
                Features
              </Link>
              <Link href="#process" onClick={() => setIsOpen(false)} className="rounded-2xl px-4 py-3 hover:bg-white/10">
                How It Works
              </Link>
              <Link href="#impact" onClick={() => setIsOpen(false)} className="rounded-2xl px-4 py-3 hover:bg-white/10">
                Impact
              </Link>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              {currentUser ? (
                <div className="flex justify-start">
                  <SessionMenu
                    name={currentUser.name}
                    imageUrl={currentUser.profileImageUrl}
                    dashboardHref={dashboardHref}
                  />
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex w-full items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-4 py-3 font-semibold"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
