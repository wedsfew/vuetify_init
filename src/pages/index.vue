<!--
/**
 * @fileoverview 应用主页面
 * @description 展示应用的主要功能和测试组件，验证代码注释规范
 * @author 开发团队 <dev@example.com>
 * @created 2024-01-20
 * @updated 2024-01-20
 * @version 1.0.0
 */
-->

<template>
  <!-- 主页面容器 -->
  <div class="home-page">
    <!-- 欢迎区域 -->
    <v-container>
      <v-row>
        <v-col>
          <v-card class="pa-6 mb-4">
            <v-card-title class="text-h4 text-center">
              <v-icon icon="mdi-vuetify" class="mr-2" color="primary" />
              Vue3 + Vuetify 项目
            </v-card-title>
            <v-card-subtitle class="text-center">
              代码注释规范测试页面
            </v-card-subtitle>
            <v-card-text class="text-center">
               <p>这是一个基于 Vue 3 + Vuetify 3.x + TypeScript 的项目示例</p>
               <p>展示了完整的代码注释规范和最佳实践</p>
             </v-card-text>
             <v-card-actions class="justify-center">
               <v-btn
                 color="primary"
                 variant="outlined"
                 prepend-icon="mdi-login"
                 @click="navigateToLogin"
               >
                 查看登录界面
               </v-btn>
             </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <!-- 测试注释规范组件 -->
    <TestCommentComponent
      :title="pageTitle"
      :users="mockUsers"
      @user-selected="handleUserSelected"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script lang="ts" setup>
/**
 * 主页面的组合式 API 逻辑
 * 
 * @description 处理主页面的数据管理和事件处理
 */

/**
 * 用户信息接口
 * 
 * @description 定义用户的基本信息结构
 */
interface User {
  /** 用户唯一标识符 */
  id: string;
  /** 用户名 */
  username: string;
  /** 用户邮箱 */
  email: string;
  /** 用户头像 URL */
  avatar?: string;
  /** 用户角色列表 */
  roles: UserRole[];
  /** 创建时间 */
  createdAt: Date;
}

/**
 * 用户角色枚举
 * 
 * @description 定义系统中的用户角色类型
 */
enum UserRole {
  /** 管理员 */
  ADMIN = 'admin',
  /** 普通用户 */
  USER = 'user',
  /** 访客 */
  GUEST = 'guest'
}

/**
 * 页面标题
 */
const pageTitle = ref('注释规范测试');

/**
 * 模拟用户数据
 * 
 * @description 用于测试组件功能的模拟用户数据
 */
const mockUsers = ref<User[]>([
  {
    id: '1',
    username: '张三',
    email: 'zhangsan@example.com',
    avatar: 'https://cdn.vuetifyjs.com/images/john.jpg',
    roles: [UserRole.ADMIN],
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    username: '李四',
    email: 'lisi@example.com',
    roles: [UserRole.USER],
    createdAt: new Date('2024-01-16')
  },
  {
    id: '3',
    username: '王五',
    email: 'wangwu@example.com',
    roles: [UserRole.GUEST],
    createdAt: new Date('2024-01-17')
  },
  {
    id: '4',
    username: '赵六',
    email: 'zhaoliu@example.com',
    roles: [UserRole.USER, UserRole.ADMIN],
    createdAt: new Date('2024-01-18')
  }
]);

/**
 * 处理用户选择事件
 * 
 * @description 当用户在测试组件中选择用户时触发
 * @param user - 被选择的用户对象
 */
const handleUserSelected = (user: User): void => {
  console.log('用户被选择:', user);
  
  // 显示用户信息的提示
  const message = `选择了用户: ${user.username} (${user.email})`;
  console.log(message);
  
  // 这里可以添加更多的业务逻辑
  // 例如：跳转到用户详情页面、打开编辑对话框等
};

/**
 * 处理刷新事件
 * 
 * @description 当用户点击刷新按钮时触发
 */
const handleRefresh = (): void => {
  console.log('刷新数据');
  
  // 模拟数据刷新
  const refreshedUser: User = {
    id: `refresh_${Date.now()}`,
    username: `刷新用户_${new Date().getSeconds()}`,
    email: `refresh${Date.now()}@example.com`,
    roles: [UserRole.USER],
    createdAt: new Date()
  };
  
  // 添加新用户到列表
  mockUsers.value.push(refreshedUser);
  
  console.log('数据刷新完成，新增用户:', refreshedUser);
};

/**
 * 导航到登录页面
 * 
 * @description 跳转到登录界面进行测试
 */
const navigateToLogin = (): void => {
  // 使用编程式导航跳转到登录页面
  window.open('/login', '_blank');
};

/**
 * 组件挂载时的初始化操作
 */
onMounted(() => {
  console.log('主页面已挂载');
  console.log('当前用户数量:', mockUsers.value.length);
});
</script>

<style scoped>
/**
 * 主页面样式
 * 
 * @description 定义主页面的局部样式
 */

/* 页面容器 */
.home-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

/* 卡片阴影效果 */
.v-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.v-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}
</style>
