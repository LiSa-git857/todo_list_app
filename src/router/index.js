import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import TodoList from '../components/TodoList.vue'
import AdminUserStats from '../components/AdminUserStats.vue'
import LoginForm from '../components/LoginForm.vue'

const routes = [
  {
    path: '/',
    redirect: '/todos'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginForm,
    meta: {
      requiresAuth: false,
      title: '登录'
    }
  },
  {
    path: '/todos',
    name: 'TodoList',
    component: TodoList,
    meta: {
      requiresAuth: true,
      title: '我的待办事项',
      roles: ['admin', 'user']
    }
  },
  {
    path: '/admin/users',
    name: 'AdminUserStats',
    component: AdminUserStats,
    meta: {
      requiresAuth: true,
      title: '用户待办事项',
      roles: ['admin']  // 只有管理员可访问
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 导航守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isLoggedIn = userStore.isLoggedIn
  const userRole = userStore.userRole
  
  // 如果路由需要认证
  if (to.meta.requiresAuth) {
    if (!isLoggedIn) {
      // 未登录，重定向到登录页
      next({ name: 'Login' })
      return
    }
    
    // 如果路由指定了角色要求
    if (to.meta.roles && to.meta.roles.length > 0) {
      // 检查用户是否有权限访问
      if (to.meta.roles.includes(userRole)) {
        next() // 有权限，允许访问
      } else {
        // 无权限，重定向到默认页面
        next({ name: 'TodoList' })
      }
    } else {
      next() // 没有指定角色要求，允许访问
    }
  } else {
    // 如果已登录且尝试访问登录页，重定向到首页
    if (isLoggedIn && to.name === 'Login') {
      next({ name: 'TodoList' })
    } else {
      next() // 不需要认证的路由，直接访问
    }
  }
})

export default router 