<!--
/**
 * @fileoverview 科幻风格登录页面
 * @description 提供用户登录功能的科幻简约风格界面
 * @author 开发团队 <dev@example.com>
 * @created 2024-01-20
 * @updated 2024-01-20
 * @version 1.0.0
 */
-->

<template>
  <!-- 登录页面容器 -->
  <div class="login-page">
    <!-- 背景动画层 -->
    <div class="background-animation">
      <div class="grid-lines"></div>
      <div class="floating-particles">
        <div 
          v-for="i in 20" 
          :key="i" 
          class="particle"
          :style="getParticleStyle(i)"
        ></div>
      </div>
    </div>

    <!-- 主登录容器 -->
    <v-container class="login-container" fluid>
      <v-row justify="end" align="center" class="fill-height">
        <v-col cols="12" sm="6" md="5" lg="4" xl="3" class="login-col">
          <!-- 登录卡片 -->
          <v-card 
            class="login-card elevation-24"
            :loading="loading"
          >
            <!-- 卡片头部 -->
            <v-card-title class="login-header">
              <div class="header-content">
                <div class="logo-container">
                  <v-icon 
                    icon="mdi-shield-lock-outline" 
                    size="48" 
                    class="login-icon"
                  />
                </div>
                <h2 class="login-title">系统登录</h2>
                <p class="login-subtitle">安全访问控制中心</p>
              </div>
            </v-card-title>

            <!-- 登录表单 -->
            <v-card-text class="login-form">
              <v-form 
                ref="loginForm" 
                v-model="formValid" 
                @submit.prevent="handleLogin"
              >
                <!-- 用户名输入框 -->
                <v-text-field
                  v-model="loginData.username"
                  :rules="usernameRules"
                  label="用户名"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  class="login-input"
                  :disabled="loading"
                  @keyup.enter="handleLogin"
                />

                <!-- 密码输入框 -->
                <v-text-field
                  v-model="loginData.password"
                  :rules="passwordRules"
                  :type="showPassword ? 'text' : 'password'"
                  label="密码"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                  variant="outlined"
                  class="login-input"
                  :disabled="loading"
                  @click:append-inner="showPassword = !showPassword"
                  @keyup.enter="handleLogin"
                />

                <!-- 记住我选项 -->
                <v-checkbox
                  v-model="loginData.rememberMe"
                  label="记住登录状态"
                  class="remember-checkbox"
                  :disabled="loading"
                />

                <!-- 登录按钮 -->
                <v-btn
                  type="submit"
                  :loading="loading"
                  :disabled="!formValid || loading"
                  color="primary"
                  size="large"
                  variant="elevated"
                  class="login-btn"
                  block
                >
                  <v-icon icon="mdi-login" class="mr-2" />
                  登录系统
                </v-btn>
              </v-form>
            </v-card-text>

            <!-- 卡片底部 -->
            <v-card-actions class="login-footer">
              <v-spacer />
              <v-btn
                variant="text"
                size="small"
                class="forgot-btn"
                @click="handleForgotPassword"
              >
                忘记密码？
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- 版权信息 -->
    <div class="copyright">
      <p>&copy; 2024 科幻系统 - 安全登录</p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * 登录页面的组合式 API 逻辑
 * 
 * @description 处理用户登录、表单验证和界面交互
 */

/**
 * 登录数据接口
 * 
 * @description 定义登录表单的数据结构
 */
interface LoginData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 是否记住登录状态 */
  rememberMe: boolean;
}

/**
 * 登录表单引用
 */
const loginForm = ref();

/**
 * 表单验证状态
 */
const formValid = ref(false);

/**
 * 加载状态
 */
const loading = ref(false);

/**
 * 密码显示状态
 */
const showPassword = ref(false);

/**
 * 登录数据
 */
const loginData = ref<LoginData>({
  username: '',
  password: '',
  rememberMe: false
});

/**
 * 用户名验证规则
 */
const usernameRules = [
  (v: string) => !!v || '请输入用户名',
  (v: string) => v.length >= 3 || '用户名至少3个字符',
  (v: string) => v.length <= 20 || '用户名不能超过20个字符'
];

/**
 * 密码验证规则
 */
const passwordRules = [
  (v: string) => !!v || '请输入密码',
  (v: string) => v.length >= 6 || '密码至少6个字符',
  (v: string) => v.length <= 50 || '密码不能超过50个字符'
];

/**
 * 获取粒子样式
 * 
 * @description 为背景动画粒子生成随机样式
 * @param index - 粒子索引
 * @returns 粒子的CSS样式对象
 */
const getParticleStyle = (index: number) => {
  const delay = Math.random() * 10;
  const duration = 15 + Math.random() * 10;
  const size = 2 + Math.random() * 4;
  
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  };
};

/**
 * 处理登录提交
 * 
 * @description 验证表单并执行登录逻辑
 */
