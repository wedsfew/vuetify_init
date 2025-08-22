<!--
/**
 * @fileoverview 主页面组件
 * @description 应用的主页面，包含导航抽屉、应用栏和主内容区域
 * @author 开发团队 <dev@example.com>
 * @created 2024-01-20
 * @updated 2024-01-20
 * @version 1.0.0
 */
-->

<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" class="jelly-drawer">
      <div class="pa-3">
        <v-card 
          v-for="item in items" 
          :key="item.title"
          class="jelly-card nav-card mb-2" 
          :class="{ 'nav-card-active': currentPage === item.value }"
          :variant="currentPage === item.value ? 'elevated' : 'tonal'"
          :color="currentPage === item.value ? 'primary' : undefined"
          @click="handleNavClick(item.title)"
        >
          <v-card-text class="pa-3">
            <div class="d-flex align-center">
              <v-icon 
                :icon="item.prependIcon" 
                class="me-3" 
                size="20" 
                :color="currentPage === item.value ? 'white' : undefined"
              />
              <span 
                class="text-body-2 font-weight-medium"
                :class="{ 'text-white': currentPage === item.value }"
              >
                {{ item.title }}
              </span>
            </div>
          </v-card-text>
        </v-card>
      </div>

      <template #append>
        <div class="pa-3">
          <v-card 
            class="jelly-card settings-card" 
            :class="{ 'nav-card-active': currentPage === 'settings' }"
            :variant="currentPage === 'settings' ? 'elevated' : 'tonal'"
            :color="currentPage === 'settings' ? 'primary' : undefined"
            @click="handleNavClick('Settings')"
          >
            <v-card-text class="pa-3">
              <div class="d-flex align-center">
                <v-icon 
                  icon="mdi-cog-outline" 
                  class="me-3" 
                  size="20" 
                  :color="currentPage === 'settings' ? 'white' : undefined"
                />
                <span 
                  class="text-body-2 font-weight-medium"
                  :class="{ 'text-white': currentPage === 'settings' }"
                >
                  Settings
                </span>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </template>
    </v-navigation-drawer>

    <v-app-bar border="b" class="ps-4 jelly-app-bar" flat>
      <!-- 汉堡菜单按钮 -->
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      
      <v-app-bar-title>
        <div class="d-flex align-center">
          <v-icon icon="mdi-view-dashboard" class="me-2" />
          <span>控制面板</span>
        </div>
      </v-app-bar-title>

      <template #append>
        <!-- 主题切换按钮 -->
        <ThemeToggle />
        
        <!-- 用户菜单 -->
        <v-menu>
          <template #activator="{ props }">
            <v-btn v-bind="props" icon variant="text" class="text-none" style="height: 48px;">
              <v-avatar size="32" color="surface-light">
                <v-img src="https://cdn.vuetifyjs.com/images/john.png" alt="" />
              </v-avatar>
            </v-btn>
          </template>
          
          <v-list>
            <v-list-item @click="handleLogin">
              <template #prepend>
                <v-icon icon="mdi-login" density="compact" />
              </template>
              <v-list-item-title>登录</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-app-bar>

    <v-main>
      <div class="pa-4">
        <!-- 动态内容区域 -->
        
        <!-- 域名注册页面 -->
        <div v-if="currentPage === 'domain-register'">
          <DomainRegister />
        </div>
        
        <!-- 域名管理页面 -->
        <div v-else-if="currentPage === 'domain-manage'">
          <DomainManage />
        </div>
        
        <!-- API测试页面 -->
        <div v-else-if="currentPage === 'api-test'">
          <ApiTest />
        </div>
        
        <!-- 域名测试页面 -->
        <div v-else-if="currentPage === 'domain-test'">
          <DomainTest />
        </div>
        
        <!-- 设置页面 -->
        <div v-else-if="currentPage === 'settings'">
          <v-card class="jelly-card" rounded="lg">
            <v-card-title class="text-h5 pa-6">
              <v-icon class="me-2">mdi-cog-outline</v-icon>
              系统设置
            </v-card-title>
            <v-card-text class="pa-6">
              <div class="text-center py-12">
                <v-icon size="64" color="warning" class="mb-4">mdi-construction</v-icon>
                <div class="text-h6 mb-2">功能开发中</div>
                <div class="text-body-1 text-medium-emphasis">
                  系统设置功能正在开发中，敬请期待...
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
        
        <!-- 主页内容 -->
        <div v-else>
          <v-card 
            class="jelly-card main-content-card" 
            border="dashed md" 
            color="surface-light" 
            height="500" 
            rounded="lg" 
            width="100%" 
            @click="handleMainContentClick"
          >
            <v-card-text class="d-flex align-center justify-center h-100">
              <div class="text-center">
                <v-icon size="64" color="primary" class="mb-4">mdi-view-dashboard</v-icon>
                <div class="text-h5 mb-2">主内容区域</div>
                <div class="text-body-1 text-medium-emphasis mb-4">点击左侧菜单开始您的工作</div>
                
                <!-- 登录状态检查按钮 -->
                <v-btn 
                  class="jelly-card login-status-btn"
                  color="primary"
                  variant="elevated"
                  size="large"
                  prepend-icon="mdi-shield-check"
                  :loading="isCheckingStatus"
                  @click="checkLoginStatus"
                >
                  检查登录状态
                </v-btn>
                
                <!-- 状态显示 -->
                <div v-if="loginStatusMessage" class="mt-4">
                  <v-alert 
                    :type="loginStatusType"
                    :text="loginStatusMessage"
                    variant="tonal"
                    class="jelly-card"
                  />
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DomainRegister from './domain-register.vue'
import DomainManage from './domain-manage.vue'
import Login from './login.vue'
import ApiTest from './api-test.vue'
import DomainTest from './domain-test.vue'
import ThemeToggle from '@/components/ThemeToggle.vue'
import { useTheme } from '@/composables/useTheme'

