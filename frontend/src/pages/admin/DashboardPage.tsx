import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '@/api/axiosInstance'
import { 
  Users, BookOpen, BrainCircuit, Activity, 
  ArrowUpRight, ArrowDownRight, Search, 
  MoreVertical, Loader2, UserX, UserCheck, Shield, ShieldOff 
} from 'lucide-react'
import { motion, type Variants } from 'framer-motion'

// ── TYPES ──────────────────────────────────────────────────────────────────────
interface StatisticsOverviewResponse {
  totalUsers: number
  totalStudents: number
  totalTeachers: number
  totalLectures: number
  totalAiGeneratedLectures: number
  totalInteractions: number
  llmCostUsd: number
  serverUptime: string
}

interface UserDto {
  userId?: number
  id?: number | string
  name?: string
  fullName?: string
  email: string
  role: string
  status: string
  createdAt?: string 
}

// ── API CALLS ──────────────────────────────────────────────────────────────────
async function fetchOverview(): Promise<StatisticsOverviewResponse> {
  const res = await axiosInstance.get('/statistics/overview')
  return res.data
}

async function fetchRecentUsers(): Promise<UserDto[]> {
  const res = await axiosInstance.get('/admin/users', {
    params: { page: 0, size: 5, sort: 'createdAt,desc' }
  })
  return res.data?.content || res.data?.data?.content || res.data?.data || res.data || []
}

async function patchUser(params: {
  userId: number
  status?: string
  role?: string
}): Promise<UserDto> {
  const { userId, ...body } = params
  const res = await axiosInstance.patch(`/admin/users/${userId}`, body)
  return res.data
}

