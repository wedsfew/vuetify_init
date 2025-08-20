<!--
/**
 * @fileoverview 登录API测试页面
 * @description 用于测试登录接口是否成功接入的测试页面
 * @author 开发团队
 * @created 2024-01-20
 */
-->

<template>
  <v-container class="login-test-page" fluid>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card class="pa-6" elevation="8">
          <v-card-title class="text-center mb-4">
            <v-icon icon="mdi-api" size="48" color="primary" class="mb-2" />
            <h2>登录API接口测试</h2>
            <p class="text-subtitle-1 text-medium-emphasis">验证登录接口是否成功接入</p>
          </v-card-title>

          <v-card-text>
            <!-- 测试数据显示 -->
            <v-alert
              type="info"
              variant="tonal"
              class="mb-4"
              icon="mdi-information"
            >
              <div class="text-subtitle-2 mb-2">测试数据:</div>
              <div>邮箱: {{ testData.email }}</div>
              <div>密码: {{ testData.password }}</div>
            </v-alert>

            <!-- 登录表单 -->
            <v-form ref="testForm" v-model="formValid" @submit.prevent="testLogin">
              <v-text-field
                v-model="loginData.email"
                label="邮箱地址"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                :rules="emailRules"
                :disabled="loading"
                class="mb-3"
              />

              <v-text-field
                v-model="loginData.password"
                :type="showPassword ? 'text' : 'password'"
                label="密码"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                variant="outlined"
                :rules="passwordRules"
                :disabled="loading"
                class="mb-4"
                @click:append-inner="showPassword = !showPassword"
              />

              <div class="d-flex gap-3 mb-4">
                <v-btn
                  type="submit"
                  color="primary"
                  :loading="loading"
                  :disabled="!formValid || loading"
                  variant="elevated"
                  prepend-icon="mdi-play"
                  block
                >
                  测试登录接口
                </v-btn>
              </div>

              <div class="d-flex gap-2">
                <v-btn
                  color="secondary"
                  variant="outlined"
                  prepend-icon="mdi-refresh"
                  @click="loadTestData"
                  :disabled="loading"
                  size="small"
                >
                  加载测试数据
                </v-btn>
                <v-btn
                  color="warning"
                  variant="outlined"
                  prepend-icon="mdi-broom"
                  @click="clearForm"
                  :disabled="loading"
                  size="small"
                >
                  清空表单
                </v-btn>
              </div>
            </v-form>
          </v-card-text>
        </v-card>

        <!-- 测试结果显示 -->
        <v-card v-if="testResult" class="mt-4 pa-4" elevation="4">
          <v-card-title class="d-flex align-center">
            <v-icon 
              :icon="testResult.success ? 'mdi-check-circle' : 'mdi-alert-circle'" 
              :color="testResult.success ? 'success' : 'error'"
              class="mr-2"
            />
            测试结果
          </v-card-title>
          
          <v-card-text>
            <v-alert
              :type="testResult.success ? 'success' : 'error'"
              variant="tonal"
              class="mb-3"
            >
              <div class="text-subtitle-2 mb-2">{{ testResult.message }}</div>
              <div v-if="testResult.timestamp" class="text-caption">
                测试时间: {{ formatTime(testResult.timestamp) }}
              </div>
            </v-alert>

            <!-- 成功响应数据 -->
            <div v-if="testResult.success && testResult.data">
              <v-divider class="mb-3" />
              <div class="text-subtitle-2 mb-2">响应数据:</div>
              <v-code class="response-code">
                {{ JSON.stringify(testResult.data, null, 2) }}
              </v-code>
            </div>

            <!-- 错误详情 -->
            <div v-if="!testResult.success && testResult.error">
              <v-divider class="mb-3" />
              <div class="text-subtitle-2 mb-2">错误详情:</div>
              <v-code class="error-code">
                {{ testResult.error }}
              </v-code>
            </div>
          </v-card-text>
        </v-card>

        <!-- API状态检查 -->
        <v-card class="mt-4 pa-4" elevation="4">
          <v-card-title>
            <v-icon icon="mdi-server" class="mr-2" />
            API服务状态
          </v-card-title>
          
          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-2">
              <span>服务地址:</span>
              <v-chip color="primary" variant="outlined" size="small">
                {{ apiBaseUrl }}
              </v-chip>
            </div>
            
            <div class="d-flex align-center justify-space-between mb-3">
              <span>连接状态:</span>
              <v-chip 
                :color="apiStatus.connected ? 'success' : 'error'"
                variant="flat"
                size="small"
              >
                <v-icon 
                  :icon="apiStatus.connected ? 'mdi-check' : 'mdi-close'"
                  size="16"
                  class="mr-1"
                />
                {{ apiStatus.connected ? '已连接' : '未连接' }}
              </v-chip>
            </div>

            <v-btn
              color="info"
              variant="outlined"
              prepend-icon="mdi-refresh"
              @click="checkApiStatus"
              :loading="checkingStatus"
              size="small"
              block
            >
              检查API状态
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authService } from '@/services'
import { http } from '@/utils/http'
import type { LoginRequest, LoginResponse } from '@/types/auth'

