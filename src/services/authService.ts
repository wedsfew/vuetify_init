/**
 * @fileoverview 认证服务
 * @description 处理用户登录、认证等相关API请求
 * @author 开发团队
 * @created 2024-01-20
 */

import { http } from '@/utils/http';
import type { LoginRequest, LoginResponse, ApiResponse } from '@/types/auth';

/**
 * 认证服务类
 * 
 * @description 封装所有认证相关的API请求方法
 */
class AuthService {
  /**
   * 用户登录
   * @param credentials 登录凭据
   * @returns 登录响应
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await http.post<ApiResponse<LoginResponse>>('/api/auth/login', credentials);
    
    if (response.data) {
      // 存储认证信息到localStorage（与http.ts中的token获取保持一致）
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        id: response.data.id,
        username: response.data.username,
        email: response.data.email
      }));
      
      return response.data;
    }
    
    throw new Error('登录失败');
  }

  /**
   * 用户登出
   * 
   * @description 清除本地存储的认证信息
   */
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('用户已登出');
  }

  /**
   * 获取当前用户信息
   * 
   * @description 从本地存储获取用户信息
   * @returns 用户信息对象或null
   */
  getCurrentUser(): { id: number; username: string; email: string } | null {
    try {
      const userInfo = localStorage.getItem('user');
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.error('获取用户信息失败:', error);
      return null;
    }
  }

  /**
   * 获取认证令牌
   * 
   * @description 从本地存储获取JWT令牌
   * @returns JWT令牌字符串或null
   */
  getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * 检查用户是否已登录
   * 
   * @description 检查本地是否存在有效的认证令牌
   * @returns 是否已登录
   */
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const userInfo = this.getCurrentUser();
    return !!(token && userInfo);
  }
}

// 导出认证服务实例
export const authService = new AuthService();
export default authService;