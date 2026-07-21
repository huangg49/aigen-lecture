import React, { useState } from 'react';
import axios from 'axios';
import { forgotPasswordAPI } from '@/api/authApi';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      await forgotPasswordAPI(email);
      setMessage('Chúng tôi đã gửi mã khôi phục. Vui lòng kiểm tra email của bạn!');
      setEmail('');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại.');
      } else {
        setError('Đã xảy ra lỗi không xác định.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800">Quên mật khẩu</h2>
        <p className="text-sm text-center text-gray-600">
          Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn khôi phục.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
              placeholder="nhapemail@example.com"
            />
          </div>

          {/* Hiển thị thông báo thành công hoặc lỗi */}
          {message && <div className="p-3 text-sm text-green-700 bg-green-100 rounded">{message}</div>}
          {error && <div className="p-3 text-sm text-red-700 bg-red-100 rounded">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </button>
        </form>
      </div>
    </div>
  );
}