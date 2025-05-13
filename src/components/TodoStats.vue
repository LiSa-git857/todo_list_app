<script setup>
import { useTodoStore } from '../stores/todoStore'

const todoStore = useTodoStore()
</script>

<template>
  <div class="todo-stats">
    <h3>待办事项统计</h3>
    <div class="stats-container">
      <div class="stat-item">
        <span class="stat-label">总计</span>
        <el-tag size="large">{{ todoStore.totalTodos }}</el-tag>
      </div>
      
      <div class="stat-item">
        <span class="stat-label">已完成</span>
        <el-tag size="large" type="success">{{ todoStore.completedTodos }}</el-tag>
      </div>
      
      <div class="stat-item">
        <span class="stat-label">未完成</span>
        <el-tag size="large" type="warning">{{ todoStore.uncompletedTodos }}</el-tag>
      </div>
      
      <div class="stat-item">
        <span class="stat-label">完成率</span>
        <el-progress 
          :percentage="todoStore.completionRate" 
          :stroke-width="15"
          :format="percent => `${percent}%`"
          :status="todoStore.completionRate === 100 ? 'success' : ''"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-stats {
  max-width: 800px;
  margin: 0 auto 20px;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
}

h3 {
  margin-top: 0;
  color: #409EFF;
  margin-bottom: 15px;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-label {
  font-weight: bold;
  color: #606266;
}

@media (max-width: 650px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 400px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style> 