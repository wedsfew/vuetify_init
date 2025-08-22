<template>
  <v-container fluid class="domain-search-container">
    <!-- 背景装饰 -->
    <div class="search-background">
      <div class="search-overlay"></div>
    </div>
    
    <v-row justify="center" align="center" class="min-height-screen">
      <v-col cols="12" sm="10" md="8" lg="6" xl="5">
        <!-- 页面标题 -->
        <div class="text-center mb-8">
          <v-icon size="64" color="primary" class="mb-4">mdi-magnify</v-icon>
          <h1 class="text-h3 font-weight-bold mb-3 text-primary">搜索子域名</h1>
          <p class="text-h6 text-medium-emphasis">
            发现您的完美域名
          </p>
        </div>

        <!-- 域名搜索卡片 -->
        <v-card 
          elevation="8" 
          rounded="xl" 
          class="search-card pa-8"
        >
          <v-form ref="formRef" @submit.prevent="handleSearch">
            <!-- 域名搜索输入框 -->
            <div class="search-input-container mb-6">
              <v-text-field
                v-model="searchQuery"
                placeholder="输入子域名"
                variant="solo"
                density="comfortable"
                class="search-input"
                :loading="searching"
                hide-details
                single-line
                clearable
                @keyup.enter="handleSearch"
              >
                <template #prepend-inner>
                  <v-icon color="primary">mdi-magnify</v-icon>
                </template>
                <template #append>
                  <!-- 域名后缀选择 -->
                  <v-select
                    v-model="selectedSuffix"
                    :items="domainSuffixes"
                    :loading="loadingSuffixes"
                    variant="plain"
                    density="comfortable"
                    class="suffix-select"
                    hide-details
                    single-line
                  >
                    <template #selection="{ item }">
                      <v-chip
                        color="primary"
                        variant="flat"
                        size="small"
                        class="suffix-chip"
                      >
                        {{ item.title }}
                      </v-chip>
                    </template>
                  </v-select>
                </template>
              </v-text-field>
            </div>
            
            <!-- 搜索按钮 -->
            <div class="text-center">
              <v-btn
                color="primary"
                size="x-large"
                rounded="xl"
                elevation="2"
                :loading="searching"
                @click="handleSearch"
                class="search-btn px-12"
              >
                <v-icon start>mdi-magnify</v-icon>
                搜索
              </v-btn>
            </div>
          </v-form>
        </v-card>
        
        <!-- 搜索结果 -->
        <v-card 
          v-if="searchResults.length > 0" 
          elevation="4" 
          rounded="xl" 
          class="mt-6 pa-6"
        >
          <v-card-title class="text-h6 mb-4">
            <v-icon class="me-2">mdi-dns</v-icon>
            搜索结果
          </v-card-title>
          
          <v-list>
            <v-list-item
              v-for="(result, index) in searchResults"
              :key="index"
              class="mb-2"
            >
              <template #prepend>
                <v-icon 
                  :color="result.available ? 'success' : 'error'"
                  class="me-3"
                >
                  {{ result.available ? 'mdi-check-circle' : 'mdi-close-circle' }}
                </v-icon>
              </template>
              
              <v-list-item-title class="text-h6">
                {{ result.domain }}
              </v-list-item-title>
              
              <v-list-item-subtitle>
                {{ result.available ? '可注册' : '不可用' }}
              </v-list-item-subtitle>
              
              <template #append>
                <v-btn
                  v-if="result.available"
                  color="primary"
                  variant="outlined"
                  size="small"
                  @click="registerDomain(result)"
                >
                  注册
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>

    <!-- 注册对话框 -->
    <v-dialog v-model="registerDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="text-h5 pa-6">
          注册域名: {{ selectedDomain?.domain }}
        </v-card-title>
        
        <v-card-text class="pa-6">
          <v-form v-model="registerFormValid" ref="registerFormRef">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="registerForm.name"
                  label="姓名"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  :rules="nameRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="registerForm.email"
                  label="邮箱"
                  type="email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  :rules="emailRules"
                  required
                />
              </v-col>
            </v-row>
            
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="registerForm.phone"
                  label="手机号码"
                  prepend-inner-icon="mdi-phone-outline"
                  variant="outlined"
                  :rules="phoneRules"
                  required
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="registerForm.years"
                  :items="yearOptions"
                  label="注册年限"
                  prepend-inner-icon="mdi-calendar"
                  variant="outlined"
                  required
                />
              </v-col>
            </v-row>
            
            <!-- 域名信息 -->
            <v-card variant="tonal" color="primary" class="my-4">
              <v-card-text>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="text-h6">免费域名注册</div>
                    <div class="text-caption text-medium-emphasis">
                      {{ selectedDomain?.domain }} × {{ registerForm.years }}年
                    </div>
                  </div>
                  <div class="text-h5 font-weight-bold text-success">
                    免费
                  </div>
                </div>
              </v-card-text>
            </v-card>
            
            <!-- 服务条款 -->
            <v-checkbox
              v-model="registerForm.agreeTerms"
              :rules="termsRules"
              required
            >
              <template #label>
                <span class="text-body-2">
                  我已阅读并同意
                  <a href="#" class="text-primary text-decoration-none">服务条款</a>
                  和
                  <a href="#" class="text-primary text-decoration-none">隐私政策</a>
                </span>
              </template>
            </v-checkbox>
          </v-form>
        </v-card-text>
        
        <v-card-actions class="pa-6 pt-0">
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="registerDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="primary"
            :loading="registering"
            :disabled="!registerFormValid || !registerForm.agreeTerms"
            @click="handleRegister"
          >
            立即注册
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 注册成功对话框 -->
        <v-dialog v-model="successDialog" max-width="500">
          <v-card>
            <v-card-title class="text-center pa-6">
              <v-icon size="64" color="success" class="mb-4">mdi-check-circle</v-icon>
              <div class="text-h5">注册成功！</div>
            </v-card-title>
            <v-card-text class="text-center pb-6">
              <p class="text-body-1 mb-4">
                恭喜您成功注册域名：
                <strong>{{ selectedDomain?.domain }}</strong>
              </p>
              <p class="text-body-2 text-medium-emphasis">
                域名将在24小时内生效，相关信息已发送至您的邮箱。
              </p>
            </v-card-text>
            <v-card-actions class="justify-center pb-6">
              <v-btn color="primary" @click="successDialog = false">
                确定
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
   </v-container>
 </template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 表单引用
