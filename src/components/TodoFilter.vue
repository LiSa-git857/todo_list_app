<script setup>
import { ref } from 'vue'

const props = defineProps({
  activeFilter: {
    type: String,
    default: 'all'
  },
  activeSortBy: {
    type: String,
    default: 'createdAt'
  }
})

const emit = defineEmits(['filter-change', 'sort-change'])

const filterOptions = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'completed', label: '已完成' }
]

const sortOptions = [
  { value: 'createdAt', label: '创建时间' },
  { value: 'priority', label: '优先级' },
  { value: 'dueDate', label: '截止日期' }
]

// 本地状态与props同步
const localFilter = ref(props.activeFilter)
const localSortBy = ref(props.activeSortBy)

// 监听本地状态变化并触发事件
const onFilterChange = (value) => {
  localFilter.value = value
  emit('filter-change', value)
}

const onSortChange = (value) => {
  localSortBy.value = value
  emit('sort-change', value)
}
</script>

<template>
  <div class="todo-filter">
    <h3>筛选与排序</h3>
    <div class="filter-container">
      <div class="filter-group">
        <span class="filter-label">显示：</span>
        <el-radio-group v-model="localFilter" @change="onFilterChange">
          <el-radio-button 
            v-for="option in filterOptions" 
            :key="option.value" 
            :label="option.value"
          >
            {{ option.label }}
          </el-radio-button>
        </el-radio-group>
      </div>
      
      <div class="filter-group">
        <span class="filter-label">排序方式：</span>
        <el-select v-model="localSortBy" @change="onSortChange" placeholder="排序方式" style="min-width: 120px;">
          <el-option
            v-for="option in sortOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-filter {
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

.filter-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 15px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-label {
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #606266;
}

@media (max-width: 768px) {
  .todo-filter {
    padding: 15px;
  }
  
  .filter-container {
    flex-direction: column;
    align-items: flex-start;
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
}
</style> 