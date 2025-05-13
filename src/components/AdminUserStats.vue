<script setup>
import { ref, onMounted } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import { useUserStore } from '../stores/userStore'

const todoStore = useTodoStore()
const userStore = useUserStore()

const usersStats = ref([])
const selectedUserId = ref(null)

// 获取用户统计信息
const loadUserStats = () => {
  usersStats.value = todoStore.getUsersStats()
}

// 选择用户
const selectUser = (userId) => {
  selectedUserId.value = userId
}

// 重置用户选择
const resetUserSelection = () => {
  selectedUserId.value = null
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserStats()
})
</script>

<template>
  <div class="admin-stats">
    <div class="admin-header">
      <h2>用户待办事项统计</h2>
      <el-button 
        v-if="selectedUserId"
        @click="resetUserSelection" 
        size="small" 
        type="primary"
      >
        返回所有用户统计
      </el-button>
    </div>
    
    <div v-if="!selectedUserId" class="users-table">
      <el-table :data="usersStats" stripe style="width: 100%">
        <el-table-column prop="userName" label="用户名称" />
        <el-table-column prop="total" label="总待办事项" width="110" />
        <el-table-column prop="completed" label="已完成" width="100" />
        <el-table-column prop="uncompleted" label="未完成" width="100" />
        <el-table-column label="完成率" width="100">
          <template #default="scope">
            {{ scope.row.rate }}%
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button 
              type="primary" 
              size="small" 
              @click="selectUser(scope.row.userId)"
            >
              查看详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    
    <div v-else class="user-todos">
      <h3 class="user-title">
        {{ usersStats.find(u => u.userId === selectedUserId)?.userName }} 的待办事项
      </h3>
      
      <el-card v-for="todo in todoStore.getTodosByUserId(selectedUserId)" :key="todo.id" class="todo-card">
        <div class="todo-card-content">
          <div class="todo-card-header">
            <el-checkbox 
              :model-value="todo.completed"
              @change="todoStore.toggleTodo(todo.id)"
              size="large"
            />
            <span class="todo-text" :class="{ completed: todo.completed }">
              {{ todo.text }}
            </span>
          </div>
          
          <div class="todo-card-tags">
            <el-tag v-if="todo.priority" :type="getPriorityType(todo.priority)" size="small">
              {{ getPriorityLabel(todo.priority) }}
            </el-tag>
            <el-tag v-if="todo.dueDate" :type="todo.completed ? 'success' : 'danger'" size="small">
              截止: {{ todo.dueDate }}
            </el-tag>
          </div>
          
          <div class="todo-card-actions">
            <el-button 
              type="danger"
              size="small"
              icon="Delete"
              @click="todoStore.removeTodo(todo.id)"
            >
              删除
            </el-button>
          </div>
        </div>
      </el-card>
      
      <el-empty 
        v-if="todoStore.getTodosByUserId(selectedUserId).length === 0" 
        description="该用户暂无待办事项" 
      />
    </div>
  </div>
</template>

<script>
// 辅助函数，在模板中使用
function getPriorityType(priority) {
  switch(priority) {
    case 'high': return 'danger'
    case 'normal': return 'warning'
    case 'low': return 'info'
    default: return 'info'
  }
}

function getPriorityLabel(priority) {
  switch(priority) {
    case 'high': return '高'
    case 'normal': return '中'
    case 'low': return '低'
    default: return '中'
  }
}
</script>

<style scoped>
.admin-stats {
  width: 100%;
  max-width: 100%;
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.admin-header h2 {
  margin: 0;
  color: #409EFF;
}

.users-table {
  margin-bottom: 20px;
}

.user-title {
  margin-bottom: 15px;
  color: #606266;
  font-size: 18px;
  text-align: center;
}

.todo-card {
  margin-bottom: 10px;
}

.todo-card-content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.todo-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.todo-text {
  font-size: 16px;
  word-break: break-all;
}

.todo-text.completed {
  text-decoration: line-through;
  color: #909399;
}

.todo-card-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.todo-card-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

@media (max-width: 768px) {
  .admin-stats {
    padding: 15px;
  }
  
  .admin-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .todo-card-content {
    gap: 8px;
  }
  
  .todo-text {
    font-size: 14px;
  }
}
</style> 