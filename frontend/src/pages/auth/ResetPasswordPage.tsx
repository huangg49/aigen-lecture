import { useState, forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axiosInstance from "@/api/axiosInstance";
import axios from "axios";

// ─── Schema Validate ────────────────────────────────────────────────────────
const resetSchema = z.object({
  password: z.string().min(8, "Mật khẩu tối thiểu 8 ký tự"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"],
});

type ResetForm = z.infer<typeof resetSchema>;

// ─── Shared Styles (Lấy từ giao diện cũ cho đồng bộ) ────────────────────────
const inputClass = "h-11 bg-muted/20 border-border/60 focus-visible:ring-primary/30 transition-all rounded-xl";
const submitBtnClass = "w-full h-11 mt-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all duration-300 font-semibold";

// ─── Field Wrapper ──────────────────────────────────────────────────────────
function Field({ label, error, htmlFor, children }: { label: string; error?: string; htmlFor?: string; children: ReactNode; }) {
  return (
    <div className="flex flex-col gap-1.5 group">
      <label htmlFor={htmlFor} className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
        {label}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-destructive mt-0.5">{error}</p>}
    </div>
  );
}

// ─── Password Input ─────────────────────────────────────────────────────────
const PasswordInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ placeholder, ...props }, ref) => {
    const [show, setShow] = useState(false);
    return (
      <div className="relative">
        <Input
          ref={ref}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className={inputClass}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
          aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

// ─── Main Page Component ────────────────────────────────────────────────────
export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  
  const [success, setSuccess] = useState(false);
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  // Nếu không có token trên URL, chặn luôn không cho đổi
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 rounded-[2rem] border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl text-center flex flex-col items-center gap-4">
          <AlertCircle size={48} className="text-destructive" />
          <h2 className="text-2xl font-bold text-foreground">Liên kết không hợp lệ</h2>
          <p className="text-muted-foreground">Đường dẫn đặt lại mật khẩu đã hỏng hoặc không tồn tại. Vui lòng yêu cầu cấp lại link mới.</p>
          <Link to="/?login=true" className={submitBtnClass + " flex items-center justify-center mt-4"}>
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: ResetForm) => {
    setApiError("");
    try {
      // GỌI API BACKEND: Truyền token và mật khẩu mới
      // Nhớ đảm bảo Backend của bạn đang nhận 2 tham số này trong body (DTO)
      await axiosInstance.post("/auth/reset-password", {
        token: token,
        newPassword: data.password,
      });
      
      setSuccess(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setApiError(error.response?.data?.message || "Mã xác nhận đã hết hạn hoặc không hợp lệ.");
      } else {
        setApiError("Có lỗi xảy ra khi kết nối đến máy chủ.");
      }
    }
  };

  // Giao diện khi đổi mật khẩu thành công
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full p-8 rounded-[2rem] border border-border/50 bg-background/50 backdrop-blur-xl shadow-2xl flex flex-col items-center text-center gap-5 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center border border-green-500/20">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Đổi mật khẩu thành công!</h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Tài khoản của bạn đã được cập nhật mật khẩu mới. Bây giờ bạn có thể đăng nhập để tiếp tục sử dụng EduMind.
            </p>
          </div>
          <Link to="/?login=true" className={submitBtnClass + " flex items-center justify-center w-full"}>
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  // Giao diện form nhập mật khẩu
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background shapes trang trí */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl animate-pulse" />

      <div className="max-w-md w-full p-8 sm:p-10 rounded-[2rem] border border-border/50 bg-background/60 backdrop-blur-2xl shadow-2xl relative z-10">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="mb-2">
            <h2 className="text-3xl font-bold text-foreground tracking-tight">
              Tạo mật khẩu mới
            </h2>
            <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
              Vui lòng nhập mật khẩu mới cho tài khoản của bạn. Đảm bảo mật khẩu đủ mạnh và dễ nhớ.
            </p>
          </div>

          {apiError && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
              <AlertCircle size={16} />
              {apiError}
            </div>
          )}

          <Field label="Mật khẩu mới" error={errors.password?.message} htmlFor="new-password">
            <PasswordInput
              id="new-password"
              placeholder="Tối thiểu 8 ký tự"
              {...register("password")}
            />
          </Field>

          <Field label="Xác nhận mật khẩu" error={errors.confirmPassword?.message} htmlFor="confirm-password">
            <PasswordInput
              id="confirm-password"
              placeholder="Nhập lại mật khẩu mới"
              {...register("confirmPassword")}
            />
          </Field>

          <Button type="submit" disabled={isSubmitting} className={submitBtnClass + " mt-4"}>
            {isSubmitting ? "Đang xử lý..." : "Cập nhật mật khẩu"}
          </Button>
        </form>
      </div>
    </div>
  );
}