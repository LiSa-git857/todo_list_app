<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTodoStore } from '../stores/todoStore';
import { useUserStore } from '../stores/userStore';
import TodoItem from './TodoItem.vue';
import TodoForm from './TodoForm.vue';
import TodoFilter from './TodoFilter.vue';
import TodoStats from './TodoStats.vue';
import { ElMessageBox, ElNotification } from 'element-plus';
import { formatDate } from '../utils/dateFormat';

const todoStore = useTodoStore();
const userStore = useUserStore();
const activeFilter = ref('all');
const activeSortBy = ref('createdAt');
const editingTodo = ref(null);
const dialogVisible = ref(false);
const editForm = ref({
  text: '',
  priority: 'normal',
  dueDate: null
});

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
    text: '不设置',
    value: null,
  }
];

// 根据过滤条件获取待办事项
const filteredTodos = computed(() => {
  return todoStore.getFilteredTodos(activeFilter.value, activeSortBy.value);
});

// 获取过期未完成的任务
const overdueTasks = computed(() => {
  return todoStore.todos.filter(todo => {
    if (!todo.dueDate || todo.completed) return false
    
    const dueDate = new Date(todo.dueDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    return dueDate < today
  })
});

// 显示过期任务数量
const overdueTasksCount = computed(() => overdueTasks.value.length);

// 检查过期任务并提醒
const checkOverdueTasks = () => {
  if (overdueTasksCount.value > 0) {
    ElNotification({
      title: '提醒',
      message: `您有 ${overdueTasksCount.value} 个待办事项已过期未完成`,
      type: 'warning',
      duration: 5000
    });
  }
};

// 组件挂载时检查过期任务
onMounted(() => {
  checkOverdueTasks();
  
  // 每天检查一次过期任务
  // 计算到第二天凌晨的毫秒数
  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const timeToTomorrow = tomorrow - now;
  
  setTimeout(() => {
    checkOverdueTasks();
    // 设置每24小时检查一次
    setInterval(checkOverdueTasks, 24 * 60 * 60 * 1000);
  }, timeToTomorrow);
});

const handleFilterChange = (filter) => {
  activeFilter.value = filter;
};

const handleSortChange = (sortBy) => {
  activeSortBy.value = sortBy;
};

const openEditDialog = (todo) => {
  editingTodo.value = todo;
  editForm.value = {
    text: todo.text,
    priority: todo.priority || 'normal',
    dueDate: todo.dueDate || null
  };
  dialogVisible.value = true;
};

const saveEdit = () => {
  if (editForm.value.text.trim()) {
    todoStore.updateTodo(editingTodo.value.id, {
      text: editForm.value.text,
      priority: editForm.value.priority,
      dueDate: editForm.value.dueDate
    });
    dialogVisible.value = false;
  }
};

const confirmDelete = (id) => {
  ElMessageBox.confirm(
    '确定要删除这个待办事项吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      todoStore.removeTodo(id);
    })
    .catch(() => {
      // 用户取消删除操作
    });
};

const isAdmin = computed(() => userStore.userRole === 'admin');
</script>

<template>
  <div class="todo-app">
    <div class="todo-header">
      <h1>我的待办事项</h1>
    </div>
    
    <!-- 过期任务提醒 -->
    <el-alert
      v-if="overdueTasksCount > 0"
      :title="`您有 ${overdueTasksCount} 个待办事项已过期未完成`"
      type="warning"
      show-icon
      :closable="false"
      class="overdue-alert"
    >
      <template #default>
        <div class="overdue-alert-content">
          请尽快处理这些过期任务，或者更新截止日期。
          <el-button 
            type="primary" 
            size="small" 
            @click="activeFilter = 'active'; activeSortBy = 'dueDate'"
          >
            查看过期任务
          </el-button>
        </div>
      </template>
    </el-alert>
    
    <!-- 待办事项统计 -->
    <TodoStats />
    
    <!-- 添加新待办事项 -->
    <TodoForm />
    
    <!-- 过滤和排序 -->
    <TodoFilter 
      :active-filter="activeFilter" 
      :active-sort-by="activeSortBy"
      @filter-change="handleFilterChange"
      @sort-change="handleSortChange"
    />
    
    <!-- 待办事项列表 -->
    <div class="todo-list-container">
      <h3>待办事项列表</h3>
      
      <el-empty 
        v-if="filteredTodos.length === 0" 
        description="没有待办事项，请添加一个！" 
      />
      
      <div v-else class="todo-list">
        <TodoItem 
          v-for="todo in filteredTodos" 
          :key="todo.id" 
          :todo="todo"
          @edit="openEditDialog"
        />
      </div>
    </div>
    
    <!-- 编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      title="编辑待办事项"
      width="500px"
      :append-to-body="true"
      :close-on-click-modal="false"
    >
      <el-form>
        <el-form-item label="内容">
          <el-input v-model="editForm.text" placeholder="待办事项内容"></el-input>
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="editForm.priority">
            <el-option label="高" value="high"></el-option>
            <el-option label="中" value="normal"></el-option>
            <el-option label="低" value="low"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="截止日期">
          <el-date-picker
            v-model="editForm.dueDate"
            type="date"
            placeholder="选择日期"
            format="YYYY年MM月DD日"
            value-format="YYYY-MM-DD"
            :shortcuts="dateShortcuts"
            :editable="false"
            :disabled-date="(time) => time.getTime() < Date.now() - 8.64e7"
            clearable
          />
          <div v-if="editForm.dueDate" class="date-tip">
            <el-icon><Clock /></el-icon>
            <span>截止日期：{{ formatDate(editForm.dueDate) }}</span>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.todo-app {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.todo-header {
  text-align: center;
  margin-bottom: 20px;
  width: 100%;
}

h1 {
  color: #409EFF;
  font-size: 2rem;
  margin: 0;
  padding: 10px 0;
}

.overdue-alert {
  width: 100%;
  margin-bottom: 20px;
}

.overdue-alert-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.todo-list-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-bottom: 20px;
  width: 100%;
}

h3 {
  margin-top: 0;
  color: #409EFF;
  margin-bottom: 15px;
}

.todo-list {
  margin-top: 15px;
  width: 100%;
}

.dialog-footer {
  padding-top: 10px;
  text-align: right;
}

.date-tip {
  margin-top: 5px;
  color: #606266;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
}

/* 移除底部滚动条指示器 */
:deep(.el-scrollbar__bar.is-horizontal) {
  display: none !important;
}

@media (max-width: 768px) {
  .todo-app {
    width: 100%;
    padding: 0;
  }
  
  h1 {
    font-size: 1.6rem;
  }
  
  .todo-list-container {
    padding: 15px;
    width: 100%;
  }
  
  .overdue-alert-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .overdue-alert-content button {
    margin-top: 5px;
  }
}
</style> 