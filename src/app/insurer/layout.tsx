import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"

export default function InsurerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative gradient blobs for premium glassmorphism background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-100/40 blur-3xl" />
      
      {/* Dashboard Sidebar */}
      <Sidebar role="INSURER" />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col z-10 relative">
        <Header title="Overview" />
        <main className="flex-1 overflow-y-auto p-8 pt-4">
          {children}
        </main>
      </div>
    </div>
  )
}
