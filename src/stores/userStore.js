import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 定义不同用户角色及其权限
const ROLES = {
  ADMIN: {
    name: 'admin',
    permissions: ['add', 'edit', 'delete', 'check', 'uncheck']
  },
  USER: {
    name: 'user',
    permissions: ['add', 'check']
  }
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const currentUser = ref(null)
  const isLoggedIn = ref(false)
  
  // 预设用户列表 (在实际应用中应该从后端获取)
  const users = ref([
    { 
      id: 1, 
      username: 'admin', 
      password: '!Q@W#E4r5t6y', 
      name: '管理员',
      role: ROLES.ADMIN.name
    },
    { 
      id: 2, 
      username: 'user', 
      password: 'user123', 
      name: '普通用户',
      role: ROLES.USER.name
    }
  ])
  
  // 登录
  const login = (username, password) => {
    const user = users.value.find(
      u => u.username === username && u.password === password
    )
    
    if (user) {
      currentUser.value = {...user, password: undefined} // 移除密码
      isLoggedIn.value = true
      
      // 保存登录状态到本地存储
      localStorage.setItem('user', JSON.stringify(currentUser.value))
      localStorage.setItem('isLoggedIn', 'true')
      
      return true
    }
    
    return false
  }
  
  // 注销
  const logout = () => {
    currentUser.value = null
    isLoggedIn.value = false
    
    // 清除本地存储的登录状态
    localStorage.removeItem('user')
    localStorage.removeItem('isLoggedIn')
  }
  
  // 从本地存储恢复会话
  const restoreSession = () => {
    const savedUser = localStorage.getItem('user')
    const savedLoginState = localStorage.getItem('isLoggedIn')
    
    if (savedUser && savedLoginState === 'true') {
      currentUser.value = JSON.parse(savedUser)
      isLoggedIn.value = true
      return true
    }
    
    return false
  }
  
  // 检查权限
  const hasPermission = (permission) => {
    if (!currentUser.value) return false
    
    const role = currentUser.value.role
    if (role === ROLES.ADMIN.name) {
      return ROLES.ADMIN.permissions.includes(permission)
    } else if (role === ROLES.USER.name) {
      return ROLES.USER.permissions.includes(permission)
    }
    
    return false
  }
  
  // 用户角色
  const userRole = computed(() => {
    return currentUser.value ? currentUser.value.role : null
  })
  
  // 用户姓名
  const userName = computed(() => {
    return currentUser.value ? currentUser.value.name : ''
  })
  
  return { 
    currentUser, 
    isLoggedIn, 
    login, 
    logout, 
    restoreSession, 
    hasPermission,
    userRole,
    userName,
    ROLES
  }
}) 