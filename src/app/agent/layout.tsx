import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"

// Agent layout prioritizes a bottom-navigation or a responsive sidebar for mobile.
export default function AgentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-100/40 blur-3xl pointer-events-none" />
      
      {/* On mobile, this sidebar will be hidden by default (managed by Tailwind hidden classes) */}
      <Sidebar role="AGENT" />
      
      <div className="flex-1 flex flex-col z-10 relative">
        <Header title="Agent Field Portal" />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
