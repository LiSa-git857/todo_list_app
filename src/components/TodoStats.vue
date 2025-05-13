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
  width: 100%;
  max-width: 100%;
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

@media (max-width: 768px) {
  .todo-stats {
    padding: 15px;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
}

@media (max-width: 400px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style> 