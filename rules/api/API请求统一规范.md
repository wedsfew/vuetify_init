# API 请求统一规范

## 概述

本文档定义了前端应用与后端API交互的统一规范，包括请求格式、响应处理、错误处理、认证机制等标准化要求。遵循本规范可确保API调用的一致性、可维护性和可靠性。

## 基础配置

### API 基础信息

```typescript
/**
 * API 基础配置常量
 */
export const API_CONFIG = {
  /** API 基础 URL */
  BASE_URL: 'http://localhost:8080/api/v1',
  /** 请求超时时间（毫秒） */
  TIMEOUT: 10000,
  /** 内容类型 */
  CONTENT_TYPE: 'application/json',
  /** 字符编码 */
  CHARSET: 'UTF-8'
} as const;
```

### 请求头规范

```typescript
/**
 * 标准请求头接口
 */
interface ApiHeaders {
  /** 内容类型 */
  'Content-Type': string;
  /** 认证令牌 */
  'Authorization'?: string;
  /** 请求ID（用于追踪） */
  'X-Request-ID'?: string;
}

/**
 * 获取标准请求头
 * @param token JWT令牌
 * @returns 标准请求头对象
 */
function getStandardHeaders(token?: string): ApiHeaders {
  const headers: ApiHeaders = {
    'Content-Type': API_CONFIG.CONTENT_TYPE
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // 生成请求ID用于追踪
  headers['X-Request-ID'] = generateRequestId();
  
  return headers;
}
```

## 统一响应格式

### 响应数据结构

```typescript
/**
 * API 统一响应格式
 * @template T 响应数据类型
 */
interface ApiResponse<T = any> {
  /** 业务状态码 */
  code: number;
  /** 响应描述信息 */
  message: string;
  /** 响应数据 */
  data: T | null;
  /** 服务器响应时间戳 */
  timestamp: string;
}

/**
 * 分页响应数据结构
 * @template T 列表项数据类型
 */
interface PaginatedResponse<T> {
  /** 数据列表 */
  items: T[];
  /** 总记录数 */
  total: number;
  /** 当前页码 */
  page: number;
  /** 每页大小 */
  pageSize: number;
  /** 总页数 */
  totalPages: number;
}
```

### 状态码规范

```typescript
/**
 * API 状态码枚举
 */
export enum ApiStatusCode {
  /** 成功 */
  SUCCESS = 200,
  /** 创建成功 */
  CREATED = 201,
  /** 请求错误 */
  BAD_REQUEST = 400,
  /** 未授权 */
  UNAUTHORIZED = 401,
  /** 禁止访问 */
  FORBIDDEN = 403,
  /** 资源不存在 */
  NOT_FOUND = 404,
  /** 资源冲突 */
  CONFLICT = 409,
  /** 账户锁定 */
  LOCKED = 423,
  /** 服务器错误 */
  INTERNAL_ERROR = 500
}

/**
 * 状态码处理映射
 */
export const STATUS_CODE_HANDLERS = {
  [ApiStatusCode.SUCCESS]: (response: ApiResponse) => response.data,
  [ApiStatusCode.CREATED]: (response: ApiResponse) => response.data,
  [ApiStatusCode.BAD_REQUEST]: (response: ApiResponse) => {
    throw new ValidationError(response.message, response.data);
  },
  [ApiStatusCode.UNAUTHORIZED]: (response: ApiResponse) => {
    // 清除本地token，跳转登录页
    clearAuthToken();
    redirectToLogin();
    throw new AuthenticationError(response.message);
  },
  [ApiStatusCode.FORBIDDEN]: (response: ApiResponse) => {
    throw new AuthorizationError(response.message);
  },
  [ApiStatusCode.NOT_FOUND]: (response: ApiResponse) => {
    throw new NotFoundError(response.message);
  },
  [ApiStatusCode.CONFLICT]: (response: ApiResponse) => {
    throw new ConflictError(response.message, response.data);
  },
  [ApiStatusCode.LOCKED]: (response: ApiResponse) => {
    throw new AccountLockedError(response.message);
  },
  [ApiStatusCode.INTERNAL_ERROR]: (response: ApiResponse) => {
    throw new ServerError(response.message);
  }
};
```

## 请求方法规范

### HTTP 方法使用规范

