<script setup>
import { useTodoStore } from '../stores/todoStore'
import { formatDate, getRelativeDate } from '../utils/dateFormat'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const todoStore = useTodoStore()

const getPriorityType = (priority) => {
  switch(priority) {
    case 'high': return 'danger'
    case 'normal': return 'warning'
    case 'low': return 'info'
    default: return 'info'
  }
}

const getPriorityLabel = (priority) => {
  switch(priority) {
    case 'high': return '高'
    case 'normal': return '中'
    case 'low': return '低'
    default: return '中'
  }
}
</script>

<template>
  <div class="todo-item" :class="{ completed: todo.completed }">
    <el-checkbox 
      v-model="todo.completed" 
      @change="todoStore.toggleTodo(todo.id)"
      size="large"
    />
    
    <div class="todo-content">
      <div class="todo-header">
        <span class="todo-text">{{ todo.text }}</span>
        <div class="todo-tags">
          <el-tag v-if="todo.priority" :type="getPriorityType(todo.priority)" size="small">
            {{ getPriorityLabel(todo.priority) }}
          </el-tag>
          <el-tag v-if="todo.dueDate" type="success" size="small">
            <el-tooltip
              :content="formatDate(todo.dueDate)"
              placement="top"
            >
              <span>截止: {{ getRelativeDate(todo.dueDate) }}</span>
            </el-tooltip>
          </el-tag>
        </div>
      </div>
    </div>
    
    <div class="todo-actions">
      <el-button 
        type="primary"
        size="small"
        circle
        icon="Edit"
        @click="$emit('edit', todo)"
      ></el-button>
      <el-button 
        type="danger"
        size="small"
        circle
        icon="Delete"
        @click="todoStore.removeTodo(todo.id)"
      ></el-button>
    </div>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  background-color: #f9f9f9;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.todo-item:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.todo-content {
  flex: 1;
  margin: 0 15px;
}

.todo-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.todo-text {
  font-size: 16px;
  line-height: 1.4;
  word-break: break-word;
}

.todo-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.todo-actions {
  display: flex;
  gap: 5px;
}

.completed {
  opacity: 0.7;
}

.completed .todo-text {
  text-decoration: line-through;
  color: #888;
}

@media (max-width: 550px) {
  .todo-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .todo-actions {
    margin-top: 5px;
  }
}
</style> 