const handleLogin = async (): Promise<void> => {
  if (!loginForm.value) return;
  
  const { valid } = await loginForm.value.validate();
  if (!valid) return;

  loading.value = true;
  
  try {
    // 模拟登录API调用
    await simulateLogin(loginData.value);
    
    // 登录成功，跳转到主页
    console.log('登录成功:', loginData.value.username);
    
    // 这里应该跳转到主页或仪表板
    // await router.push('/');
    
  } catch (error) {
    console.error('登录失败:', error);
    // 这里应该显示错误提示
  } finally {
    loading.value = false;
  }
};

/**
 * 模拟登录API
 * 
 * @description 模拟后端登录验证过程
 * @param data - 登录数据
 * @returns Promise<void>
 */
const simulateLogin = async (data: LoginData): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 模拟登录验证
      if (data.username === 'admin' && data.password === '123456') {
        resolve();
      } else {
        reject(new Error('用户名或密码错误'));
      }
    }, 2000); // 模拟网络延迟
  });
};

/**
 * 处理忘记密码
 * 
 * @description 处理忘记密码功能
 */
const handleForgotPassword = (): void => {
  console.log('忘记密码功能');
  // 这里应该跳转到密码重置页面或显示重置对话框
};

/**
 * 组件挂载时的初始化
 */
onMounted(() => {
  console.log('登录页面已加载');
  
  // 检查是否有记住的登录信息
  const rememberedUsername = localStorage.getItem('rememberedUsername');
  if (rememberedUsername) {
    loginData.value.username = rememberedUsername;
    loginData.value.rememberMe = true;
  }
});

/**
 * 监听记住我状态变化
 */
watch(() => loginData.value.rememberMe, (newValue) => {
  if (newValue && loginData.value.username) {
    localStorage.setItem('rememberedUsername', loginData.value.username);
  } else {
    localStorage.removeItem('rememberedUsername');
  }
});
</script>

<style scoped>
/**
 * 登录页面样式
 * 
 * @description 科幻风格的登录界面样式定义
 */

/* 页面容器 */
.login-page {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  overflow: hidden;
}

/* 背景动画层 */
.background-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.6;
}

/* 网格线条 */
.grid-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(rgba(100, 200, 255, 0.08) 1px, transparent 1px),
    linear-gradient(90deg, rgba(100, 200, 255, 0.08) 1px, transparent 1px);
  background-size: 60px 60px;
  animation: gridMove 25s linear infinite;
  border-radius: 20px;
}

/* 网格移动动画 */
@keyframes gridMove {
  0% { transform: translate(0, 0); }
  100% { transform: translate(50px, 50px); }
}

/* 浮动粒子容器 */
.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* 粒子样式 */
.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(100, 200, 255, 0.8) 0%, rgba(150, 220, 255, 0.4) 70%, transparent 100%);
  border-radius: 50%;
  animation: float 18s ease-in-out infinite;
  box-shadow: 
    0 0 20px rgba(100, 200, 255, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(2px);
}

/* 粒子浮动动画 */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  10%, 90% {
    opacity: 1;
  }
  50% {
    transform: translateY(-100px) rotate(180deg);
  }
}

/* 登录容器 */
.login-container {
  position: relative;
  z-index: 2;
  height: 100vh;
}

/* 登录列容器 */
.login-col {
  padding-right: 60px;
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .login-col {
    padding-right: 16px;
    padding-left: 16px;
    justify-content: center;
  }
  
  .login-card {
    max-width: 320px;
  }
  
  .login-header {
    padding: 24px 20px 12px;
  }
  
  .login-form {
    padding: 20px;
  }
  
  .login-footer {
    padding: 12px 20px 20px;
  }
}

/* 登录卡片 */
.login-card {
  background: rgba(240, 248, 255, 0.12) !important;
  backdrop-filter: blur(25px);
  border: 2px solid rgba(100, 200, 255, 0.25);
  border-radius: 24px !important;
  box-shadow: 
    0 20px 60px rgba(100, 200, 255, 0.15),
    0 8px 32px rgba(0, 0, 0, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.1) !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  max-width: 380px;
  width: 100%;
  margin: 0;
  transform: translateY(0);
}

.login-card:hover {
  border-color: rgba(100, 200, 255, 0.45);
  transform: translateY(-8px) scale(1.02);
  box-shadow: 
    0 30px 80px rgba(100, 200, 255, 0.25),
    0 15px 50px rgba(0, 0, 0, 0.15),
    inset 0 2px 8px rgba(255, 255, 255, 0.15);
}

/* 登录头部 */
.login-header {
  padding: 28px 24px 16px;
  text-align: center;
  border-bottom: 1px solid rgba(100, 200, 255, 0.2);
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

/* Logo容器 */
.logo-container {
  position: relative;
  padding: 16px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(100, 200, 255, 0.2), rgba(150, 220, 255, 0.3));
  border: 2px solid rgba(100, 200, 255, 0.35);
  box-shadow: 
    0 6px 20px rgba(100, 200, 255, 0.2),
    inset 0 2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.logo-container:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 
    0 12px 35px rgba(100, 200, 255, 0.3),
    inset 0 2px 6px rgba(255, 255, 255, 0.25);
}

