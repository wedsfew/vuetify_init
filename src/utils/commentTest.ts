/**
 * @fileoverview 注释规范测试工具函数
 * @description 用于验证TypeScript代码注释规范的示例文件
 * @author 开发团队 <dev@example.com>
 * @created 2024-01-20
 * @updated 2024-01-20
 * @version 1.0.0
 */

/**
 * API 响应接口
 * 
 * @description 定义标准的API响应结构
 * @template T 响应数据的类型
 */
export interface ApiResponse<T = any> {
  /** 响应状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T;
  /** 响应时间戳 */
  timestamp: number;
}

/**
 * 用户状态枚举
 * 
 * @description 定义用户的各种状态
 */
export enum UserStatus {
  /** 活跃状态 */
  ACTIVE = 'active',
  /** 非活跃状态 */
  INACTIVE = 'inactive',
  /** 已删除状态 */
  DELETED = 'deleted',
  /** 已封禁状态 */
  BANNED = 'banned'
}

/**
 * 应用配置常量
 * 
 * @description 定义应用程序的全局配置
 */
export const APP_CONFIG = {
  /** 应用名称 */
  APP_NAME: 'Vue3 Vuetify App',
  /** API 基础 URL */
  API_BASE_URL: 'https://api.example.com',
  /** 请求超时时间（毫秒） */
  REQUEST_TIMEOUT: 10000,
  /** 分页默认大小 */
  DEFAULT_PAGE_SIZE: 20,
  /** 最大文件上传大小（字节） */
  MAX_FILE_SIZE: 10 * 1024 * 1024 // 10MB
} as const;

/**
 * 注释规范测试类
 * 
 * @description 展示类级注释和方法注释的标准格式
 * @example
 * ```typescript
 * const tester = new CommentTester();
 * const result = await tester.processData([1, 2, 3]);
 * console.log(result);
 * ```
 */
export class CommentTester {
  /**
   * 私有属性：数据缓存
   * @private
   */
  private cache: Map<string, any> = new Map();

  /**
   * 公共属性：处理器名称
   */
  public readonly name: string;

  /**
   * 构造函数
   * 
   * @param name - 处理器名称
   */
  constructor(name: string = 'DefaultTester') {
    this.name = name;
  }

  /**
   * 处理数据数组
   * 
   * @description 对输入的数据数组进行处理，支持多种数据类型
   * @param data - 要处理的数据数组
   * @param options - 处理选项
   * @param options.transform - 是否进行数据转换，默认为 true
   * @param options.validate - 是否进行数据验证，默认为 false
   * @returns Promise<T[]> 处理后的数据数组
   * @throws {Error} 当数据格式不正确时抛出错误
   * @example
   * ```typescript
   * const result = await tester.processData(
   *   [1, 2, 3], 
   *   { transform: true, validate: true }
   * );
   * ```
   * @since 1.0.0
   */
  async processData<T>(
    data: T[],
    options: {
      transform?: boolean;
      validate?: boolean;
    } = {}
  ): Promise<T[]> {
    const { transform = true, validate = false } = options;

    // 数据验证
    if (validate && !Array.isArray(data)) {
      throw new Error('输入数据必须是数组格式');
    }

    // 缓存检查
    const cacheKey = `${this.name}_${JSON.stringify(data)}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // 数据处理
    let result = [...data];
    
    if (transform) {
      result = await this.transformData(result);
    }

    // 缓存结果
    this.cache.set(cacheKey, result);

    return result;
  }

  /**
   * 转换数据
   * 
   * @description 对数据进行转换处理
   * @param data - 要转换的数据
   * @returns Promise<T[]> 转换后的数据
   * @private
   */
  private async transformData<T>(data: T[]): Promise<T[]> {
    // 模拟异步转换过程
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data.map(item => ({ ...item as any, processed: true })));
      }, 100);
    });
  }

  /**
   * 清空缓存
   * 
   * @description 清空所有缓存数据
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * 获取缓存大小
   * 
   * @description 返回当前缓存中的条目数量
   * @returns number 缓存条目数量
   */
  getCacheSize(): number {
    return this.cache.size;
  }
}

/**
 * 格式化日期字符串
 * 
 * @description 将日期对象格式化为指定格式的字符串
 * @param date - 要格式化的日期对象
 * @param format - 日期格式，默认为 'YYYY-MM-DD'
 * @returns string 格式化后的日期字符串
 * @throws {Error} 当日期对象无效时抛出错误
 * @example
 * ```typescript
 * const formatted = formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss');
 * console.log(formatted); // '2024-01-20 15:30:45'
 * ```
 */
export function formatDate(
  date: Date,
  format: string = 'YYYY-MM-DD'
): string {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    throw new Error('无效的日期对象');
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return format
    .replace('YYYY', String(year))
    .replace('MM', month)
    .replace('DD', day)
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds);
}

/**
 * 防抖函数
 * 
 * @description 创建一个防抖函数，在指定时间内多次调用只执行最后一次
 * @param func - 要防抖的函数
 * @param delay - 延迟时间（毫秒）
 * @returns Function 防抖后的函数
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   console.log('搜索:', query);
 * }, 300);
 * 
 * debouncedSearch('hello'); // 只有最后一次调用会执行
 * ```
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func(...args), delay);
  };
}

/**
 * 深度克隆对象
 * 
 * @description 创建对象的深度副本，支持嵌套对象和数组
 * @param obj - 要克隆的对象
 * @returns T 克隆后的对象
 * @throws {Error} 当对象包含循环引用时抛出错误
 * @example
 * ```typescript
 * const original = { a: 1, b: { c: 2 } };
 * const cloned = deepClone(original);
 * cloned.b.c = 3; // 不会影响原对象
 * ```
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }

  return obj;
}

/**
 * TODO: 添加数据验证功能
 * @author 开发团队
 * @date 2024-01-20
 * @priority medium
 * @description 需要添加更完善的数据验证机制
 */

/**
 * FIXME: 优化深度克隆的性能
 * @author 开发团队
 * @date 2024-01-20
 * @issue #456
 * @description 当前实现在处理大型对象时性能较差
 */

/**
 * @deprecated 此常量已废弃，请使用 APP_CONFIG.DEFAULT_PAGE_SIZE 替代
 * @since 1.0.0
 * @removal 2.0.0
 * @see APP_CONFIG.DEFAULT_PAGE_SIZE
 */
export const DEPRECATED_PAGE_SIZE = 10;