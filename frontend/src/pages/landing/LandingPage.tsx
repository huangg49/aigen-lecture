import { Link, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  Sparkles,
  FileText,
  BarChart3,
  ShieldCheck,
  Wand2,
  Clock,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { LoginModal } from '@/components/auth/LoginModal'

const features = [
  {
    icon: FileText,
    title: 'Doc to lecture nhanh',
    description: 'Upload PDF/DOCX, AI tự động trích xuất và tạo slide + quiz có cấu trúc chỉ trong nháy mắt.',
    delay: 'delay-100'
  },
  {
    icon: BarChart3,
    title: 'Tracking thời gian thực',
    description: 'Ghi log tương tác, điểm số, error rate để phân tích và cải tiến nội dung liên tục.',
    delay: 'delay-200'
  },
  {
    icon: ShieldCheck,
    title: 'Phân quyền rõ ràng',
    description: 'Teacher/Student/Admin tách biệt hoàn toàn, đảm bảo dữ liệu luôn được an toàn.',
    delay: 'delay-300'
  },
]

const stats = [
  { label: 'Thời gian tạo bài giảng', value: '< 15s' },
  { label: 'Câu hỏi mỗi bài', value: '5-20' },
  { label: 'Độ chính xác AI', value: '98%' },
]

const previewCards = [
  { 
    label: 'Slide 01', 
    labelColor: 'text-indigo-500', 
    iconColor: 'text-indigo-400', 
    hoverBorder: 'hover:border-indigo-500/40',
    delay: '',
    text: 'Mô hình hóa kiến thức thành danh sách ý chính', 
    Icon: Sparkles 
  },
  { 
    label: 'Interactive Quiz', 
    labelColor: 'text-violet-500', 
    iconColor: 'text-violet-400', 
    hoverBorder: 'hover:border-violet-500/40',
    delay: 'delay-100',
    text: 'Câu hỏi trắc nghiệm thông minh với 4 đáp án & feedback ngay', 
    Icon: Wand2 
  },
  { 
    label: 'AI Analytics', 
    labelColor: 'text-blue-500', 
    iconColor: 'text-blue-400', 
    hoverBorder: 'hover:border-blue-500/40',
    delay: 'delay-200',
    text: 'Heatmap lỗi sai và gợi ý cải tiến nội dung tự động', 
    Icon: BarChart3 
  },
]

export default function LandingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isLoginOpen = searchParams.get('login') === 'true'
  
  const handleOpenChange = (open: boolean) => {
    const newParams = new URLSearchParams(searchParams)
    if (!open) {
      newParams.delete('login')
    } else {
      newParams.set('login', 'true')
    }
    setSearchParams(newParams)
  }

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <LoginModal isOpen={isLoginOpen} onOpenChange={handleOpenChange} />
      
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
        <div className="absolute -top-[10%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-pulse [animation-duration:4s]" />
        <div className="absolute top-[20%] -right-[10%] w-[400px] h-[400px] rounded-full bg-indigo-500/20 blur-[100px] animate-pulse [animation-duration:5s]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[600px] h-[600px] rounded-full bg-violet-500/15 blur-[120px] animate-pulse [animation-duration:6s]" />
      </div>

      {/* Glassmorphism Header */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-indigo-600 shadow-lg shadow-primary/25 text-primary-foreground transition-transform group-hover:scale-105">
              <Sparkles size={18} className="animate-pulse" />
            </div>
            <div>
              <p className="text-base font-bold tracking-tight">EduMind</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">AI Lecture Studio</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:flex hover:bg-primary/10" asChild>
              <a href="#features">Tính năng</a>
            </Button>
            <Button variant="ghost" className="hidden md:flex hover:bg-primary/10" asChild>
              <a href="#workflow">Quy trình</a>
            </Button>
            <div className="w-px h-5 bg-border mx-1 hidden md:block" />
            <ThemeToggle />
            <Button variant="outline" className="border-border hover:bg-muted/50 hidden sm:flex" asChild>
              <Link to="/?login=true">Đăng nhập</Link>
            </Button>
            <Button className="bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 transition-all duration-300" asChild>
              <Link to="/?login=true">Bắt đầu miễn phí</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="relative z-10 mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-6 pt-32 pb-20 lg:grid-cols-[1.15fr_0.85fr] lg:pt-40 lg:pb-32">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary shadow-sm backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Wand2 size={16} className="animate-pulse" />
            <span>EduMind AI v2.0 đã ra mắt</span>
            <ChevronRight size={14} />
          </div>
          
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl lg:text-[4rem] lg:leading-[1.1] animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Bài giảng tương tác <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-indigo-500 to-violet-500">
              được tạo bởi AI.
            </span>
          </h1>
          
          <p className="max-w-[85%] text-lg text-muted-foreground md:text-xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 leading-relaxed">
            Biến tài liệu khô khan thành trải nghiệm học tập sinh động. Giáo viên upload tài liệu, AI tạo slide và quiz theo cấu trúc, học sinh tương tác và hệ thống tự động phân tích gợi ý cải tiến.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-7 duration-700 delay-300">
            <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:bg-primary/90 hover:-translate-y-1 transition-all duration-300" asChild>
              <Link to="/?login=true">
                Bắt đầu ngay <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base border-border bg-background/50 backdrop-blur hover:bg-muted/50 hover:-translate-y-1 transition-all duration-300" asChild>
              <a href="#workflow">Xem quy trình</a>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-border/50 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-1.5">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="relative animate-in fade-in zoom-in-95 duration-1000 delay-300">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-indigo-500/20 rounded-[2.5rem] blur-2xl" />
          <div className="relative rounded-[2.5rem] border border-border/50 bg-card/40 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-foreground/10 dark:ring-foreground/5">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div className="flex items-center gap-2" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                Live Preview
              </span>
            </div>
            
            <div className="mt-6 space-y-4">
              {previewCards.map((card) => (
                <div key={card.label} className={`group rounded-2xl border border-border/50 bg-background/80 p-5 shadow-sm transition-all duration-500 hover:shadow-md ${card.hoverBorder} hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 ${card.delay}`}>
                  <div className="flex items-center justify-between mb-2">
                    <p className={`text-[11px] font-bold uppercase tracking-wider ${card.labelColor}`}>{card.label}</p>
                    <card.Icon size={14} className={`${card.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`} />
                  </div>
                  <p className="text-sm font-semibold text-foreground">
                    {card.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Features Section */}
      <section id="features" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
        <div className="text-center mb-16 space-y-4">
          <p className="text-sm font-bold text-primary uppercase tracking-widest">Sức mạnh của AI</p>
          <h2 className="text-3xl font-bold md:text-4xl">Hơn cả một bài giảng thông thường</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className={`group relative rounded-[2rem] border border-border/50 bg-card/30 p-8 shadow-sm backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:border-primary/40 hover:bg-card/60 animate-in fade-in slide-in-from-bottom-8 ${feature.delay}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem]" />
              <div className="relative z-10">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-border/50 text-primary shadow-inner transition-transform duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon size={20} aria-hidden="true" />
                </div>
                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="relative z-10 mx-auto w-full max-w-6xl px-6 py-20">
        <div className="grid gap-12 rounded-[2.5rem] border border-border/50 bg-card/40 p-8 md:p-12 shadow-xl backdrop-blur-xl lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest">Quy trình 3 bước</p>
            <h2 className="text-3xl font-bold md:text-4xl tracking-tight">
              Tạo bài giảng tương tác chưa bao giờ dễ dàng đến thế
            </h2>
            <ol className="mt-8 space-y-8">
              {[
                { title: 'Upload tài liệu', desc: 'Hệ thống trích xuất nội dung và chia chunk thông minh.' },
                { title: 'AI Sinh nội dung', desc: 'Tạo slide + quiz có cấu trúc, giáo viên duyệt và chỉnh sửa.' },
                { title: 'Học sinh tương tác', desc: 'Hệ thống phân tích và gợi ý cải tiến nội dung tự động.' }
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-5 group">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-sm ring-1 ring-primary/20 transition-all group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold">{step.title}</h4>
                    <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-5 flex flex-col justify-center">
            <div className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-background/60 p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-500 transition-transform group-hover:scale-110">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-base font-bold">Nhanh & Ổn định</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Streaming response, tối ưu trải nghiệm cho giáo viên.
                </p>
              </div>
            </div>
            <div className="group flex items-center gap-4 rounded-2xl border border-border/50 bg-background/60 p-5 shadow-sm transition-all hover:shadow-md hover:border-violet-500/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-500 transition-transform group-hover:scale-110">
                <Sparkles size={24} />
              </div>
              <div>
                <p className="text-base font-bold">Tự động gợi ý cải tiến</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Dựa trên error rate và hành vi học tập của học sinh.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