.login-icon {
  color: #64c8ff !important;
  filter: drop-shadow(0 0 15px rgba(100, 200, 255, 0.5));
  transition: all 0.3s ease;
}

/* 登录标题 */
.login-title {
  color: #ffffff;
  font-size: 20px;
  font-weight: 300;
  margin: 0;
  text-shadow: 0 0 10px rgba(100, 200, 255, 0.4);
}

.login-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
  margin: 0;
}

/* 登录表单 */
.login-form {
  padding: 24px;
}

/* 输入框样式 */
.login-input :deep(.v-field) {
  background: rgba(240, 248, 255, 0.08) !important;
  border-color: rgba(100, 200, 255, 0.3) !important;
  border-radius: 16px !important;
  border-width: 2px !important;
  box-shadow: 
    0 4px 15px rgba(100, 200, 255, 0.1),
    inset 0 2px 4px rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-input :deep(.v-field--focused) {
  border-color: #64c8ff !important;
  background: rgba(240, 248, 255, 0.12) !important;
  transform: scale(1.02);
  box-shadow: 
    0 8px 25px rgba(100, 200, 255, 0.2),
    inset 0 2px 6px rgba(255, 255, 255, 0.1) !important;
}

.login-input :deep(.v-field__input) {
  color: #ffffff !important;
  padding: 16px 20px !important;
}

.login-input :deep(.v-label) {
  color: rgba(200, 230, 255, 0.9) !important;
  font-weight: 500;
}

.login-input :deep(.v-field__prepend-inner .v-icon) {
  color: #64c8ff !important;
  filter: drop-shadow(0 0 8px rgba(100, 200, 255, 0.4));
}

.login-input :deep(.v-field__append-inner .v-icon) {
  color: rgba(200, 230, 255, 0.8) !important;
}

/* 记住我复选框 */
.remember-checkbox {
  margin: 16px 0;
}

.remember-checkbox :deep(.v-label) {
  color: rgba(200, 230, 255, 0.9) !important;
  font-size: 14px;
  font-weight: 500;
}

.remember-checkbox :deep(.v-selection-control__input) {
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.remember-checkbox :deep(.v-selection-control__input:hover) {
  transform: scale(1.1);
}

.remember-checkbox :deep(.v-selection-control__input .v-icon) {
  color: #64c8ff !important;
  filter: drop-shadow(0 0 8px rgba(100, 200, 255, 0.4));
}

/* 登录按钮 */
.login-btn {
  margin-top: 16px;
  background: linear-gradient(135deg, #64c8ff, #4facfe) !important;
  color: #ffffff !important;
  font-weight: 600;
  text-transform: none;
  border-radius: 20px !important;
  padding: 12px 24px !important;
  box-shadow: 
    0 6px 20px rgba(100, 200, 255, 0.3),
    inset 0 2px 4px rgba(255, 255, 255, 0.2) !important;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid rgba(100, 200, 255, 0.3) !important;
}

.login-btn:hover {
  background: linear-gradient(135deg, #7dd3fc, #60a5fa) !important;
  transform: translateY(-4px) scale(1.05);
  box-shadow: 
    0 15px 40px rgba(100, 200, 255, 0.4),
    inset 0 2px 6px rgba(255, 255, 255, 0.25) !important;
  border-color: rgba(100, 200, 255, 0.5) !important;
}

.login-btn:active {
  transform: translateY(-2px) scale(1.02);
  transition: all 0.1s ease;
}

.login-btn:disabled {
  background: rgba(100, 200, 255, 0.2) !important;
  color: rgba(255, 255, 255, 0.4) !important;
  transform: none !important;
  box-shadow: 0 4px 15px rgba(100, 200, 255, 0.1) !important;
}

/* 登录底部 */
.login-footer {
  padding: 16px 24px 24px;
  border-top: 1px solid rgba(100, 200, 255, 0.2);
}

/* 忘记密码按钮 */
.forgot-btn {
  color: #64c8ff !important;
  text-transform: none;
  font-size: 12px;
}

.forgot-btn:hover {
  background: rgba(100, 200, 255, 0.1) !important;
}

/* 版权信息 */
.copyright {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  text-align: center;
}

.copyright p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .login-card {
    margin: 20px;
    max-width: none;
  }
  
  .login-header {
    padding: 24px 16px 12px;
  }
  
  .login-form {
    padding: 16px;
  }
  
  .login-title {
    font-size: 20px;
  }
}

/* 加载状态样式 */
.v-card--loading {
  pointer-events: none;
}

.v-card--loading::before {
  background: rgba(100, 200, 255, 0.15);
}
</style>