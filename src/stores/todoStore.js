import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore'

export const useTodoStore = defineStore('todo', () => {
  // 状态
  const todos = ref([])
  const userStore = useUserStore()
  
  // 从localStorage加载数据
  const loadTodos = () => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      todos.value = JSON.parse(savedTodos)
    }
  }
  
  // 保存数据到localStorage
  const saveTodos = () => {
    localStorage.setItem('todos', JSON.stringify(todos.value))
  }
  
  // 添加新待办事项
  const addTodo = (text, priority = 'normal', dueDate = null) => {
    const newTodo = {
      id: Date.now(),
      text,
      priority,
      dueDate,
      completed: false,
      createdAt: new Date().toISOString(),
      userId: userStore.currentUser?.id || null, // 添加用户ID
      userName: userStore.currentUser?.name || '未知用户' // 添加用户名称
    }
    todos.value.push(newTodo)
    saveTodos()
  }
  
  // 删除待办事项
  const removeTodo = (id) => {
    todos.value = todos.value.filter(todo => todo.id !== id)
    saveTodos()
  }
  
  // 更新待办事项
  const updateTodo = (id, updates) => {
    const index = todos.value.findIndex(todo => todo.id === id)
    if (index !== -1) {
      todos.value[index] = { ...todos.value[index], ...updates }
      saveTodos()
    }
  }
  
  // 切换待办事项状态
  const toggleTodo = (id) => {
    const todo = todos.value.find(todo => todo.id === id)
    if (todo) {
      todo.completed = !todo.completed
      saveTodos()
    }
  }
  
  // 计算属性：统计信息
  const totalTodos = computed(() => {
    return getUserTodos().length
  })
  
  const completedTodos = computed(() => {
    return getUserTodos().filter(todo => todo.completed).length
  })
  
  const uncompletedTodos = computed(() => {
    return getUserTodos().filter(todo => !todo.completed).length
  })
  
  const completionRate = computed(() => {
    if (totalTodos.value === 0) return 0
    return Math.round((completedTodos.value / totalTodos.value) * 100)
  })
  
  // 获取当前用户的待办事项
  const getUserTodos = () => {
    if (!userStore.currentUser) return []
    return todos.value.filter(todo => todo.userId === userStore.currentUser.id)
  }
  
  // 根据用户ID获取待办事项
  const getTodosByUserId = (userId) => {
    return todos.value.filter(todo => todo.userId === userId)
  }
  
  // 过滤函数
  const getFilteredTodos = (filter = 'all', sortBy = 'createdAt', userId = null) => {
    // 默认获取当前用户的待办事项，管理员可以指定用户ID或获取所有待办事项
    let filteredTodos = []
    
    if (userStore.userRole === 'admin' && userId !== null) {
      // 管理员查看特定用户的待办事项
      filteredTodos = [...todos.value.filter(todo => todo.userId === userId)]
    } else {
      // 普通用户和管理员都只查看自己的待办事项
      filteredTodos = [...getUserTodos()]
    }
    
    // 应用过滤条件
    if (filter === 'completed') {
      filteredTodos = filteredTodos.filter(todo => todo.completed)
    } else if (filter === 'active') {
      filteredTodos = filteredTodos.filter(todo => !todo.completed)
    }
    
    // 应用排序
    filteredTodos.sort((a, b) => {
      if (sortBy === 'priority') {
        const priorityMap = { high: 3, normal: 2, low: 1 }
        return priorityMap[b.priority] - priorityMap[a.priority]
      } else if (sortBy === 'dueDate') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      } else {
        // 默认按创建时间排序
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })
    
    return filteredTodos
  }
  
  // 获取所有用户的统计信息
  const getUsersStats = () => {
    // 从待办事项中提取所有用户ID
    const userIds = [...new Set(todos.value.map(todo => todo.userId))]
    
    return userIds.map(userId => {
      const userTodos = todos.value.filter(todo => todo.userId === userId)
      const userName = userTodos[0]?.userName || '未知用户'
      const total = userTodos.length
      const completed = userTodos.filter(todo => todo.completed).length
      const uncompleted = total - completed
      const rate = total > 0 ? Math.round((completed / total) * 100) : 0
      
      return {
        userId,
        userName,
        total,
        completed,
        uncompleted,
        rate
      }
    })
  }
  
  // 初始加载
  loadTodos()
  
  return { 
    todos, 
    addTodo, 
    removeTodo, 
    updateTodo, 
    toggleTodo, 
    totalTodos, 
    completedTodos, 
    uncompletedTodos, 
    completionRate,
    getFilteredTodos,
    getUserTodos,
    getTodosByUserId,
    getUsersStats
  }
}) 