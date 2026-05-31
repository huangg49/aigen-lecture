import type { ReactNode } from 'react'
import { TeacherSidebar } from './TeacherSidebar'
import { TeacherHeader } from './TeacherHeader'

interface TeacherLayoutProps {
  children: ReactNode
}

export function TeacherLayout({ children }: TeacherLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Sidebar - fixed on large screens */}
      <TeacherSidebar />

      {/* Main Content Area - padded left on large screens to accommodate sidebar */}
      <div className="lg:pl-72 flex flex-col min-h-screen transition-all duration-300">
        <TeacherHeader />
        
        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 animate-in fade-in duration-500">
          {children}
        </main>
      </div>
    </div>
  )
}
