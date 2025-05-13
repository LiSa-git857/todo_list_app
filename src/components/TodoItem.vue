<script setup>
import { useTodoStore } from '../stores/todoStore'
import { useUserStore } from '../stores/userStore'
import { formatDate, getRelativeDate } from '../utils/dateFormat'
import { computed } from 'vue'

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const todoStore = useTodoStore()
const userStore = useUserStore()

// 权限检查
const canCheckTodo = computed(() => userStore.hasPermission('check'))
const canUncheckTodo = computed(() => userStore.hasPermission('uncheck'))

// 处理复选框变更
const handleCheckChange = (checked) => {
  // 如果是从未完成到完成，检查"check"权限
  // 如果是从完成到未完成，检查"uncheck"权限
  if ((checked && canCheckTodo.value) || (!checked && canUncheckTodo.value)) {
    todoStore.toggleTodo(props.todo.id)
  } else if (!checked && !canUncheckTodo.value) {
    // 如果尝试取消勾选但没有权限，回到勾选状态
    return true // 保持勾选状态
  }
}

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

// 检查任务是否已过期但未完成
const isOverdue = computed(() => {
  if (!props.todo.dueDate || props.todo.completed) return false
  
  const dueDate = new Date(props.todo.dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return dueDate < today
})

// 获取截止日期标签的类型
const getDueDateTagType = computed(() => {
  if (isOverdue.value) return 'danger'
  return 'success'
})
</script>

<template>
  <div class="todo-item" :class="{ completed: todo.completed, overdue: isOverdue }">
    <el-checkbox 
      :model-value="todo.completed"
      @change="handleCheckChange"
      size="large"
      :disabled="todo.completed && !canUncheckTodo"
    />
    
    <div class="todo-content">
      <div class="todo-header">
        <span class="todo-text">{{ todo.text }}</span>
        <div class="todo-tags">
          <el-tag v-if="todo.priority" :type="getPriorityType(todo.priority)" size="small">
            {{ getPriorityLabel(todo.priority) }}
          </el-tag>
          <el-tag v-if="todo.dueDate" :type="getDueDateTagType" size="small">
            <el-tooltip
              :content="formatDate(todo.dueDate)"
              placement="top"
            >
              <span>
                <span v-if="isOverdue" style="margin-right: 4px">
                  <el-icon class="overdue-icon"><Warning /></el-icon>
                </span>
                截止: {{ getRelativeDate(todo.dueDate) }}
              </span>
            </el-tooltip>
          </el-tag>
        </div>
      </div>
      <div v-if="isOverdue" class="overdue-warning">
        <el-icon><Warning /></el-icon> 
        此任务已过期，请尽快完成
      </div>
    </div>
    
    <div class="todo-actions">
      <el-button 
        v-if="userStore.hasPermission('edit')"
        type="primary"
        size="small"
        circle
        icon="Edit"
        @click="$emit('edit', todo)"
      ></el-button>
      <el-button 
        v-if="userStore.hasPermission('delete')"
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
  min-width: 0; /* 防止内容溢出 */
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

/* 过期任务样式 */
.overdue {
  border-left: 4px solid #F56C6C;
  background-color: #FEF0F0;
}

.overdue-warning {
  color: #F56C6C;
  font-size: 12px;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.overdue-icon {
  margin-right: 2px;
  display: inline-flex;
  vertical-align: middle;
}

@media (max-width: 550px) {
  .todo-item {
    padding: 10px;
  }
  
  .todo-content {
    margin: 0 10px;
  }
  
  .todo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .todo-text {
    font-size: 14px;
  }
  
  .todo-actions {
    margin-top: 5px;
  }
}
</style> 