```typescript
/**
 * HTTP 方法枚举
 */
export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE'
}

/**
 * RESTful API 方法使用规范
 */
export const REST_METHOD_USAGE = {
  /** 查询数据 - 获取资源列表或单个资源 */
  [HttpMethod.GET]: {
    description: '查询数据',
    examples: ['GET /api/users', 'GET /api/users/123'],
    idempotent: true,
    hasBody: false
  },
  /** 创建数据 - 创建新资源 */
  [HttpMethod.POST]: {
    description: '创建数据',
    examples: ['POST /api/users', 'POST /api/auth/login'],
    idempotent: false,
    hasBody: true
  },
  /** 全量更新 - 完全替换资源 */
  [HttpMethod.PUT]: {
    description: '全量更新',
    examples: ['PUT /api/users/123'],
    idempotent: true,
    hasBody: true
  },
  /** 部分更新 - 更新资源的部分字段 */
  [HttpMethod.PATCH]: {
    description: '部分更新',
    examples: ['PATCH /api/users/123'],
    idempotent: true,
    hasBody: true
  },
  /** 删除数据 - 删除指定资源 */
  [HttpMethod.DELETE]: {
    description: '删除数据',
    examples: ['DELETE /api/users/123'],
    idempotent: true,
    hasBody: false
  }
};
```

### 请求参数规范

```typescript
/**
 * 请求参数接口
 */
interface RequestParams {
  /** 路径参数 - 例如：/api/users/:id */
  pathParams?: Record<string, string | number>;
  /** 查询参数 - 例如：?page=1&pageSize=10 */
  queryParams?: Record<string, any>;
  /** 请求体数据 - 例如：{ name: '张三', age: 25 } */
  body?: any;
}

/**
 * 分页查询参数
 */
interface PaginationParams {
  /** 页码（从1开始） */
  page?: number;
  /** 每页大小 */
  pageSize?: number;
  /** 排序字段 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
}

/**
 * 搜索查询参数
 */
interface SearchParams extends PaginationParams {
  /** 搜索关键词 */
  keyword?: string;
  /** 筛选条件 */
  filters?: Record<string, any>;
}
```

## 认证机制规范

### JWT 认证流程

```typescript
/**
 * JWT 令牌管理类
 */
class TokenManager {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  
  /**
   * 保存认证令牌
   * @param token JWT令牌
   * @param refreshToken 刷新令牌（可选）
   */
  static saveToken(token: string, refreshToken?: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }
  
  /**
   * 获取认证令牌
   * @returns JWT令牌或null
   */
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
  
  /**
   * 清除认证令牌
   */
  static clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }
  
  /**
   * 检查令牌是否过期
   * @param token JWT令牌
   * @returns 是否过期
   */
  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}
```

### 认证拦截器

```typescript
/**
 * 请求认证拦截器
 * @param config 请求配置
 * @returns 处理后的请求配置
 */
function authInterceptor(config: RequestConfig): RequestConfig {
  const token = TokenManager.getToken();
  
  if (token) {
    // 检查令牌是否过期
    if (TokenManager.isTokenExpired(token)) {
      TokenManager.clearToken();
      redirectToLogin();
      throw new AuthenticationError('令牌已过期，请重新登录');
    }
    
    // 添加认证头
    config.headers = {
      ...config.headers,
      'Authorization': `Bearer ${token}`
    };
  }
  
  return config;
}
```

## 错误处理规范

### 自定义错误类

```typescript
/**
 * API 错误基类
 */
abstract class ApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public data?: any
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * 验证错误
 */
export class ValidationError extends ApiError {
  constructor(message: string, data?: any) {
    super(message, ApiStatusCode.BAD_REQUEST, data);
  }
}

/**
 * 认证错误
 */
export class AuthenticationError extends ApiError {
  constructor(message: string = '未授权访问') {
    super(message, ApiStatusCode.UNAUTHORIZED);
  }
}

/**
 * 授权错误
 */
export class AuthorizationError extends ApiError {
  constructor(message: string = '权限不足') {
    super(message, ApiStatusCode.FORBIDDEN);
  }
}

/**
 * 资源不存在错误
 */
export class NotFoundError extends ApiError {
  constructor(message: string = '资源不存在') {
    super(message, ApiStatusCode.NOT_FOUND);
  }
}

/**
 * 资源冲突错误
 */
export class ConflictError extends ApiError {
  constructor(message: string, data?: any) {
    super(message, ApiStatusCode.CONFLICT, data);
  }
}

/**
 * 账户锁定错误
 */
export class AccountLockedError extends ApiError {
  constructor(message: string = '账户已被锁定') {
    super(message, ApiStatusCode.LOCKED);
  }
}

/**
 * 服务器错误
 */
export class ServerError extends ApiError {
  constructor(message: string = '服务器内部错误') {
    super(message, ApiStatusCode.INTERNAL_ERROR);
  }
}
```

