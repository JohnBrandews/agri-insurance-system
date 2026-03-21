import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-slate-50 relative overflow-hidden">
      <div className="absolute top-[30%] left-[-20%] w-[60%] h-[60%] rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />
      
      <Sidebar role="FARMER" />
      
      <div className="flex-1 flex flex-col z-10 relative">
        <Header title="My Farm Portal" />
        <main className="flex-1 overflow-y-auto px-4 py-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
