import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore, type Role } from '@/store/authStore'

import LandingPage from '@/pages/landing/LandingPage'
import TeacherDashboard from '@/pages/teacher/DashboardPage'
import { TeacherLayout } from '@/components/layout/TeacherLayout'
import StudentDashboard from '@/pages/student/DashboardPage'
import AdminDashboard from '@/pages/admin/DashboardPage'

/**
 * ProtectedRoute — guards routes by authentication status and role.
 * - Unauthenticated users → redirect to login
 * - Authenticated but wrong role → redirect to home (403-like behavior)
 */
function ProtectedRoute({ children, role }: { children: React.ReactNode; role: Role }) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) return <Navigate to="/?login=true" replace />
  if (user?.role !== role) return <Navigate to="/" replace />

  return <>{children}</>
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Navigate to="/?login=true" />} />

        <Route path="/teacher/*" element={
          <ProtectedRoute role="TEACHER">
            <TeacherLayout>
              <Routes>
                <Route path="" element={<TeacherDashboard />} />
                {/* Các sub-routes khác của teacher sẽ thêm vào đây */}
              </Routes>
            </TeacherLayout>
          </ProtectedRoute>
        } />

        <Route path="/student/*" element={
          <ProtectedRoute role="STUDENT">
            <StudentDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/*" element={
          <ProtectedRoute role="ADMIN">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}