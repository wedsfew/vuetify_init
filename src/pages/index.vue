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
   <v-layout> 
     <v-navigation-drawer v-model="drawer" class="jelly-drawer"> 
       <div class="pa-3">
         <v-card 
           v-for="item in items" 
           :key="item.title"
           class="jelly-card nav-card mb-2" 
           variant="tonal"
           @click="handleNavClick(item.title)"
         >
           <v-card-text class="pa-3">
             <div class="d-flex align-center">
               <v-icon :icon="item.prependIcon" class="me-3" size="20" />
               <span class="text-body-2 font-weight-medium">{{ item.title }}</span>
             </div>
           </v-card-text>
         </v-card>
       </div>

       <template #append> 
         <div class="pa-3">
           <v-card 
             class="jelly-card settings-card" 
             variant="tonal"
             @click="handleNavClick('Settings')"
           >
             <v-card-text class="pa-3">
               <div class="d-flex align-center">
                 <v-icon icon="mdi-cog-outline" class="me-3" size="20" />
                 <span class="text-body-2 font-weight-medium">Settings</span>
               </div>
             </v-card-text>
           </v-card>
         </div>
       </template> 
     </v-navigation-drawer> 

    <v-app-bar border="b" class="ps-4 jelly-app-bar" flat> 
       <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" /> 

       <v-app-bar-title>Application</v-app-bar-title> 

       <template #append> 
         <v-card class="jelly-card user-card" variant="flat" @click="handleUserMenuClick">
           <v-card-text class="pa-2">
             <v-btn class="text-none" height="48" icon slim> 
               <v-avatar color="surface-light" image="https://cdn.vuetifyjs.com/images/john.png" size="32" /> 

               <v-menu activator="parent"> 
                 <v-card class="jelly-card menu-card">
                   <v-list density="compact" nav> 
                     <v-list-item 
                       class="jelly-list-item"
                       append-icon="mdi-cog-outline" 
                       link 
                       title="Settings" 
                       @click="handleNavClick('Settings')"
                     /> 

                     <!-- 根据登录状态显示不同按钮 -->
                     <v-list-item 
                       v-if="isLoggedIn"
                       class="jelly-list-item"
                       append-icon="mdi-logout" 
                       link 
                       title="退出登录" 
                       @click="handleLogout"
                     />
                     
                     <v-list-item 
                       v-else
                       class="jelly-list-item"
                       append-icon="mdi-login" 
                       link 
                       title="登录" 
                       @click="handleLogin"
                     /> 
                   </v-list> 
                 </v-card>
               </v-menu> 
             </v-btn> 
           </v-card-text>
         </v-card>
       </template> 
     </v-app-bar> 

    <v-main class="jelly-main"> 
       <div class="pa-4"> 
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
               <div class="text-body-1 text-medium-emphasis mb-4">点击这里开始您的工作</div>
               
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
     </v-main> 
  </v-layout> 
</template> 

<script setup>
/**
 * 主页面组件的组合式 API 逻辑
 * 
 * @description 处理主页面的抽屉布局和导航
 */

import { ref, onMounted } from 'vue' 

/**
 * 抽屉状态
 * 
 * @description 控制导航抽屉的显示/隐藏状态
 */
const drawer = ref(true)

/**
 * 登录状态检查相关状态
 */
const isCheckingStatus = ref(false)
const loginStatusMessage = ref('')
const loginStatusType = ref('info')
const isLoggedIn = ref(false) 

/**
 * 导航菜单项
 * 
 * @description 定义侧边导航栏的菜单项
 */
const items = ref([ 
  { 
    title: '域名注册', 
    prependIcon: 'mdi-web-plus', 
    link: true, 
  }, 
  { 
    title: '域名管理', 
    prependIcon: 'mdi-web-check', 
    link: true, 
  }, 
]) 

