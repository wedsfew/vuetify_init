<template>
  <div class="domain-manage-container">
    <!-- 标题区域 -->
    <div class="domain-title-section d-flex align-center mb-6">
      <v-icon color="primary" size="36" class="me-3">mdi-earth</v-icon>
      <h1 class="text-h4 font-weight-bold">域名管理</h1>
    </div>
    
    <!-- 域名列表卡片 -->
    <v-card class="domain-list-card rounded-lg" elevation="1">
      <v-card-title class="pa-4">
        <span class="text-h6 font-weight-bold">我的域名</span>
      </v-card-title>
      
      <!-- 表格头部 -->
      <v-card-text class="pa-0">
        <div class="domain-table">
          <div class="domain-table-header d-flex px-4 py-2">
            <div class="domain-column" style="flex: 2">域名</div>
            <div class="domain-column" style="flex: 1">创建于</div>
            <div class="domain-column text-center" style="flex: 1">操作</div>
          </div>
          
          <!-- 表格内容 -->
          <v-divider></v-divider>
          
          <!-- 域名项 -->
          <div class="domain-item d-flex align-center px-4 py-3">
            <div class="domain-column" style="flex: 2">
              <span class="font-weight-medium">baixi.zabc.net</span>
            </div>
            <div class="domain-column text-medium-emphasis" style="flex: 1">
              2025/05/28 04:34
            </div>
            <div class="domain-column text-center" style="flex: 1">
              <div class="d-flex justify-center">
                <v-btn
                  class="me-2"
                  density="comfortable"
                  variant="tonal"
                  color="primary"
                  size="small"
                >
                  管理
                </v-btn>
                <v-btn
                  density="comfortable"
                  variant="flat"
                  color="error"
                  size="small"
                >
                  删除
                </v-btn>
              </div>
            </div>
          </div>
          
          <v-divider></v-divider>
          
          <!-- 域名项 -->
          <div class="domain-item d-flex align-center px-4 py-3">
            <div class="domain-column" style="flex: 2">
              <span class="font-weight-medium">myproject.zabc.net</span>
            </div>
            <div class="domain-column text-medium-emphasis" style="flex: 1">
              2025/07/08 01:24
            </div>
            <div class="domain-column text-center" style="flex: 1">
              <div class="d-flex justify-center">
                <v-btn
                  class="me-2"
                  density="comfortable"
                  variant="tonal"
                  color="primary"
                  size="small"
                >
                  管理
                </v-btn>
                <v-btn
                  density="comfortable"
                  variant="flat"
                  color="error"
                  size="small"
                >
                  删除
                </v-btn>
              </div>
            </div>
          </div>
          
          <v-divider></v-divider>
          
          <!-- 域名项 -->
          <div class="domain-item d-flex align-center px-4 py-3">
            <div class="domain-column" style="flex: 2">
              <span class="font-weight-medium">mmmm.vvvv.ee</span>
            </div>
            <div class="domain-column text-medium-emphasis" style="flex: 1">
              2025/07/08 02:11
            </div>
            <div class="domain-column text-center" style="flex: 1">
              <div class="d-flex justify-center">
                <v-btn
                  class="me-2"
                  density="comfortable"
                  variant="tonal"
                  color="primary"
                  size="small"
                >
                  管理
                </v-btn>
                <v-btn
                  density="comfortable"
                  variant="flat"
                  color="error"
                  size="small"
                >
                  删除
                </v-btn>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
// 域名管理页面逻辑
</script>

<style scoped>
/* 域名管理页面样式 */
.domain-manage-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px;
}

.domain-title-section {
  margin-bottom: 24px;
}

.domain-list-card {
  background: rgba(var(--v-theme-surface), 1);
  border: 1px solid rgba(var(--v-theme-outline), 0.12);
}

.domain-table-header {
  background: rgba(var(--v-theme-surface-variant), 0.3);
  font-weight: 600;
  color: rgba(var(--v-theme-on-surface), 0.87);
}

.domain-column {
  font-size: 14px;
}

.domain-item {
  transition: background-color 0.2s ease;
}

.domain-item:hover {
  background: rgba(var(--v-theme-primary), 0.04);
}

/* 响应式设计 */
@media (max-width: 600px) {
  .domain-manage-container {
    padding: 0 8px;
  }
  
  .domain-column {
    font-size: 12px;
  }
  
  .domain-item {
    padding: 12px 8px;
  }
}
</style>