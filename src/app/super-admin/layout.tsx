import Sidebar from "@/components/layout/sidebar"
import Header from "@/components/layout/header"

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen bg-slate-50 overflow-x-hidden lg:h-screen lg:overflow-hidden">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-violet-100/40 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />
      
      <Sidebar role="SUPER_ADMIN" />
      
      <div className="flex-1 min-w-0 flex flex-col z-10 relative">
        <Header title="Super Admin Override" role="SUPER_ADMIN" />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 pt-2 sm:p-6 sm:pt-4 lg:p-8 lg:pt-4">
          {children}
        </main>
      </div>
    </div>
  )
}