// ── HELPERS ───────────────────────────────────────────────────────────────────
function timeAgo(dateString?: string) {
  if (!dateString) return 'Không rõ'
  const date = new Date(dateString)
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
  
  if (seconds < 60) return 'Vừa xong'
  
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} phút trước`
  
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} giờ trước`
  
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} ngày trước`
  
  return new Intl.DateTimeFormat('vi-VN').format(date)
}

const getRoleConfig = (roleStr?: string) => {
  const role = (roleStr || '').replace('ROLE_', '').toUpperCase()
  switch (role) {
    case 'ADMIN':
      return { label: 'Admin', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', avatar: 'bg-amber-500' }
    case 'TEACHER':
      return { label: 'Giáo viên', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20', avatar: 'bg-violet-500' }
    case 'STUDENT':
    default:
      return { label: 'Học sinh', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', avatar: 'bg-emerald-500' }
  }
}

const getStatusConfig = (statusStr?: string) => {
  const status = (statusStr || '').toUpperCase()
  if (status === 'ACTIVE') {
    return { label: 'Hoạt động', dot: 'bg-emerald-500 animate-glow-pulse', text: 'text-emerald-500' }
  }
  return { label: 'Bị khoá', dot: 'bg-destructive', text: 'text-destructive' }
}

// ── ANIMATION VARIANTS ────────────────────────────────────────────────────────
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  
  const [openMenuId, setOpenMenuId] = useState<string | number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null)
    window.addEventListener('click', handleClickOutside)
    return () => window.removeEventListener('click', handleClickOutside)
  }, [])
  
  const { data: overview, isLoading: isLoadingOverview } = useQuery({
    queryKey: ['statistics-overview'],
    queryFn: fetchOverview,
  })

  const { data: recentUsers = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['recent-users'],
    queryFn: fetchRecentUsers,
  })

  // Lọc danh sách user theo tên hoặc email
  const filteredUsers = recentUsers.filter((user) => {
    const name = (user.name || user.fullName || '').toLowerCase()
    const email = (user.email || '').toLowerCase()
    const query = searchTerm.toLowerCase()
    return name.includes(query) || email.includes(query)
  })

  const patchMutation = useMutation({
    mutationFn: patchUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recent-users'] })
      queryClient.invalidateQueries({ queryKey: ['statistics-overview'] })
    },
  })

  const stats = [
    {
      label: 'Tổng người dùng',
      value: isLoadingOverview ? '...' : overview?.totalUsers.toLocaleString('en-US') || '0',
      change: '+12%',
      isPositive: true,
      icon: Users,
      bg: 'bg-violet-500/10 dark:bg-violet-500/15',
      color: 'text-violet-500',
    },
    {
      label: 'Bài giảng đã sinh',
      value: isLoadingOverview ? '...' : overview?.totalLectures.toLocaleString('en-US') || '0',
      change: '+24%',
      isPositive: true,
      icon: BookOpen,
      bg: 'bg-primary/10 dark:bg-primary/15',
      color: 'text-primary',
    },
    {
      label: 'Chi phí LLM API',
      value: isLoadingOverview ? '...' : `$${(overview?.llmCostUsd || 0).toFixed(2)}`,
      change: '-5%',
      isPositive: true,
      icon: BrainCircuit,
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
      color: 'text-emerald-500',
    },
    {
      label: 'Server Uptime',
      value: isLoadingOverview ? '...' : overview?.serverUptime || '99.9%',
      change: 'Ổn định',
      isPositive: true,
      icon: Activity,
      bg: 'bg-amber-500/10 dark:bg-amber-500/15',
      color: 'text-amber-500',
    },
  ]

  const toggleActionMenu = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation()
    setOpenMenuId(openMenuId === id ? null : id)
  }

  return (
    <motion.div
      className="space-y-6 max-w-7xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ── HEADER ── */}
      <motion.div variants={itemVariants}>
        <p className="text-sm font-medium text-muted-foreground mb-1">Tổng quan hệ thống</p>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Admin <span className="text-violet-500">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-2">Theo dõi và quản lý mọi hoạt động trên nền tảng EduMind.</p>
      </motion.div>

      {/* ── STATS GRID ── */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            className="relative overflow-hidden rounded-2xl border border-border/50 bg-card dark:bg-card/70 dark:backdrop-blur-sm p-5
              hover:border-violet-500/25 hover:shadow-lg transition-shadow duration-300 group cursor-default"
          >
            <div className="absolute -right-6 -top-6 w-20 h-20 rounded-full bg-gradient-to-br from-violet-500/8 to-transparent blur-2xl
              group-hover:from-violet-500/15 transition-colors duration-500" />

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon size={22} strokeWidth={2} aria-hidden="true" />
                </div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  stat.change === 'Ổn định'
                    ? 'bg-muted text-muted-foreground'
                    : stat.isPositive
                    ? 'bg-emerald-500/10 text-emerald-500'
                    : 'bg-destructive/10 text-destructive'
                }`}>
                  {stat.change !== 'Ổn định' && stat.isPositive && <ArrowUpRight size={12} />}
                  {stat.change !== 'Ổn định' && !stat.isPositive && <ArrowDownRight size={12} />}
                  {stat.change}
                </span>
              </div>
              <p className="text-xs font-medium text-muted-foreground mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold text-foreground ${isLoadingOverview ? 'animate-pulse' : ''}`}>
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── USERS TABLE ── */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl border border-border/50 bg-card dark:bg-card/70 dark:backdrop-blur-sm shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Người dùng mới đăng ký</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Danh sách đăng ký gần đây nhất</p>
          </div>
          <div className="relative group">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" aria-hidden="true" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Tìm kiếm người dùng"
              placeholder="Tìm kiếm người dùng..."
              className="h-9 pl-9 pr-4 w-full sm:w-64 bg-muted/30 border border-border/50 rounded-xl text-sm
                focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/40 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[250px] relative">
          {isLoadingUsers ? (
            <div className="absolute inset-0 flex items-center justify-center bg-card/50 backdrop-blur-sm z-10">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/20 dark:bg-muted/10">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Mã</th>
                  <th className="px-6 py-3.5 font-semibold">Họ tên & Email</th>
                  <th className="px-6 py-3.5 font-semibold">Vai trò</th>
                  <th className="px-6 py-3.5 font-semibold">Trạng thái</th>
                  <th className="px-6 py-3.5 font-semibold hidden md:table-cell">Thời gian</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => {
                    const actualUserId = user.userId || (user.id as number)
                    
                    const displayName = user.name || user.fullName || 'Người dùng ẩn danh'
                    const displayAvatar = displayName.charAt(0).toUpperCase()
                    const formattedId = actualUserId ? `U-${String(actualUserId).padStart(4, '0')}` : '—'
                    
                    const roleConfig = getRoleConfig(user.role)
                    const statusConfig = getStatusConfig(user.status)
                    const isAdmin = roleConfig.label === 'Admin' 

                    const menuKey = actualUserId ?? `user-${index}`
                    const isStatusActive = (user.status || '').toUpperCase() === 'ACTIVE'
                    const isRoleStudent = roleConfig.label === 'Học sinh'

                    return (
                      <tr key={menuKey} className="hover:bg-muted/10 dark:hover:bg-muted/8 transition-colors group">
                        <td className="px-6 py-4 font-mono text-xs font-medium text-muted-foreground">{formattedId}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${roleConfig.avatar}`}>
                              {displayAvatar}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-semibold text-foreground group-hover:text-violet-400 transition-colors">{displayName}</span>
                              <span className="text-xs text-muted-foreground">{user.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${roleConfig.color}`}>
                            {roleConfig.label}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
                            <span className={`text-xs font-medium ${statusConfig.text}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs hidden md:table-cell">
                          {timeAgo(user.createdAt)}
                        </td>
                        
                        {/* ── ACTION COLUMN W/ POPUP ── */}
                        <td className="px-6 py-4 text-right relative">
                          {!isAdmin && (
                            <>
                              <button
                                onClick={(e) => toggleActionMenu(menuKey, e)}
                                aria-label={`Thao tác với ${displayName}`}
                                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                              >
                                <MoreVertical size={15} aria-hidden="true" />
                              </button>
                              
                              {/* Dropdown Menu */}
                              {openMenuId === menuKey && (
                                <div 
                                  className={`absolute right-8 w-48 bg-[#1a1c23] dark:bg-card border border-border/50 rounded-xl shadow-xl overflow-hidden z-50 py-1
                                    ${index >= filteredUsers.length - 2 && filteredUsers.length > 3 ? 'bottom-8' : 'top-10'}
                                  `}
                                  onClick={(e) => e.stopPropagation()} 
                                >
                                  {/* Thay đổi trạng thái khóa / mở khóa */}
                                  <button 
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-muted/50 flex items-center gap-3 transition-colors ${
                                      isStatusActive ? 'text-destructive' : 'text-emerald-500'
                                    }`}
                                    onClick={() => {
                                      if (actualUserId) {
                                        patchMutation.mutate({
                                          userId: actualUserId,
                                          status: isStatusActive ? 'INACTIVE' : 'ACTIVE'
                                        })
                                      }
                                      setOpenMenuId(null)
                                    }}
                                  >
                                    {isStatusActive ? <UserX size={15} /> : <UserCheck size={15} />}
                                    <span className="font-medium">
                                      {isStatusActive ? 'Khoá tài khoản' : 'Mở khoá tài khoản'}
                                    </span>
                                  </button>
                                  
                                  {/* Thay đổi quyền */}
                                  <button 
                                    className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 flex items-center gap-3 transition-colors border-t border-border/40"
                                    onClick={() => {
                                      if (actualUserId) {
                                        patchMutation.mutate({
                                          userId: actualUserId,
                                          role: isRoleStudent ? 'TEACHER' : 'STUDENT'
                                        })
                                      }
                                      setOpenMenuId(null)
                                    }}
                                  >
                                    {isRoleStudent ? <Shield size={15} className="text-primary"/> : <ShieldOff size={15} className="text-emerald-500"/>}
                                    <span className="font-medium">
                                      Đổi thành {isRoleStudent ? 'Giáo viên' : 'Học sinh'}
                                    </span>
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-muted-foreground">
                      Không tìm thấy người dùng phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        <div className="p-4 border-t border-border/40 bg-muted/10 dark:bg-muted/5 flex justify-center">
          <button 
            onClick={() => navigate('/admin/users')}
            className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors hover:underline underline-offset-4"
          >
            Xem tất cả người dùng
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}