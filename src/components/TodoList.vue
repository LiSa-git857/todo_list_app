<script setup>
import { ref, computed } from 'vue';
import { useTodoStore } from '../stores/todoStore';
import TodoItem from './TodoItem.vue';
import TodoForm from './TodoForm.vue';
import TodoFilter from './TodoFilter.vue';
import TodoStats from './TodoStats.vue';
import { ElMessageBox } from 'element-plus';
import { formatDate } from '../utils/dateFormat';

const todoStore = useTodoStore();
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
</script>

<template>
  <div class="todo-app">
    <div class="todo-header">
      <h1>我的待办事项</h1>
    </div>
    
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
            clearable
          />
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
}
</style> 