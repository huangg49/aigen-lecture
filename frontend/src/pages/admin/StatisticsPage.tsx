import { useQuery } from '@tanstack/react-query'
import axiosInstance from '@/api/axiosInstance'
import { motion, type Variants } from 'framer-motion'
import { Users, BookOpen, BrainCircuit, TrendingUp, Loader2, Clock, Star } from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'

// ── TYPES ──────────────────────────────────────────────────────────────────────
interface StatisticsOverviewResponse {
  totalUsers?: number
  totalStudents?: number
  totalTeachers?: number
  totalLectures?: number
  totalAiGeneratedLectures?: number
  totalInteractions?: number
  llmCostUsd?: number
  serverUptime?: string
}

interface MonthlyUserGrowth { month: string; studentCount?: number; students?: number; teacherCount?: number; teachers?: number }
interface MonthlyLectureCount { month: string; totalLectures?: number; lectures?: number; aiGenerated?: number }
interface WeeklyInteraction { day: string; quiz?: number; quizzes?: number; flashcard?: number; flashcards?: number; note?: number; notes?: number }
interface RoleDistribution { roleName?: string; name?: string; count?: number; value?: number; color: string }

interface StatisticsChartsResponse {
  userGrowth: MonthlyUserGrowth[]
  lectureGrowth: MonthlyLectureCount[]
  weeklyInteractions: WeeklyInteraction[]
  roleDistribution: RoleDistribution[]
}

interface TopLectureDto {
  id: number
  name: string
  title?: string
  teacher: string
  views: number
  rating: number
}

// ── API CALLS ──────────────────────────────────────────────────────────────────
async function fetchOverview(): Promise<StatisticsOverviewResponse> {
  const res = await axiosInstance.get('/statistics/overview')
  return res.data
}

async function fetchCharts(): Promise<StatisticsChartsResponse> {
  const res = await axiosInstance.get('/statistics/charts')
  return res.data
}

async function fetchTopLectures(): Promise<TopLectureDto[]> {
  const res = await axiosInstance.get('/statistics/top-lectures')
  return res.data
}

