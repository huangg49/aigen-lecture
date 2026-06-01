import { Users, BookOpen, BrainCircuit, Activity, ArrowUpRight, Search, MoreVertical } from 'lucide-react'

const stats = [
  { 
    label: 'Tổng người dùng', 
    value: '1,248', 
    change: '+12%', 
    isPositive: true,
    icon: Users,
    bg: 'bg-violet-500/10',
    color: 'text-violet-500'
  },
  { 
    label: 'Bài giảng đã sinh', 
    value: '842', 
    change: '+24%', 
    isPositive: true,
    icon: BookOpen,
    bg: 'bg-blue-500/10',
    color: 'text-blue-500'
  },
  { 
    label: 'Chi phí LLM API', 
    value: '$142.50', 
    change: '-5%', 
    isPositive: true,
    icon: BrainCircuit,
    bg: 'bg-emerald-500/10',
    color: 'text-emerald-500'
  },
  { 
    label: 'Server Uptime', 
    value: '99.9%', 
    change: 'Ổn định', 
    isPositive: true,
    icon: Activity,
    bg: 'bg-amber-500/10',
    color: 'text-amber-500'
  },
]

const recentUsers = [
  { id: 'U-1029', name: 'Nguyễn Văn A', email: 'vana@edumind.vn', role: 'TEACHER', status: 'ACTIVE', date: 'Vừa xong' },
  { id: 'U-1028', name: 'Trần Thị B', email: 'thib@edumind.vn', role: 'STUDENT', status: 'ACTIVE', date: '5 phút trước' },
  { id: 'U-1027', name: 'Lê Hoàng C', email: 'hoangc@edumind.vn', role: 'STUDENT', status: 'INACTIVE', date: '1 giờ trước' },
  { id: 'U-1026', name: 'Phạm D', email: 'phamd@edumind.vn', role: 'TEACHER', status: 'ACTIVE', date: '2 giờ trước' },
  { id: 'U-1025', name: 'Hoàng E', email: 'hoange@edumind.vn', role: 'STUDENT', status: 'ACTIVE', date: 'Hôm qua' },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground mt-2">Theo dõi và quản lý mọi hoạt động trên nền tảng EduMind.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-violet-500/30 transition-all duration-300 group relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-gradient-to-br from-violet-500/5 to-transparent rounded-full blur-2xl group-hover:bg-violet-500/10 transition-colors" />
            <div className="flex items-start justify-between mb-4 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} strokeWidth={2} aria-hidden="true" />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'}`}>
                {stat.isPositive && stat.change !== 'Ổn định' ? <ArrowUpRight size={14} aria-hidden="true" /> : null}
                {stat.change}
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="text-sm font-medium text-muted-foreground">{stat.label}</h3>
              <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Users Table */}
      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Người dùng mới (US-09)</h2>
            <p className="text-sm text-muted-foreground mt-1">Danh sách đăng ký gần đây nhất.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-violet-600 transition-colors" aria-hidden="true" />
              <input 
                type="text" 
                aria-label="Tìm kiếm người dùng"
                placeholder="Tìm kiếm..." 
                className="h-9 pl-9 pr-4 w-full sm:w-64 bg-muted/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/30 transition-all"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20">
              <tr>
                <th className="px-6 py-4 font-semibold">Mã NV / HS</th>
                <th className="px-6 py-4 font-semibold">Họ tên & Email</th>
                <th className="px-6 py-4 font-semibold">Vai trò</th>
                <th className="px-6 py-4 font-semibold">Trạng thái</th>
                <th className="px-6 py-4 font-semibold">Thời gian</th>
                <th className="px-6 py-4 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/10 transition-colors group">
                  <td className="px-6 py-4 font-mono text-xs font-medium text-muted-foreground">{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground group-hover:text-violet-600 transition-colors">{user.name}</span>
                      <span className="text-xs text-muted-foreground mt-0.5">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-md text-xs font-semibold ${user.role === 'TEACHER' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-muted-foreground'}`} />
                      <span className="text-xs font-medium text-muted-foreground">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{user.date}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      aria-label={`Thao tác với ${user.name}`}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                    >
                      <MoreVertical size={16} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border/50 bg-muted/10 flex justify-center">
          <button className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors">
            Xem tất cả người dùng
          </button>
        </div>
      </div>
    </div>
  )
}