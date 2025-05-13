<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/userStore'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  User, 
  SwitchButton, 
  List, 
  HomeFilled
} from '@element-plus/icons-vue'

const userStore = useUserStore()
const router = useRouter()

// 检查是否为管理员
const isAdmin = computed(() => userStore.userRole === 'admin')

onMounted(() => {
  // 尝试从本地存储恢复会话
  if (userStore.restoreSession()) {
    router.push('/todos')
    ElMessage.success(`欢迎回来，${userStore.userName}`)
  } else {
    router.push('/login')
  }
})

const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出登录吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    userStore.logout()
    router.push('/login')
    ElMessage.success('已安全退出登录')
  }).catch(() => {
    // 用户取消
  })
}

// 导航至路由
const navigateAndCloseSidebar = (route) => {
  router.push(route)
}
</script>

<template>
  <div class="app-wrapper">
    <!-- 未登录用户直接显示登录页面 -->
    <template v-if="!userStore.isLoggedIn">
      <router-view />
    </template>
    
    <!-- 已登录用户显示应用导航和布局 -->
    <template v-else>
      <div class="common-layout">
        <el-container class="main-layout">
          <!-- 顶部标题栏 -->
          <el-header height="60px" class="app-header">
            <div class="header-content">
              <div class="logo-container">
                <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="30" height="30" />
                <h1 class="app-title">待办事项管理系统</h1>
              </div>
              
              <div class="header-right">
                <!-- 用户信息 -->
                <div class="user-info-header">
                  <el-avatar 
                    :size="32" 
                    :icon="User"
                    class="user-avatar"
                    :style="{ backgroundColor: isAdmin ? '#f56c6c' : '#909399' }"
                  />
                  <div class="user-details-header">
                    <el-tag v-if="isAdmin" type="danger" size="small" effect="dark">管理员</el-tag>
                    <el-tag v-else type="info" size="small" effect="dark">普通用户</el-tag>
                  </div>
                </div>
                
                <!-- 退出登录按钮 -->
                <el-button 
                  type="danger" 
                  @click="handleLogout" 
                  class="logout-button-header"
                  :icon="SwitchButton"
                  size="small"
                  round
                >
                  退出登录
                </el-button>
              </div>
            </div>
          </el-header>
          
          <el-container class="content-container">
            <!-- 侧边栏导航 -->
            <el-aside width="200px" class="app-sidebar">
              <el-menu
                :default-active="$route.path"
                class="sidebar-menu"
                background-color="#304156"
                text-color="#bfcbd9"
                active-text-color="#409EFF"
              >
                <el-menu-item index="/todos" @click="navigateAndCloseSidebar('/todos')">
                  <el-icon><List /></el-icon>
                  <span>我的待办事项</span>
                </el-menu-item>
                
                <el-menu-item 
                  v-if="isAdmin" 
                  index="/admin/users"
                  @click="navigateAndCloseSidebar('/admin/users')"
                >
                  <el-icon><User /></el-icon>
                  <span>用户待办事项</span>
                </el-menu-item>
              </el-menu>
            </el-aside>
            
            <el-container class="right-container">
              <!-- 主内容区域 -->
              <el-main class="app-main">
                <div class="page-header">
                  <div class="breadcrumb">
                    <el-icon><HomeFilled /></el-icon>
                    <span>{{ $route.meta.title || '待办事项管理系统' }}</span>
                  </div>
                </div>
                
                <div class="main-content">
                  <router-view />
                </div>
              </el-main>
              
              <!-- 页脚 -->
              <el-footer height="40px" class="app-footer">
                <p>待办事项管理系统 &copy; {{ new Date().getFullYear() }}</p>
              </el-footer>
            </el-container>
          </el-container>
        </el-container>
      </div>
    </template>
  </div>
</template>

<style>
:root {
  --header-height: 60px;
  --footer-height: 40px;
}

html, body, #app {
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background-color: #f5f7fa;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}

#app {
  display: flex;
  flex-direction: column;
}

/* 确保Element Plus容器占满空间 */
.el-container {
  height: 100%;
  width: 100%;
}

/* 调整内容滚动区域 */
.el-scrollbar__wrap {
  overflow-x: hidden;
}

/* 隐藏底部滚动条指示器 */
.el-popper, 
.el-scrollbar__bar,
.el-select-dropdown__item,
.el-select-dropdown__wrap,
.el-scrollbar__wrap {
  margin-bottom: 0 !important;
}

/* 移除底部多余的指示器 */
.el-popper[x-placement^=bottom] .popper__arrow,
.el-scrollbar__bar.is-horizontal {
  display: none !important;
}
</style>

<style scoped>
.app-wrapper {
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.common-layout {
  height: 100%;
  width: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.main-layout {
  width: 100%;
  height: 100%;
  flex-direction: column;
}

.content-container {
  height: calc(100vh - var(--header-height));
  width: 100%;
  display: flex;
  overflow: hidden;
}

.right-container {
  flex-direction: column;
  flex: 1;
  width: calc(100% - 200px);
  overflow: hidden;
  display: flex;
}

/* 顶部标题栏样式 */
.app-header {
  padding: 0;
  background-color: #304156;
  color: #fff;
  display: flex;
  align-items: center;
  line-height: 60px;
  border-bottom: 1px solid #263445;
  width: 100%;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0 20px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.app-title {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #fff;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* 右上角用户信息样式 */
.user-info-header {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 20px;
  transition: background-color 0.3s;
}

.user-info-header:hover {
  background-color: #40516d;
}

.user-avatar {
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
}

.user-details-header {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name-header {
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
}

/* 退出按钮样式 */
.logout-button-header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  transition: all 0.3s;
  font-weight: 500;
}

.logout-button-header:hover {
  background-color: #f56c6c;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.4);
}

.logout-button-header:active {
  transform: translateY(0);
}

/* 侧边栏样式 */
.app-sidebar {
  background-color: #304156;
  color: #bfcbd9;
  height: 100%;
  overflow-y: auto;
  border-right: 1px solid #263445;
  width: 200px !important;
}

.sidebar-menu {
  border-right: none;
  height: 100%;
}

/* 主内容区域和容器样式 */
.app-main {
  padding: 20px;
  background-color: #f5f7fa;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: calc(100vh - var(--header-height) - var(--footer-height));
}

.page-header {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  color: #606266;
}

.main-content {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 20px;
  flex: 1;
  width: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.app-footer {
  text-align: center;
  color: #606266;
  font-size: 12px;
  padding: 10px 20px;
  background-color: #fff;
  border-top: 1px solid #e6e6e6;
  width: 100%;
  height: var(--footer-height);
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 响应式设计 */
@media screen and (max-width: 992px) {
  .user-details-header {
    display: none;
  }
  
  .logout-button-header span {
    display: none;
  }
  
  .logout-button-header {
    padding: 6px;
  }
  
  .right-container {
    width: calc(100% - 64px);
  }
}

@media screen and (max-width: 768px) {
  .app-sidebar {
    width: 64px !important;
  }
  
  .app-title {
    display: none;
  }
  
  .main-content {
    padding: 15px;
  }
  
  .app-main {
    padding: 10px;
  }
}

@media screen and (max-width: 576px) {
  .header-content {
    padding: 0 10px;
  }
  
  .logo-container {
    gap: 5px;
  }
  
  .logout-button-header {
    padding: 4px;
  }
}
</style>
