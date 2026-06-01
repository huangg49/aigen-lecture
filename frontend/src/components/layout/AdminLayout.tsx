import type { ReactNode } from 'react'
import { AdminSidebar } from './AdminSidebar'
import { AdminHeader } from './AdminHeader'

interface AdminLayoutProps {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex selection:bg-violet-600/30">
      <AdminSidebar />
      <div className="flex-1 flex flex-col lg:pl-72 w-full transition-all duration-300">
        <AdminHeader />
        <main className="flex-1 p-4 lg:p-8 animate-in fade-in duration-500">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
