<!--
/**
 * @fileoverview 应用底部组件
 * @description 展示应用的底部信息，包括版权和链接
 * @author 开发团队 <dev@example.com>
 * @created 2024-01-20
 * @updated 2024-01-20
 * @version 1.0.0
 */
-->

<template>
  <!-- 应用底部容器 -->
  <v-footer class="app-footer">
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" class="text-center">
          <!-- 版权信息 -->
          <div class="footer-content">
            <p class="footer-text">
              &copy; {{ currentYear }} Vue3 + Vuetify 项目
              <span class="separator">|</span>
              基于 Vue 3 + Vuetify 3.x + TypeScript 构建
            </p>
            
            <!-- 技术栈信息 -->
            <div class="tech-stack">
              <v-chip
                v-for="tech in techStack"
                :key="tech.name"
                size="small"
                variant="outlined"
                class="ma-1"
                :color="tech.color"
              >
                <v-icon :icon="tech.icon" class="mr-1" size="16" />
                {{ tech.name }}
              </v-chip>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
/**
 * 应用底部组件的组合式 API 逻辑
 * 
 * @description 处理底部信息的展示和数据管理
 */

/**
 * 技术栈信息接口
 * 
 * @description 定义技术栈项目的结构
 */
interface TechStackItem {
  /** 技术名称 */
  name: string;
  /** 图标名称 */
  icon: string;
  /** 颜色 */
  color: string;
}

/**
 * 当前年份
 * 
 * @description 获取当前年份用于版权信息
 */
const currentYear = computed(() => new Date().getFullYear());

/**
 * 技术栈列表
 * 
 * @description 项目使用的主要技术栈
 */
const techStack = ref<TechStackItem[]>([
  {
    name: 'Vue 3',
    icon: 'mdi-vuejs',
    color: 'green'
  },
  {
    name: 'Vuetify',
    icon: 'mdi-vuetify',
    color: 'blue'
  },
  {
    name: 'TypeScript',
    icon: 'mdi-language-typescript',
    color: 'blue-darken-2'
  },
  {
    name: 'Vite',
    icon: 'mdi-lightning-bolt',
    color: 'yellow-darken-2'
  },
  {
    name: 'Pinia',
    icon: 'mdi-store',
    color: 'orange'
  }
]);

/**
 * 组件挂载时的初始化
 */
onMounted(() => {
  console.log('AppFooter 组件已挂载');
});
</script>

<style scoped>
/**
 * 应用底部样式
 * 
 * @description 定义底部组件的样式
 */

/* 底部容器 */
.app-footer {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  border-top: 1px solid rgba(0, 0, 0, 0.12);
  margin-top: auto;
}

/* 底部内容 */
.footer-content {
  padding: 16px 0;
}

/* 底部文字 */
.footer-text {
  color: rgba(0, 0, 0, 0.6);
  font-size: 14px;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

/* 分隔符 */
.separator {
  margin: 0 8px;
  color: rgba(0, 0, 0, 0.3);
}

/* 技术栈容器 */
.tech-stack {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 4px;
}

/* 响应式设计 */
@media (max-width: 600px) {
  .footer-text {
    font-size: 12px;
  }
  
  .separator {
    display: block;
    margin: 4px 0;
  }
  
  .tech-stack {
    margin-top: 8px;
  }
}

/* 深色主题适配 */
.v-theme--dark .app-footer {
  background: linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%);
  border-top-color: rgba(255, 255, 255, 0.12);
}

.v-theme--dark .footer-text {
  color: rgba(255, 255, 255, 0.7);
}

.v-theme--dark .separator {
  color: rgba(255, 255, 255, 0.3);
}
</style>