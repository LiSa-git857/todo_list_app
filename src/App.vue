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
      <div class="main-content">
        <TodoList />
      </div>
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
  display: flex;
  justify-content: center;
  align-items: center;
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
.app-container {
  min-height: 100vh;
  background-color:skyblue;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 0;
  gap: 15px;
  width: 100%;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.app-title {
  margin: 0;
  color: #409EFF;
  font-size: 1.8rem;
}

.el-header {
  padding: 0;
  background-color: white;
  border-bottom: 1px solid #ebeef5;
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  display: flex;
  justify-content: center;
}

.el-main {
  padding: 20px;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
}

.main-content {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.el-footer {
  text-align: center;
  color: #606266;
  padding: 20px 0;
  font-size: 14px;
  background-color: white;
  border-top: 1px solid #ebeef5;
  width: 100%;
  display: flex;
  justify-content: center;
}

@media (max-width: 768px) {
  .app-title {
    font-size: 1.4rem;
  }
  
  .logo {
    width: 40px;
    height: 40px;
  }
  
  .el-main {
    padding: 10px;
  }
  
  .main-content {
    padding: 0 10px;
    width: 100%;
  }
}
</style>