// ── ANIMATION VARIANTS ────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function AnalyticsDashboard() {
  const { data: overview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['statistics-overview'],
    queryFn: fetchOverview,
  })

  const { data: charts, isLoading: isLoadingCharts } = useQuery({
    queryKey: ['statistics-charts'],
    queryFn: fetchCharts,
  })

  const { data: topLectures = [], isLoading: isLoadingTopLectures } = useQuery({
    queryKey: ['statistics-top-lectures'],
    queryFn: fetchTopLectures,
  })

  const stats = [
    {
      label: 'Tổng người dùng',
      value: isLoadingOverview ? '...' : (overview?.totalUsers || 0).toLocaleString('en-US'),
      desc: 'so với tháng trước',
      change: '+12.4%',
      isPositive: true,
      icon: Users,
      bg: 'bg-violet-500/10',
      color: 'text-violet-500',
    },
    {
      label: 'Bài giảng AI',
      value: isLoadingOverview ? '...' : (overview?.totalAiGeneratedLectures || 0).toLocaleString('en-US'),
      desc: 'tổng bài giảng đã tạo',
      change: '+28.5%',
      isPositive: true,
      icon: BookOpen,
      bg: 'bg-primary/10',
      color: 'text-primary',
    },
    {
      label: 'Chi phí LLM',
      value: isLoadingOverview ? '...' : `$${(overview?.llmCostUsd || 0).toFixed(2)}`,
      desc: 'tiết kiệm so với tháng trước',
      change: '-5.2%',
      isPositive: true,
      icon: BrainCircuit,
      bg: 'bg-emerald-500/10',
      color: 'text-emerald-500',
    },
    {
      label: 'Lượt tương tác',
      value: isLoadingOverview ? '...' : (overview?.totalInteractions || 0).toLocaleString('en-US'),
      desc: 'quiz + flashcard + ghi chú',
      change: '+18.7%',
      isPositive: true,
      icon: TrendingUp,
      bg: 'bg-amber-500/10',
      color: 'text-amber-500',
    },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card/90 backdrop-blur-sm border border-border/50 p-3 rounded-lg shadow-xl">
          <p className="font-semibold mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-foreground">{entry.value?.toLocaleString('en-US') || 0}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (isLoadingOverview || isLoadingCharts) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-6 max-w-7xl mx-auto pb-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants}>
        <p className="text-sm font-medium text-muted-foreground mb-1">Bảng điều khiển</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Thống kê & <span className="text-violet-500">Phân tích</span>
        </h1>
        <p className="text-muted-foreground mt-2">Tổng quan hiệu suất hệ thống EduMind — cập nhật thời gian thực.</p>
      </motion.div>

      {/* KPI CARDS */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="rounded-2xl border border-border/50 bg-card p-5 hover:border-violet-500/25 transition-colors shadow-sm"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon size={22} strokeWidth={2} />
              </div>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                stat.isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
              }`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-medium text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* CHARTS ROW 1 */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2 rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Tăng trưởng người dùng</h2>
            <p className="text-sm text-muted-foreground">Biến động học sinh & giáo viên theo tháng</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={charts?.userGrowth || []} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                {/* ĐÃ SỬA DATAKEY TẠI ĐÂY */}
                <Line type="monotone" name="Học sinh" dataKey={(d: any) => d.studentCount ?? d.students ?? 0} stroke="#a855f7" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" name="Giáo viên" dataKey={(d: any) => d.teacherCount ?? d.teachers ?? 0} stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl border border-border/50 bg-card p-6 flex flex-col shadow-sm">
          <div className="mb-2">
            <h2 className="text-lg font-bold">Phân bố vai trò</h2>
            <p className="text-sm text-muted-foreground">Tỉ lệ user theo vai trò</p>
          </div>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={charts?.roleDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey={(d: any) => d.count ?? d.value ?? 0}
                  nameKey={(d: any) => d.roleName ?? d.name ?? 'Unknown'}
                  stroke="none"
                >
                  {(charts?.roleDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-3">
            {(charts?.roleDistribution || []).map((role, idx) => {
              const roleName = role.roleName || role.name || 'Không rõ'
              const roleCount = role.count ?? role.value ?? 0
              
              return (
                <div key={idx} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }} />
                    <span className="text-muted-foreground">{roleName}</span>
                  </div>
                  <span className="font-bold text-foreground">{roleCount.toLocaleString('en-US')}</span>
                </div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>

      {/* CHARTS ROW 2 */}
      <motion.div variants={containerVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants} className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Bài giảng được tạo</h2>
            <p className="text-sm text-muted-foreground">Tổng vs AI-generated theo tháng</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.lectureGrowth || []} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="month" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                {/* ĐÃ SỬA DATAKEY TẠI ĐÂY */}
                <Bar name="Tổng bài giảng" dataKey={(d: any) => d.totalLectures ?? d.lectures ?? 0} fill="#6d28d9" radius={[4, 4, 0, 0]} />
                <Bar name="AI-Generated" dataKey={(d: any) => d.aiGenerated ?? 0} fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold">Tương tác trong tuần</h2>
            <p className="text-sm text-muted-foreground">Quiz, Flashcard & Ghi chú theo ngày</p>
          </div>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={charts?.weeklyInteractions || []} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="day" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                {/* ĐÃ SỬA DATAKEY TẠI ĐÂY */}
                <Bar name="Quiz" dataKey={(d: any) => d.quiz ?? d.quizzes ?? 0} fill="#a855f7" radius={[4, 4, 0, 0]} />
                <Bar name="Flashcard" dataKey={(d: any) => d.flashcard ?? d.flashcards ?? 0} fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar name="Ghi chú" dataKey={(d: any) => d.note ?? d.notes ?? 0} fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>

      {/* TOP LECTURES TABLE */}
      <motion.div variants={itemVariants} className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm">
        <div className="p-6 border-b border-border/50">
          <h2 className="text-lg font-bold">Top bài giảng nổi bật</h2>
          <p className="text-sm text-muted-foreground mt-1">5 bài giảng được xem nhiều nhất tháng này</p>
        </div>
        <div className="overflow-x-auto min-h-[200px] relative">
          {isLoadingTopLectures ? (
            <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/10">
                <tr>
                  <th className="px-6 py-4 font-semibold w-16">#</th>
                  <th className="px-6 py-4 font-semibold">Bài giảng</th>
                  <th className="px-6 py-4 font-semibold">Giáo viên</th>
                  <th className="px-6 py-4 font-semibold">
                    <div className="flex items-center gap-1"><Clock size={13} /> Lượt xem</div>
                  </th>
                  <th className="px-6 py-4 font-semibold">
                    <div className="flex items-center gap-1"><Star size={13} /> Đánh giá</div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {topLectures.length > 0 ? (
                  topLectures.map((lecture, index) => {
                    const lectureName = lecture.name || lecture.title || 'Bài giảng chưa có tên';
                    return (
                      <tr key={lecture.id || index} className="hover:bg-muted/5 transition-colors">
                        <td className="px-6 py-4">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-amber-500/20 text-amber-500' : 
                            index === 1 ? 'bg-slate-400/20 text-slate-400' :
                            index === 2 ? 'bg-amber-700/20 text-amber-600' : 'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-foreground">{lectureName}</td>
                        <td className="px-6 py-4 text-muted-foreground">{lecture.teacher}</td>
                        <td className="px-6 py-4 font-bold">{(lecture.views || 0).toLocaleString('en-US')}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-bold text-amber-500">
                            ★ {(lecture.rating || 0).toFixed(1)}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      Chưa có dữ liệu bài giảng.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}