// 路由
const router = useRouter()

// 主题
const { initTheme } = useTheme()

// 响应式数据
const drawer = ref(true)
const currentPage = ref('domain-register') // 默认显示域名注册页面
const isCheckingStatus = ref(false)
const loginStatusMessage = ref('')
const loginStatusType = ref<'success' | 'error' | 'warning' | 'info'>('info')

// 导航项目
const items = ref([
  {
    title: '域名注册',
    prependIcon: 'mdi-magnify',
    value: 'domain-register'
  },
  {
    title: '域名管理',
    prependIcon: 'mdi-web-check',
    value: 'domain-manage'
  },
  {
    title: 'API测试',
    prependIcon: 'mdi-api',
    value: 'api-test'
  },
  {
    title: '域名测试',
    prependIcon: 'mdi-test-tube',
    value: 'domain-test'
  }
])

/**
 * 处理导航点击事件
 */
const handleNavClick = (title: string) => {
  const item = items.value.find(i => i.title === title)
  if (item) {
    currentPage.value = item.value
  } else if (title === 'Settings') {
    currentPage.value = 'settings'
  }
}

/**
 * 处理主内容区域点击事件
 */
const handleMainContentClick = () => {
  // 可以添加主内容区域的点击逻辑
}

/**
 * 处理登录按钮点击事件
 */
const handleLogin = () => {
  router.push('/login')
}

/**
 * 检查登录状态
 */
const checkLoginStatus = async () => {
  isCheckingStatus.value = true
  loginStatusMessage.value = ''
  
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 这里应该调用实际的API来检查登录状态
    const isLoggedIn = false // 模拟未登录状态
    
    if (isLoggedIn) {
      loginStatusMessage.value = '您已登录'
      loginStatusType.value = 'success'
    } else {
      loginStatusMessage.value = '您尚未登录，请先登录'
      loginStatusType.value = 'warning'
    }
  } catch (error) {
    loginStatusMessage.value = '检查登录状态失败'
    loginStatusType.value = 'error'
  } finally {
    isCheckingStatus.value = false
  }
}

/**
 * 组件挂载时的初始化操作
 */
onMounted(() => {
  // 初始化主题
  initTheme()
})
</script>

<style scoped>
/* 果冻效果样式 */
.jelly-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.jelly-card:hover {
  transform: scale(1.05) translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.jelly-card:active {
  transform: scale(0.98);
}

.jelly-drawer {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.jelly-app-bar {
  backdrop-filter: blur(10px);
  background: rgba(var(--v-theme-surface), 0.8) !important;
}

.nav-card:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}

.nav-card-active {
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3) !important;
  border: 1px solid rgba(var(--v-theme-primary), 0.5);
}

.nav-card-active:hover {
  transform: scale(1.02) translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4) !important;
}

.settings-card:hover {
  background: rgba(var(--v-theme-secondary), 0.1);
}

.main-content-card {
  border: 2px dashed rgba(var(--v-theme-primary), 0.3);
  background: rgba(var(--v-theme-surface-light), 0.5);
}

.login-status-btn {
  transition: all 0.3s ease;
}

.login-status-btn:hover {
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 960px) {
  .jelly-card:hover {
    transform: scale(1.02) translateY(-2px);
  }
  
  .main-content-card {
    height: 400px !important;
  }
}
</style>