import axiosInstance from './axiosInstance';

// Định nghĩa kiểu dữ liệu (Interface) nếu cần cho chặt chẽ
export interface ForgotPasswordRequest {
  email: string;
}

export const forgotPasswordAPI = async (email: string) => {
  // Gọi xuống backend: POST http://localhost:8080/api/auth/forgot-password
  const response = await axiosInstance.post('/auth/forgot-password', { email });
  return response.data;
};