// 响应式数据
const testForm = ref()
const formValid = ref(false)
const loading = ref(false)
const showPassword = ref(false)
const checkingStatus = ref(false)

// 测试数据
const testData = ref({
  email: 't@t.com',
  password: '12345678'
})

// 登录表单数据
const loginData = ref<LoginRequest>({
  email: '',
  password: ''
})

// 测试结果
interface TestResult {
  success: boolean
  message: string
  data?: LoginResponse
  error?: string
  timestamp: Date
}

const testResult = ref<TestResult | null>(null)

// API状态
const apiStatus = ref({
  connected: false,
  lastCheck: null as Date | null
})

const apiBaseUrl = ref('')

// 表单验证规则
const emailRules = [
  (v: string) => !!v || '请输入邮箱地址',
  (v: string) => /.+@.+\..+/.test(v) || '请输入有效的邮箱地址'
]

const passwordRules = [
  (v: string) => !!v || '请输入密码',
  (v: string) => v.length >= 6 || '密码至少6个字符'
]

// 加载测试数据
const loadTestData = () => {
  loginData.value.email = testData.value.email
  loginData.value.password = testData.value.password
}

// 清空表单
const clearForm = () => {
  loginData.value.email = ''
  loginData.value.password = ''
  testResult.value = null
}

// 格式化时间
const formatTime = (date: Date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 测试登录接口
const testLogin = async () => {
  if (!testForm.value) return
  
  const { valid } = await testForm.value.validate()
  if (!valid) return

  loading.value = true
  testResult.value = null

  try {
    console.log('开始测试登录接口...')
    console.log('测试数据:', loginData.value)
    
    const response = await authService.login({
      email: loginData.value.email,
      password: loginData.value.password
    })
    
    console.log('登录成功:', response)
    
    testResult.value = {
      success: true,
      message: '登录接口测试成功！API已成功接入。',
      data: response,
      timestamp: new Date()
    }
    
    // 更新API状态
    apiStatus.value.connected = true
    apiStatus.value.lastCheck = new Date()
    
  } catch (error) {
    console.error('登录失败:', error)
    
    testResult.value = {
      success: false,
      message: '登录接口测试失败！请检查API服务是否正常运行。',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date()
    }
    
    // 更新API状态
    apiStatus.value.connected = false
    apiStatus.value.lastCheck = new Date()
    
  } finally {
    loading.value = false
  }
}

// 检查API状态
const checkApiStatus = async () => {
  checkingStatus.value = true
  
  try {
    // 这里可以调用一个健康检查接口
    // 暂时使用登录接口来检查
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)
    
    await http.get('/api/test/health', {
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    apiStatus.value.connected = true
    apiStatus.value.lastCheck = new Date()
    
  } catch (error) {
    console.error('API状态检查失败:', error)
    apiStatus.value.connected = false
    apiStatus.value.lastCheck = new Date()
  } finally {
    checkingStatus.value = false
  }
}

// 组件挂载时初始化
onMounted(() => {
  console.log('登录API测试页面已加载')
  loadTestData()
  checkApiStatus()
})
</script>

<style scoped>
.login-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.response-code,
.error-code {
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 12px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
}

.error-code {
  background-color: rgba(244, 67, 54, 0.1);
  color: #d32f2f;
}

.response-code {
  background-color: rgba(76, 175, 80, 0.1);
  color: #388e3c;
}
</style>