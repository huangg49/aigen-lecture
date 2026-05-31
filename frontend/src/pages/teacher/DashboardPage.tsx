import { FileUp, BookOpen, Users, CheckCircle, Clock, Sparkles, ChevronRight, MoreVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

// Giả lập dữ liệu
const stats = [
  {
    title: 'Tổng số bài giảng',
    value: '12',
    icon: BookOpen,
    trend: '+2 tuần này',
    trendUp: true,
    color: 'text-primary',
    bg: 'bg-primary/10'
  },
  {
    title: 'Học sinh tham gia',
    value: '348',
    icon: Users,
    trend: '+12% tuần này',
    trendUp: true,
    color: 'text-chart-1',
    bg: 'bg-chart-1/10'
  },
  {
    title: 'Tỉ lệ làm đúng',
    value: '76%',
    icon: CheckCircle,
    trend: '+4% so với trước',
    trendUp: true,
    color: 'text-chart-2',
    bg: 'bg-chart-2/10'
  },
  {
    title: 'Giờ giảng dạy',
    value: '24h',
    icon: Clock,
    trend: 'Ổn định',
    trendUp: true,
    color: 'text-chart-3',
    bg: 'bg-chart-3/10'
  }
]

const recentLectures = [
  {
    id: 1,
    title: 'Hệ Tiêu Hóa Của Con Người',
    date: 'Hôm nay, 09:41',
    status: 'active',
    students: 45,
    questions: 15
  },
  {
    id: 2,
    title: 'Vật Lý Lượng Tử Cơ Bản',
    date: 'Hôm qua, 14:20',
    status: 'draft',
    students: 0,
    questions: 10
  },
  {
    id: 3,
    title: 'Lịch Sử Việt Nam - Thế Kỷ 20',
    date: '28/05/2026',
    status: 'active',
    students: 120,
    questions: 20
  },
  {
    id: 4,
    title: 'Phân Tích Cấu Trúc DNA',
    date: '25/05/2026',
    status: 'active',
    students: 89,
    questions: 12
  }
]

export default function TeacherDashboard() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Tổng quan</h1>
          <p className="text-muted-foreground mt-1">Chào mừng trở lại! Dưới đây là thống kê bài giảng của bạn.</p>
        </div>
      </div>

      {/* Hero Upload CTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-8 sm:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none" aria-hidden="true">
          <Sparkles className="w-64 h-64 text-primary animate-pulse [animation-duration:4s]" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-6">
            <Sparkles size={16} aria-hidden="true" />
            AI Lecture Generation
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">
            Tạo bài giảng tương tác <br className="hidden sm:block" /> chỉ trong 15 giây
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl">
            Tải lên tài liệu PDF hoặc Word, AI của EduMind sẽ tự động trích xuất nội dung và sinh ra Slide kèm bộ câu hỏi trắc nghiệm thông minh.
          </p>
          
          <Button size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/25 hover:-translate-y-1 transition-all duration-300 text-base font-semibold group">
            <FileUp className="mr-2 h-5 w-5 group-hover:-translate-y-1 transition-transform" aria-hidden="true" />
            Tải lên tài liệu (PDF/DOCX)
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon size={24} strokeWidth={2} aria-hidden="true" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-foreground tracking-tight">{stat.value}</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-border/50">
              <span className={`text-xs font-medium ${stat.trendUp ? 'text-chart-2' : 'text-destructive'}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Lectures */}
      <div className="bg-card border border-border/50 rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
        <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">Bài giảng gần đây</h2>
            <p className="text-sm text-muted-foreground mt-1">Quản lý và chỉnh sửa các bài giảng đã tạo</p>
          </div>
          <Link to="/teacher/lectures" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
            Xem tất cả <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30">
                <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tên bài giảng</th>
                <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Trạng thái</th>
                <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Số lượng</th>
                <th className="py-4 px-6 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Ngày tạo</th>
                <th className="py-4 px-6 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {recentLectures.map((lecture) => (
                <tr key={lecture.id} className="hover:bg-muted/20 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="font-semibold text-foreground">{lecture.title}</div>
                    <div className="text-sm text-muted-foreground md:hidden mt-1">{lecture.date}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      lecture.status === 'active' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${lecture.status === 'active' ? 'bg-primary' : 'bg-muted-foreground'}`}></span>
                      {lecture.status === 'active' ? 'Đang hoạt động' : 'Bản nháp'}
                    </span>
                  </td>
                  <td className="py-4 px-6 hidden sm:table-cell">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{lecture.students}</span> học sinh
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {lecture.questions} câu hỏi
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-muted-foreground hidden md:table-cell">
                    {lecture.date}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100" aria-label="More options">
                      <MoreVertical size={18} aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}