/**
   * 处理导航点击事件
   * 
   * @param itemTitle - 导航项标题
   */
  const handleNavClick = (itemTitle) => {
    console.log(`点击了导航项: ${itemTitle}`);
    // 这里可以添加路由跳转逻辑
  };

 /**
  * 处理用户菜单点击事件
  */
 const handleUserMenuClick = () => {
   console.log('点击了用户菜单');
 };

 /**
  * 处理退出登录
  */
 const handleLogout = async () => {
   console.log('用户退出登录');
   
   try {
     // 从localStorage获取JWT令牌
     const token = localStorage.getItem('token');
     
     if (!token) {
       loginStatusMessage.value = '未找到登录令牌';
       loginStatusType.value = 'warning';
       return;
     }
     
     // 调用后端登出接口
     const response = await fetch('/api/auth/logout', {
       method: 'POST',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       }
     });
     
     const result = await response.json();
     
     if (result.code === 200) {
       // 登出成功，清除本地令牌
       localStorage.removeItem('token');
       isLoggedIn.value = false;
       loginStatusMessage.value = '已成功退出登录';
       loginStatusType.value = 'success';
     } else {
       // 登出失败，但仍然清除本地令牌（防止令牌泄露）
       localStorage.removeItem('token');
       isLoggedIn.value = false;
       loginStatusMessage.value = `退出登录失败: ${result.message}`;
       loginStatusType.value = 'warning';
     }
   } catch (error) {
     console.error('退出登录时发生错误:', error);
     // 即使网络错误，也要清除本地令牌
     localStorage.removeItem('token');
     isLoggedIn.value = false;
     loginStatusMessage.value = '网络错误，但已清除本地登录状态';
     loginStatusType.value = 'warning';
   }
 };

 /**
  * 处理登录
  */
 const handleLogin = () => {
   console.log('跳转到登录页面');
   // 这里可以添加跳转到登录页面的逻辑
   // 例如: router.push('/login')
 };

 /**
  * 处理主内容区域点击事件
  */
 const handleMainContentClick = () => {
   console.log('点击了主内容区域');
   // 这里可以添加主内容交互逻辑
 };

 /**
  * 检查登录状态
  * 
  * @description 调用API验证JWT令牌的有效性
  */
 const checkLoginStatus = async () => {
   isCheckingStatus.value = true;
   loginStatusMessage.value = '';
   
   try {
     // 从localStorage获取JWT令牌
     const token = localStorage.getItem('token');
     
     if (!token) {
       loginStatusMessage.value = '未找到登录令牌，请先登录';
       loginStatusType.value = 'warning';
       return;
     }
     
     // 调用API验证令牌
     const response = await fetch('/api/auth/validate-token', {
       method: 'GET',
       headers: {
         'Authorization': `Bearer ${token}`,
         'Content-Type': 'application/json'
       }
     });
     
     const result = await response.json();
     
     if (result.code === 200) {
       loginStatusMessage.value = '登录状态有效，令牌正常';
       loginStatusType.value = 'success';
       isLoggedIn.value = true;
     } else if (result.code === 401) {
       loginStatusMessage.value = result.message || '令牌无效或已过期';
       loginStatusType.value = 'error';
       // 清除无效令牌
       localStorage.removeItem('token');
       isLoggedIn.value = false;
     } else {
       loginStatusMessage.value = `验证失败: ${result.message}`;
       loginStatusType.value = 'error';
       isLoggedIn.value = false;
     }
   } catch (error) {
     console.error('检查登录状态时发生错误:', error);
     loginStatusMessage.value = '网络错误，无法连接到服务器';
     loginStatusType.value = 'error';
   } finally {
      isCheckingStatus.value = false;
    }
  };

 /**
  * 检查用户登录状态
  */
 const checkUserLoginStatus = () => {
   const token = localStorage.getItem('token');
   isLoggedIn.value = !!token;
 };

 /**
  * 组件挂载时的初始化
  */
 onMounted(() => {
   console.log('主页面组件已挂载');
   // 检查初始登录状态
   checkUserLoginStatus();
 });
</script>

<style scoped>
/**
 * 主页面样式
 * 
 * @description 定义主页面组件的样式
 */