### 全局错误处理

```typescript
/**
 * 全局错误处理器
 * @param error 错误对象
 */
function globalErrorHandler(error: ApiError): void {
  console.error('API Error:', error);
  
  // 根据错误类型进行不同处理
  switch (error.constructor) {
    case ValidationError:
      // 显示表单验证错误
      showValidationErrors(error.data);
      break;
      
    case AuthenticationError:
      // 跳转到登录页
      redirectToLogin();
      showMessage('请重新登录', 'warning');
      break;
      
    case AuthorizationError:
      // 显示权限不足提示
      showMessage('权限不足，无法执行此操作', 'error');
      break;
      
    case NotFoundError:
      // 显示资源不存在提示
      showMessage('请求的资源不存在', 'error');
      break;
      
    case ConflictError:
      // 显示冲突错误信息
      showMessage(error.message, 'warning');
      break;
      
    case AccountLockedError:
      // 显示账户锁定提示
      showMessage(error.message, 'error');
      break;
      
    case ServerError:
    default:
      // 显示通用错误提示
      showMessage('系统繁忙，请稍后重试', 'error');
      break;
  }
}
```

## API 客户端实现

### 基础 API 客户端

```typescript
/**
 * API 客户端配置
 */
interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

/**
 * 请求配置
 */
interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  data?: any;
  timeout?: number;
}

/**
 * API 客户端类
 */
class ApiClient {
  private config: ApiClientConfig;
  
  constructor(config: ApiClientConfig) {
    this.config = config;
  }
  
  /**
   * 发送 HTTP 请求
   * @param config 请求配置
   * @returns Promise<ApiResponse<T>>
   */
  async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      // 应用认证拦截器
      const processedConfig = authInterceptor(config);
      
      // 构建完整URL
      const url = this.buildUrl(processedConfig.url, processedConfig.params);
      
      // 发送请求
      const response = await fetch(url, {
        method: processedConfig.method,
        headers: {
          ...this.config.headers,
          ...getStandardHeaders(TokenManager.getToken() || undefined),
          ...processedConfig.headers
        },
        body: processedConfig.data ? JSON.stringify(processedConfig.data) : undefined,
        signal: AbortSignal.timeout(processedConfig.timeout || this.config.timeout)
      });
      
      // 解析响应
      const result: ApiResponse<T> = await response.json();
      
      // 处理响应状态
      const handler = STATUS_CODE_HANDLERS[result.code];
      if (handler) {
        return handler(result);
      }
      
      // 未知状态码
      throw new ServerError(`未知状态码: ${result.code}`);
      
    } catch (error) {
      if (error instanceof ApiError) {
        globalErrorHandler(error);
        throw error;
      }
      
      // 网络错误或其他错误
      const serverError = new ServerError('网络请求失败');
      globalErrorHandler(serverError);
      throw serverError;
    }
  }
  
  /**
   * 构建完整URL
   * @param path 路径
   * @param params 查询参数
   * @returns 完整URL
   */
  private buildUrl(path: string, params?: Record<string, any>): string {
    const url = new URL(path, this.config.baseURL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }
  
  /**
   * GET 请求
   */
  get<T = any>(url: string, params?: Record<string, any>): Promise<T> {
    return this.request<T>({
      url,
      method: HttpMethod.GET,
      params
    });
  }
  
  /**
   * POST 请求
   */
  post<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      url,
      method: HttpMethod.POST,
      data
    });
  }
  
  /**
   * PUT 请求
   */
  put<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      url,
      method: HttpMethod.PUT,
      data
    });
  }
  
  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data?: any): Promise<T> {
    return this.request<T>({
      url,
      method: HttpMethod.PATCH,
      data
    });
  }
  
  /**
   * DELETE 请求
   */
  delete<T = any>(url: string): Promise<T> {
    return this.request<T>({
      url,
      method: HttpMethod.DELETE
    });
  }
}
```