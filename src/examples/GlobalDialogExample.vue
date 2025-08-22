<!--
/**
 * @fileoverview 全局对话框使用示例
 * @description 展示全局对话框组件的各种使用方法
 * @author 开发团队
 * @created 2024-01-20
 * @version 1.0.0
 */
-->

<template>
  <v-container class="pa-6">
    <v-card class="jelly-card" rounded="xl">
      <v-card-title class="text-h4 pa-6">
        <v-icon class="me-3" color="primary">mdi-message-alert</v-icon>
        全局对话框使用示例
      </v-card-title>
      
      <v-card-text class="pa-6">
        <v-row>
          <!-- 基础对话框 -->
          <v-col cols="12" md="6">
            <v-card class="mb-4" variant="outlined">
              <v-card-title class="text-h6">基础对话框</v-card-title>
              <v-card-text>
                <v-btn
                  color="info"
                  variant="flat"
                  class="mb-2 me-2"
                  @click="showInfoDialog"
                >
                  信息对话框
                </v-btn>
                
                <v-btn
                  color="success"
                  variant="flat"
                  class="mb-2 me-2"
                  @click="showSuccessDialog"
                >
                  成功对话框
                </v-btn>
                
                <v-btn
                  color="warning"
                  variant="flat"
                  class="mb-2 me-2"
                  @click="showWarningDialog"
                >
                  警告对话框
                </v-btn>
                
                <v-btn
                  color="error"
                  variant="flat"
                  class="mb-2 me-2"
                  @click="showErrorDialog"
                >
                  错误对话框
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- 交互对话框 -->
          <v-col cols="12" md="6">
            <v-card class="mb-4" variant="outlined">
              <v-card-title class="text-h6">交互对话框</v-card-title>
              <v-card-text>
                <v-btn
                  color="primary"
                  variant="flat"
                  class="mb-2 me-2"
                  @click="showConfirmDialog"
                >
                  确认对话框
                </v-btn>
                
                <v-btn
                  color="secondary"
                  variant="flat"
                  class="mb-2 me-2"
                  @click="showLoadingDialog"
                >
                  加载对话框
                </v-btn>
                
                <v-btn
                  color="purple"
                  variant="flat"
                  class="mb-2 me-2"
                  @click="showCustomDialog"
                >
                  自定义对话框
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- 结果显示 -->
          <v-col cols="12">
            <v-card variant="outlined">
              <v-card-title class="text-h6">操作结果</v-card-title>
              <v-card-text>
                <v-alert
                  v-if="lastResult"
                  :type="lastResult.type"
                  :text="lastResult.message"
                  variant="tonal"
                  class="mb-4"
                />
                <div v-else class="text-body-2 text-medium-emphasis">
                  点击上方按钮查看对话框效果
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { globalDialog } from '@/composables/useGlobalDialog'

/**
 * 操作结果
 */
const lastResult = ref<{type: 'success' | 'info' | 'warning' | 'error', message: string} | null>(null)

/**
 * 显示信息对话框
 */
const showInfoDialog = () => {
  globalDialog.showInfo(
    '信息提示',
    '这是一个信息对话框，用于显示一般性信息。',
    {
      onConfirm: () => {
        lastResult.value = {
          type: 'info',
          message: '用户点击了信息对话框的确定按钮'
        }
      }
    }
  )
}

/**
 * 显示成功对话框
 */
const showSuccessDialog = () => {
  globalDialog.showSuccess(
    '操作成功',
    '您的操作已成功完成！',
    {
      onConfirm: () => {
        lastResult.value = {
          type: 'success',
          message: '用户确认了成功消息'
        }
      }
    }
  )
}

/**
 * 显示警告对话框
 */
const showWarningDialog = () => {
  globalDialog.showWarning(
    '注意事项',
    '请注意：此操作可能会影响系统性能。',
    {
      onConfirm: () => {
        lastResult.value = {
          type: 'warning',
          message: '用户已阅读警告信息'
        }
      }
    }
  )
}

/**
 * 显示错误对话框
 */
const showErrorDialog = () => {
  globalDialog.showError(
    '操作失败',
    '抱歉，操作执行失败，请稍后重试。',
    {
      onConfirm: () => {
        lastResult.value = {
          type: 'error',
          message: '用户确认了错误信息'
        }
      }
    }
  )
}

/**
 * 显示确认对话框
 */
const showConfirmDialog = async () => {
  const confirmed = await globalDialog.showConfirm(
    '确认操作',
    '您确定要执行此操作吗？此操作不可撤销。'
  )
  
  lastResult.value = {
    type: confirmed ? 'success' : 'info',
    message: confirmed ? '用户确认了操作' : '用户取消了操作'
  }
}

/**
 * 显示加载对话框
 */
const showLoadingDialog = () => {
  globalDialog.showLoading('正在处理', '请稍候，系统正在处理您的请求...')
  
  // 模拟异步操作
  setTimeout(() => {
    globalDialog.hideDialog()
    lastResult.value = {
      type: 'success',
      message: '模拟操作完成，加载对话框已关闭'
    }
  }, 3000)
}

/**
 * 显示自定义对话框
 */
const showCustomDialog = () => {
  globalDialog.showDialog({
    type: 'custom',
    title: '自定义对话框',
    message: '您可以自定义对话框的各种属性，包括按钮文本、图标等。这个对话框采用了Vuetify的标准样式。',
    icon: 'mdi-star',
    maxWidth: 600,
    confirmButtonText: '太棒了',
    cancelButtonText: '返回',
    onConfirm: () => {
      lastResult.value = {
        type: 'success',
        message: '用户喜欢自定义对话框'
      }
    },
    onCancel: () => {
      lastResult.value = {
        type: 'info',
        message: '用户返回了'
      }
    }
  })
}
</script>

<style scoped>
/**
 * 示例页面样式
 */

/* 果冻效果 */
.jelly-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.jelly-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 按钮样式 */
.v-btn {
  transition: all 0.2s ease;
}

.v-btn:hover {
  transform: scale(1.05);
}

.v-btn:active {
  transform: scale(0.95);
}
</style>