/* 果冻效果基础样式 */
 .jelly-card {
   cursor: pointer;
   transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
   transform-origin: center;
   border-radius: 12px;
   box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
 }

 .jelly-card:hover {
   transform: scale(1.05) translateY(-2px);
   box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
   border-color: rgba(var(--v-theme-primary), 0.3);
 }

 .jelly-card:active {
   transform: scale(0.95);
   transition: all 0.1s cubic-bezier(0.4, 0, 0.2, 1);
 }

 /* 导航抽屉样式 */
 .jelly-drawer {
   border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
   background: linear-gradient(135deg, rgba(var(--v-theme-surface), 1) 0%, rgba(var(--v-theme-surface-light), 1) 100%);
 }

 /* 导航卡片样式 */
 .nav-card {
   background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.08) 0%, rgba(var(--v-theme-primary), 0.04) 100%);
   border: 1px solid rgba(var(--v-theme-primary), 0.12);
 }

 .nav-card:hover {
   background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.15) 0%, rgba(var(--v-theme-primary), 0.08) 100%);
   border-color: rgba(var(--v-theme-primary), 0.3);
 }

 /* 设置卡片样式 */
 .settings-card {
   background: linear-gradient(135deg, rgba(var(--v-theme-secondary), 0.08) 0%, rgba(var(--v-theme-secondary), 0.04) 100%);
   border: 1px solid rgba(var(--v-theme-secondary), 0.12);
 }

 .settings-card:hover {
   background: linear-gradient(135deg, rgba(var(--v-theme-secondary), 0.15) 0%, rgba(var(--v-theme-secondary), 0.08) 100%);
   border-color: rgba(var(--v-theme-secondary), 0.3);
 }

 /* 应用栏样式 */
 .jelly-app-bar {
   backdrop-filter: blur(10px);
   background: linear-gradient(90deg, rgba(var(--v-theme-surface), 0.95) 0%, rgba(var(--v-theme-surface-light), 0.95) 100%);
 }

 /* 用户卡片样式 */
 .user-card {
   background: transparent;
   box-shadow: none;
 }

 .user-card:hover {
   background: rgba(var(--v-theme-primary), 0.08);
   transform: scale(1.02);
 }

 /* 菜单卡片样式 */
 .menu-card {
   border-radius: 8px;
   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
 }

 /* 列表项果冻效果 */
 .jelly-list-item {
   transition: all 0.2s ease;
   border-radius: 8px;
   margin: 2px 4px;
 }

 .jelly-list-item:hover {
   background-color: rgba(var(--v-theme-primary), 0.1);
   transform: translateX(4px) scale(1.02);
 }

 /* 主内容区域样式 */
 .jelly-main {
   background: linear-gradient(135deg, rgba(var(--v-theme-surface), 1) 0%, rgba(var(--v-theme-surface-light), 1) 100%);
 }

 /* 主内容卡片样式 */
 .main-content-card {
   background: linear-gradient(135deg, rgba(var(--v-theme-surface-light), 1) 0%, rgba(var(--v-theme-surface), 1) 100%);
   border: 2px dashed rgba(var(--v-theme-primary), 0.3);
 }

 .main-content-card:hover {
   border-color: rgba(var(--v-theme-primary), 0.6);
   background: linear-gradient(135deg, rgba(var(--v-theme-primary), 0.05) 0%, rgba(var(--v-theme-surface-light), 1) 100%);
 }

 /* 内容区域样式 */
 .pa-4 {
   min-height: calc(100vh - 64px);
 }

 /* 登录状态按钮样式 */
 .login-status-btn {
   border-radius: 12px;
   font-weight: 600;
   letter-spacing: 0.5px;
   box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
 }
 
 .login-status-btn:hover {
   transform: scale(1.05) translateY(-2px);
   box-shadow: 0 8px 20px rgba(var(--v-theme-primary), 0.4);
 }
 
 .login-status-btn:active {
   transform: scale(0.98);
 }

 /* 响应式设计 */
 @media (max-width: 600px) {
   .jelly-card:hover {
     transform: scale(1.02) translateY(-1px);
   }
   
   .jelly-list-item:hover {
     transform: translateX(2px) scale(1.01);
   }
   
   .login-status-btn:hover {
     transform: scale(1.02) translateY(-1px);
   }
 }
</style>
