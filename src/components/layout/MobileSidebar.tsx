"use client"

import Link from "next/link"
import { Menu, Shield, X, LogOut } from "lucide-react"
import { useEffect, useState } from "react"
import LogoutButton from "./LogoutButton"
import { navItemsByRole, type AppRole } from "./nav-config"

type MobileSidebarProps = {
  role: AppRole
}

export default function MobileSidebar({ role }: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const items = navItemsByRole[role]

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
        aria-label="Open navigation menu"
        onClick={() => setIsOpen(true)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/90 text-slate-700 shadow-sm transition hover:bg-white lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen ? (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button
            type="button"
            aria-label="Close navigation menu"
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <aside className="absolute left-0 top-0 flex h-full w-[88%] max-w-sm flex-col border-r border-white/30 bg-white/95 p-5 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3" onClick={() => setIsOpen(false)}>
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-sm font-bold text-white">
                  <Shield className="h-5 w-5" />
                </div>
                <span className="text-lg font-bold tracking-tight text-slate-800">
                  Agri<span className="text-primary">Insure</span>
                </span>
              </Link>

              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 flex-1 space-y-2 overflow-y-auto">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-2xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            <div className="border-t border-slate-200 pt-4">
              <LogoutButton
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-base font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Log Out</span>
              </LogoutButton>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  )
}
