import axiosInstance from './axiosInstance'

export interface TeacherDashboardStatsResponse {
  totalLectures: number
  totalStudents: number
  correctRate: number
  totalDurationSeconds: number
}

export interface StudentDashboardStatsResponse {
  enrolledClasses: number
  watchedVideos: number
  averageScore: number
}

export async function getTeacherDashboardStats(): Promise<TeacherDashboardStatsResponse> {
  const res = await axiosInstance.get<TeacherDashboardStatsResponse>('/dashboard/teacher')
  return res.data
}

export async function getStudentDashboardStats(): Promise<StudentDashboardStatsResponse> {
  const res = await axiosInstance.get<StudentDashboardStatsResponse>('/dashboard/student')
  return res.data
}
