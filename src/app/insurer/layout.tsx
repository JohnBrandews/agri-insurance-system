import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"

export default function InsurerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen bg-slate-50 overflow-x-hidden lg:h-screen lg:overflow-hidden">
      {/* Decorative gradient blobs for premium glassmorphism background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[40%] rounded-full bg-indigo-100/40 blur-3xl" />
      
      {/* Dashboard Sidebar */}
      <Sidebar role="INSURER" />
      
      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col z-10 relative">
        <Header title="Overview" role="INSURER" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 pt-2 sm:p-6 sm:pt-4 lg:p-8 lg:pt-4">
          {children}
        </main>
      </div>
    </div>
  )
}