const formRef = ref()

// 搜索相关
const searchQuery = ref('')
const selectedSuffix = ref('cblog.eu')
const searching = ref(false)
const searchResults = ref<Array<{domain: string, suffix: string, price: number, available: boolean}>>([])

// 表单数据
const domainForm = ref({
  domain: '',
  suffix: 'cblog.eu',
  years: 1,
  contact: {
    name: '',
    email: '',
    phone: '',
    organization: ''
  },
  agreeTerms: false
})

// 域名状态
const domainStatus = ref<'available' | 'unavailable' | 'checking' | null>(null)
const domainErrorMessage = ref('')
const checkingAvailability = ref(false)
const registering = ref(false)
const successDialog = ref(false)
const formValid = ref(false)

// 注册对话框相关
const registerDialog = ref(false)
const selectedDomain = ref<{domain: string} | null>(null)
const registerForm = ref({
  name: '',
  email: '',
  phone: '',
  years: 1,
  agreeTerms: false
})
const registerFormValid = ref(false)

// 域名后缀选项
const domainSuffixes = ref<Array<{title: string, value: string, price: number}>>([])
const loadingSuffixes = ref(false)

// 获取可用域名后缀
const loadAvailableSuffixes = async () => {
  loadingSuffixes.value = true
  try {
    const response = await fetch('/api/domains/suffixes')
    const result = await response.json()
    
    if (result.code === 200 && result.data) {
      domainSuffixes.value = result.data.map((suffix: string) => ({
        title: suffix,
        value: suffix
      }))
    } else {
      throw new Error(result.message || '获取域名后缀失败')
    }
  } catch (error) {
    console.error('加载域名后缀失败:', error)
    // 使用默认后缀作为备选
    domainSuffixes.value = [
      { title: 'cblog.eu', value: 'cblog.eu' },
      { title: 'test23.cblog.eu', value: 'test23.cblog.eu' },
      { title: 'twodoller.store', value: 'twodoller.store' },
      { title: 'vvvv.host', value: 'vvvv.host' }
    ]
  } finally {
    loadingSuffixes.value = false
  }
}

