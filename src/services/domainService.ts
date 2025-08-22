/**
 * @fileoverview 域名服务
 * @description 提供域名相关的API服务
 * @author 开发者
 * @created 2024-01-20
 */

import { http } from '@/utils/http'
import type { ApiResponse } from '@/utils/http'

/**
 * 域名信息接口
 */
export interface DomainInfo {
  CNAMESpeedup: string
  CreatedOn: string
  DNSStatus: string
  DomainId: number
  EffectiveDNS: string[]
  Grade: string
  GradeLevel: number
  GradeTitle: string
  GroupId: number
  IsVip: string
  Name: string
  Owner: string
  Punycode: string
  RecordCount: number
  Remark: string
  SearchEnginePush: string
  Status: string
  TTL: number
  UpdatedOn: string
  VipAutoRenew: string
  VipEndAt: string
  VipStartAt: string
  TagList: Array<{
    TagKey: string
    TagValue: string
  }>
}

/**
 * 域名统计信息接口
 */
export interface DomainCountInfo {
  AllTotal: number
  DomainTotal: number
  ErrorTotal: number
  GroupTotal: number
  LockTotal: number
  MineTotal: number
  PauseTotal: number
  ShareOutTotal: number
  ShareTotal: number
  SpamTotal: number
  VipExpire: number
  VipTotal: number
}

/**
 * 获取域名列表响应接口
 */
export interface GetDomainListResponse {
  DomainCountInfo: DomainCountInfo
  domainList: DomainInfo[]
  RequestId: string
}

/**
 * 获取域名列表请求参数接口
 */
export interface GetDomainListParams {
  type?: string
  offset?: number
  limit?: number
  groupId?: number
  keyword?: string
}

/**
 * 域名服务类
 */
export class DomainService {
  /**
   * 获取域名列表
   * @param params 查询参数
   * @returns Promise<ApiResponse<GetDomainListResponse>>
   */
  async getDomainList(params?: GetDomainListParams): Promise<ApiResponse<GetDomainListResponse>> {
    return http.get<ApiResponse<GetDomainListResponse>>('/api/dnspod/domains', {
      params
    })
  }

  /**
   * 获取可用域名后缀列表
   * 从域名列表中提取所有唯一的域名后缀
   * @returns Promise<string[]>
   */
  async getAvailableSuffixes(): Promise<string[]> {
    try {
      const response = await this.getDomainList()
      if (response.data && response.data.domainList) {
        // 从域名列表中提取后缀
        const suffixes = response.data.domainList.map((domain: DomainInfo) => {
          const parts = domain.Name.split('.')
          return '.' + parts.slice(1).join('.')
        })
        // 去重并返回
        return [...new Set(suffixes)] as string[]
      }
      return this.getDefaultSuffixes()
    } catch (error) {
      console.error('获取可用域名后缀失败:', error)
      return this.getDefaultSuffixes()
    }
  }

  /**
   * 获取默认域名后缀
   * @returns string[]
   */
  private getDefaultSuffixes(): string[] {
    return ['.com', '.cn', '.net', '.org', '.info']
  }
}

// 导出域名服务实例
export const domainService = new DomainService()