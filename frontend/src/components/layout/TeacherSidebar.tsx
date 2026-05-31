import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Sparkles
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

const navItems = [
  {
    title: 'Tổng quan',
    href: '/teacher',
    icon: LayoutDashboard,
  },
  {
    title: 'Bài giảng của tôi',
    href: '/teacher/lectures',
    icon: BookOpen,
  },
  {
    title: 'Thống kê & Phân tích',
    href: '/teacher/analytics',
    icon: BarChart3,
  },
  {
    title: 'Cài đặt',
    href: '/teacher/settings',
    icon: Settings,
  },
]

export function TeacherSidebar() {
  const location = useLocation()
  const { logout } = useAuthStore()

  return (
    <aside className="hidden lg:flex h-screen w-72 flex-col fixed left-0 top-0 border-r border-border/50 bg-background/50 backdrop-blur-xl z-30">
      {/* Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <Link to="/teacher" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25 group-hover:scale-105 transition-transform">
            <Sparkles size={18} aria-hidden="true" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            Edu<span className="text-primary">Mind</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1.5 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-primary/10 text-primary font-semibold'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              }`}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <item.icon size={20} className={isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground transition-colors'} aria-hidden="true" />
              <span className="text-sm">{item.title}</span>
            </Link>
          )
        })}
      </div>

      {/* Footer Area (Logout) */}
      <div className="p-4 border-t border-border/50">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors group"
        >
          <LogOut size={20} className="group-hover:text-destructive transition-colors" aria-hidden="true" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  )
}
