<script setup>
import { ref } from 'vue'
import { useTodoStore } from '../stores/todoStore'
import { useUserStore } from '../stores/userStore'
import { ElMessage } from 'element-plus'
import { formatDate } from '../utils/dateFormat'

const todoStore = useTodoStore()
const userStore = useUserStore()

// 检查是否有添加待办事项的权限
const canAddTodo = userStore.hasPermission('add')

const newTodo = ref('')
const priority = ref('normal')
const dueDate = ref('')
const adding = ref(false)

const priorityOptions = [
  { value: 'high', label: '高' },
  { value: 'normal', label: '中' },
  { value: 'low', label: '低' }
]

// 日期选择快捷方式
const dateShortcuts = [
  {
    text: '今天',
    value: new Date(),
  },
  {
    text: '明天',
    value: (() => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24)
      return date
    })(),
  },
  {
    text: '一周后',
    value: (() => {
      const date = new Date()
      date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
      return date
    })(),
  },
  {
    text: '一个月后',
    value: (() => {
      const date = new Date()
      date.setMonth(date.getMonth() + 1)
      return date
    })(),
  }
]

const addTodo = () => {
  if (!canAddTodo) {
    ElMessage.error('您没有添加待办事项的权限')
    return
  }
  
  if (newTodo.value.trim()) {
    adding.value = true
    
    try {
      todoStore.addTodo(newTodo.value, priority.value, dueDate.value || null)
      ElMessage({
        message: '待办事项添加成功',
        type: 'success'
      })
      // 重置表单
      newTodo.value = ''
      priority.value = 'normal'
      dueDate.value = ''
    } finally {
      adding.value = false
    }
  } else {
    ElMessage({
      message: '请输入待办事项内容',
      type: 'warning'
    })
  }
}
</script>

<template>
  <div class="todo-form">
    <h2>添加新待办事项</h2>
    <el-form @submit.prevent="addTodo">
      <el-form-item>
        <div class="input-with-button">
          <el-input 
            v-model="newTodo" 
            placeholder="输入待办事项..." 
            clearable
            @keyup.enter="addTodo"
            :disabled="!canAddTodo"
            class="todo-input"
          >
          </el-input>
          <el-button 
            @click="addTodo" 
            type="primary" 
            :disabled="!canAddTodo"
            class="add-button"
            :loading="adding"
            size="large"
            icon="Plus"
          >
            添加
          </el-button>
        </div>
      </el-form-item>
      
      <div class="form-options">
        <el-form-item label="优先级">
          <el-select style="width: 100px" v-model="priority" placeholder="选择优先级" :disabled="!canAddTodo">
            <el-option
              v-for="item in priorityOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="dueDate"
            type="date"
            placeholder="选择日期"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
            :shortcuts="dateShortcuts"
            :editable="false"
            :disabled-date="(time) => time.getTime() < Date.now() - 8.64e7"
            class="date-picker"
            :disabled="!canAddTodo"
          >
          </el-date-picker>
          <div class="date-picker-tip" v-if="dueDate">
            <span>截止日期：{{ formatDate(dueDate) }}</span>
          </div>
        </el-form-item>
      </div>
      
      <el-alert v-if="!canAddTodo" type="warning" show-icon>
        您没有添加待办事项的权限
      </el-alert>
    </el-form>
  </div>
</template>

<style scoped>
.todo-form {
  width: 100%;
  max-width: 100%;
  margin: 0 auto 20px;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin-top: 0;
  text-align: center;
  color: #409EFF;
  margin-bottom: 20px;
  width: 100%;
}

.el-form {
  width: 100%;
}

.input-with-button {
  display: flex;
  gap: 10px;
  width: 100%;
  align-items: center;
}

.todo-input {
  flex: 1;
}

.form-options {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  width: 100%;
}

.date-picker {
  width: 100%;
}

.date-picker-tip {
  margin-top: 5px;
  color: #606266;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.cell.is-today {
  color: #409EFF;
  font-weight: bold;
}

.add-button {
  padding: 12px 20px;
  font-weight: 500;
  transition: all 0.3s;
  border-radius: 4px;
}

.add-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.4);
}

.add-button:not(:disabled):active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .todo-form {
    padding: 15px;
    width: 100%;
  }
  
  .form-options {
    flex-direction: column;
    gap: 10px;
  }
  
  h2 {
    font-size: 1.4rem;
    margin-bottom: 15px;
  }
}
</style> 