// 注册年限选项
const yearOptions = ref([
  { title: '1年', value: 1 },
  { title: '2年', value: 2 },
  { title: '3年', value: 3 },
  { title: '5年', value: 5 },
  { title: '10年', value: 10 }
])


// 表单验证规则
const domainRules = [
  (v: string) => !!v || '请输入域名',
  (v: string) => /^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/.test(v) || '域名格式不正确'
]

const suffixRules = [
  (v: string) => !!v || '请选择域名后缀'
]

const yearsRules = [
  (v: number) => !!v || '请选择注册年限'
]

const nameRules = [
  (v: string) => !!v || '请输入姓名',
  (v: string) => v.length >= 2 || '姓名至少2个字符'
]

const emailRules = [
  (v: string) => !!v || '请输入邮箱',
  (v: string) => /.+@.+\..+/.test(v) || '邮箱格式不正确'
]

const phoneRules = [
  (v: string) => !!v || '请输入手机号码',
  (v: string) => /^1[3-9]\d{9}$/.test(v) || '手机号码格式不正确'
]

const termsRules = [
  (v: boolean) => !!v || '请同意服务条款'
]

// 搜索处理
const handleSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  searching.value = true
  try {
    // 模拟搜索结果
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 使用已加载的域名后缀
    const suffixes = domainSuffixes.value.map(item => item.value)
    searchResults.value = suffixes.map(suffix => ({
      domain: searchQuery.value + '.' + suffix,
      suffix,
      available: Math.random() > 0.3
    }))
  } finally {
    searching.value = false
  }
}

// 注册域名
const registerDomain = (result: {domain: string}) => {
  selectedDomain.value = result
  registerDialog.value = true
}

// 域名输入处理
const onDomainInput = () => {
  domainStatus.value = null
  domainErrorMessage.value = ''
  
  if (domainForm.value.domain && domainForm.value.domain.length > 2) {
    checkDomainAvailability()
  }
}

// 检查域名可用性
const checkDomainAvailability = async () => {
  checkingAvailability.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 简单的模拟逻辑：包含'test'的域名不可用
    const isAvailable = !domainForm.value.domain.toLowerCase().includes('test')
    
    domainStatus.value = isAvailable ? 'available' : 'unavailable'
    if (!isAvailable) {
      domainErrorMessage.value = '该域名已被注册'
    }
  } catch (error) {
    console.error('检查域名可用性失败:', error)
    domainErrorMessage.value = '检查域名可用性失败，请稍后重试'
  } finally {
    checkingAvailability.value = false
  }
}

// 处理注册
const handleRegister = async () => {
  if (!registerFormValid.value || !registerForm.value.agreeTerms) {
    return
  }
  
  registering.value = true
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    console.log('注册域名:', {
      domain: selectedDomain.value?.domain,
      years: registerForm.value.years,
      contact: registerForm.value
    })
    
    registerDialog.value = false
    successDialog.value = true
    resetForm()
  } catch (error) {
    console.error('域名注册失败:', error)
    // 这里可以显示错误提示
  } finally {
    registering.value = false
  }
}

// 重置表单
const resetForm = () => {
  searchQuery.value = ''
  searchResults.value = []
  registerForm.value = {
     name: '',
     email: '',
     phone: '',
     years: 1,
     agreeTerms: false
   }
   selectedDomain.value = null
   domainStatus.value = null
   domainErrorMessage.value = ''
   formRef.value?.resetValidation()
 }
 
 // 组件挂载时加载可用后缀
 onMounted(() => {
   loadAvailableSuffixes()
 })
 </script>

<style scoped>
.v-card {
  transition: all 0.3s ease;
}

.v-card:hover {
  transform: translateY(-2px);
}

.text-primary {
  text-decoration: none !important;
}

.text-primary:hover {
  text-decoration: underline !important;
}
</style>