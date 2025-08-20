<template>
  <v-layout>
    <v-navigation-drawer v-model="drawer">
      <v-list density="compact" item-props :items="items" nav />

      <template #append>
        <v-list-item
          class="ma-2"
          link
          nav
          prepend-icon="mdi-cog-outline"
          title="设置"
          @click="navigateTo('/settings')"
        />
      </template>
    </v-navigation-drawer>

    <v-app-bar border="b" class="ps-4" flat>
      <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown" @click="drawer = !drawer" />

      <v-app-bar-title>{{ pageTitle }}</v-app-bar-title>

      <template #append>
        <v-btn class="text-none me-2" height="48" icon slim>
          <v-avatar color="surface-light" image="https://cdn.vuetifyjs.com/images/john.png" size="32" />

          <v-menu activator="parent">
            <v-list density="compact" nav>
              <v-list-item 
                append-icon="mdi-cog-outline" 
                link 
                title="设置" 
                @click="navigateTo('/settings')"
              />
              <v-list-item 
                append-icon="mdi-logout" 
                link 
                title="退出登录" 
                @click="handleLogout"
              />
            </v-list>
          </v-menu>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <div class="pa-4">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-card>
                <v-card-title>
                  <v-icon class="me-2">mdi-view-dashboard-outline</v-icon>
                  仪表板
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="6" lg="3">
                      <v-card color="primary" variant="tonal">
                        <v-card-text>
                          <div class="text-h6">用户总数</div>
                          <div class="text-h4">{{ userStats.totalUsers }}</div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6" lg="3">
                      <v-card color="success" variant="tonal">
                        <v-card-text>
                          <div class="text-h6">活跃用户</div>
                          <div class="text-h4">{{ userStats.activeUsers }}</div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6" lg="3">
                      <v-card color="warning" variant="tonal">
                        <v-card-text>
                          <div class="text-h6">项目数量</div>
                          <div class="text-h4">{{ userStats.totalProjects }}</div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="6" lg="3">
                      <v-card color="info" variant="tonal">
                        <v-card-text>
                          <div class="text-h6">完成任务</div>
                          <div class="text-h4">{{ userStats.completedTasks }}</div>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          
          <v-row class="mt-4">
            <v-col cols="12" lg="8">
              <v-card>
                <v-card-title>
                  <v-icon class="me-2">mdi-chart-line</v-icon>
                  数据趋势
                </v-card-title>
                <v-card-text>
                  <v-sheet
                    border="dashed md"
                    color="surface-light"
                    height="300"
                    rounded="lg"
                    width="100%"
                    class="d-flex align-center justify-center"
                  >
                    <div class="text-center">
                      <v-icon size="64" color="grey-lighten-1">mdi-chart-line</v-icon>
                      <div class="text-h6 mt-2 text-grey-lighten-1">图表区域</div>
                    </div>
                  </v-sheet>
                </v-card-text>
              </v-card>
            </v-col>
            
            <v-col cols="12" lg="4">
              <v-card>
                <v-card-title>
                  <v-icon class="me-2">mdi-bell-outline</v-icon>
                  最新通知
                </v-card-title>
                <v-card-text>
                  <v-list>
                    <v-list-item
                      v-for="notification in notifications"
                      :key="notification.id"
                      :prepend-icon="notification.icon"
                      :title="notification.title"
                      :subtitle="notification.time"
                    />
                  </v-list>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </div>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
/**
 * 主页面的组合式 API 逻辑
 * 
 * @description 处理主页面的抽屉布局、导航和数据展示
 */

// 导入Vue Router
import { useRouter } from 'vue-router';
import { authService } from '@/services';

// 获取路由实例
const router = useRouter();

/**
 * 导航项接口
 */
interface NavigationItem {
  /** 标题 */
  title: string;
  /** 前置图标 */
  prependIcon: string;
  /** 是否为链接 */
  link: boolean;
  /** 路由路径 */
  to?: string;
}

/**
 * 用户统计数据接口
 */
interface UserStats {
  /** 用户总数 */
  totalUsers: number;
  /** 活跃用户数 */
  activeUsers: number;
  /** 项目总数 */
  totalProjects: number;
  /** 完成任务数 */
  completedTasks: number;
}

/**
 * 通知接口
 */
interface Notification {
  /** 通知ID */
  id: number;
  /** 通知标题 */
  title: string;
  /** 通知时间 */
  time: string;
  /** 通知图标 */
  icon: string;
}

/**
 * 页面标题
 */
const pageTitle = ref('管理系统');

/**
 * 抽屉状态
 */
const drawer = ref(true);

/**
 * 导航菜单项
 */
const items = ref<NavigationItem[]>([
  {
    title: '仪表板',
    prependIcon: 'mdi-view-dashboard-outline',
    link: true,
    to: '/'
  },
  {
    title: '团队管理',
    prependIcon: 'mdi-account-group',
    link: true,
    to: '/team'
  },
  {
    title: '项目管理',
    prependIcon: 'mdi-briefcase-outline',
    link: true,
    to: '/projects'
  },
  {
    title: '日历',
    prependIcon: 'mdi-calendar',
    link: true,
    to: '/calendar'
  },
  {
    title: '报告',
    prependIcon: 'mdi-file-chart-outline',
    link: true,
    to: '/reports'
  },
]);

/**
 * 用户统计数据
 */
const userStats = ref<UserStats>({
  totalUsers: 1234,
  activeUsers: 856,
  totalProjects: 42,
  completedTasks: 128
});

/**
 * 通知列表
 */
const notifications = ref<Notification[]>([
  {
    id: 1,
    title: '新用户注册',
    time: '2分钟前',
    icon: 'mdi-account-plus'
  },
  {
    id: 2,
    title: '项目更新',
    time: '15分钟前',
    icon: 'mdi-update'
  },
  {
    id: 3,
    title: '系统维护通知',
    time: '1小时前',
    icon: 'mdi-wrench'
  }
]);

/**
 * 导航到指定路径
 * 
 * @param path - 目标路径
 */
const navigateTo = (path: string) => {
  router.push(path);
};

/**
 * 处理退出登录
 */
const handleLogout = () => {
  authService.logout();
  router.push('/login');
};
</script>

<style scoped>
/* 自定义样式 */
.v-navigation-drawer {
  border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
}

.v-app-bar {
  backdrop-filter: blur(10px);
}
</style>
