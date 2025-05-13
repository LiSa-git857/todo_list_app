<script setup>
import TodoList from './components/TodoList.vue'
</script>

<template>
  <el-container class="app-container">
    <el-header height="auto">
      <div class="app-header">
        <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="60" height="60" />
        <h1 class="app-title">待办事项管理系统</h1>
      </div>
    </el-header>
    
    <el-main>
      <TodoList />
    </el-main>
    
    <el-footer>
      <p>待办事项应用 &copy; {{ new Date().getFullYear() }}</p>
    </el-footer>
  </el-container>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f5f7fa;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  gap: 15px;
}

.app-title {
  margin: 0;
  color: #409EFF;
  font-size: 1.8rem;
}

.el-header {
  padding: 0;
  background-color: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-main {
  padding: 20px;
}

.el-footer {
  text-align: center;
  color: #606266;
  padding: 20px 0;
  font-size: 14px;
}

@media (max-width: 768px) {
  .app-title {
    font-size: 1.4rem;
  }
  
  .logo {
    width: 40px;
    height: 40px;
  }
}
</style>
