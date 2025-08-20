/**
 * @fileoverview HTTP请求工具类
 * @description 基于axios的HTTP客户端，包含请求/响应拦截器
 * @author 开发者
 * @created 2024-01-20
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios'

// API响应数据结构
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
  timestamp: string
}

// 请求配置接口
export interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean // 是否跳过全局错误处理
}

/**
 * HTTP客户端类
 */
class HttpClient {
  private instance: AxiosInstance

  constructor() {
    // 创建axios实例
    this.instance = axios.create({
      baseURL: '', // 使用相对路径，通过Vite代理转发到后端
      timeout: 10000, // 请求超时时间
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })

    // 设置请求拦截器
    this.setupRequestInterceptor()
    
    // 设置响应拦截器
    this.setupResponseInterceptor()
  }

  /**
   * 设置请求拦截器
   */
  private setupRequestInterceptor(): void {
    this.instance.interceptors.request.use(
      (config) => {
        // 在发送请求之前做些什么
        console.log('发送请求:', {
          url: config.url,
          method: config.method,
          data: config.data,
          params: config.params
        })

        // 添加JWT认证token
        const token = localStorage.getItem('token')
        if (token) {
          config.headers = config.headers || {}
          config.headers.Authorization = `Bearer ${token}`
        }

        // 确保Content-Type正确设置
        if (!config.headers['Content-Type'] && config.data) {
          config.headers['Content-Type'] = 'application/json'
        }

        return config
      },
      (error) => {
        // 对请求错误做些什么
        console.error('请求错误:', error)
        return Promise.reject(error)
      }
    )
  }

  /**
   * 设置响应拦截器
   */
  private setupResponseInterceptor(): void {
    this.instance.interceptors.response.use(
      (response: AxiosResponse<ApiResponse>) => {
        // 2xx 范围内的状态码都会触发该函数
        console.log('响应数据:', response.data)

        const { code, message, data } = response.data

        // 根据API文档的业务状态码处理响应
        if (code === 200 || code === 201) {
          // 成功响应，修改response.data为业务数据并返回response
          response.data = data
          return response
        } else {
          // 业务错误，抛出异常
          const error = new Error(message || '请求失败')
          error.name = 'BusinessError'
          // 添加错误码信息
          ;(error as any).code = code
          ;(error as any).data = data
          return Promise.reject(error)
        }
      },
      (error) => {
        // 超出 2xx 范围的状态码都会触发该函数
        console.error('响应错误:', error)

        let errorMessage = '网络错误，请稍后重试'

        if (error.response) {
          // 服务器响应了错误状态码
          const { status, data } = error.response
          
          // 根据API文档的状态码定义处理错误
          switch (status) {
            case 400:
              errorMessage = data?.message || '请求参数错误，请检查输入'
              break
            case 401:
              errorMessage = data?.message || '登录已过期，请重新登录'
              // 清除本地token并跳转到登录页
              localStorage.removeItem('token')
              localStorage.removeItem('user')
              localStorage.removeItem('rememberedEmail')
              
              // 自动跳转到登录页面，保存当前路径用于登录后重定向
              if (typeof window !== 'undefined') {
                const currentPath = window.location.pathname + window.location.search
                if (currentPath !== '/login') {
                  window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`
                }
              }
              break
            case 403:
              errorMessage = data?.message || '权限不足，无法访问该资源'
              break
            case 404:
              errorMessage = data?.message || '请求的资源不存在'
              break
            case 409:
              errorMessage = data?.message || '资源冲突，请检查数据'
              break
            case 423:
              errorMessage = data?.message || '账户已锁定，请联系管理员'
              break
            case 500:
              errorMessage = '服务器内部错误，请稍后重试'
              break
            default:
              errorMessage = data?.message || `请求失败 (状态码: ${status})`
          }
        } else if (error.request) {
          // 请求已发出但没有收到响应
          errorMessage = '网络连接超时，请检查网络设置'
        }

        // 创建统一的错误对象
        const customError = new Error(errorMessage)
        customError.name = 'HttpError'
        
        return Promise.reject(customError)
      }
    )
  }

  /**
   * GET请求
   */
  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  /**
   * POST请求
   */
  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  /**
   * PUT请求
   */
  put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  /**
   * DELETE请求
   */
  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }

  /**
   * PATCH请求
   */
  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.instance.patch(url, data, config)
  }

  /**
   * 获取axios实例（用于特殊需求）
   */
  getInstance(): AxiosInstance {
    return this.instance
  }
}

// 创建并导出HTTP客户端实例
export const http = new HttpClient()

// 导出默认实例的方法（便于使用）
export const { get, post, put, delete: del, patch } = http

export default http