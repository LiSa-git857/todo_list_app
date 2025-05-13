<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { ElMessage } from 'element-plus'

const userStore = useUserStore()
const router = useRouter()

const loginForm = ref({
  username: '',
  password: ''
})

const loading = ref(false)

const handleLogin = async () => {
  if (!loginForm.value.username || !loginForm.value.password) {
    ElMessage.warning('请输入用户名和密码')
    return
  }
  
  loading.value = true
  
  try {
    const success = userStore.login(loginForm.value.username, loginForm.value.password)
    
    if (success) {
      ElMessage.success('登录成功')
      router.push('/todos')
    } else {
      ElMessage.error('用户名或密码错误')
    }
  } catch (error) {
    ElMessage.error('登录失败，请重试')
    console.error('登录错误:', error)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2 class="login-title">待办事项系统登录</h2>
      <el-form @submit.prevent="handleLogin" class="login-form">
        <el-form-item>
          <el-input 
            v-model="loginForm.username" 
            placeholder="用户名" 
            prefix-icon="User"
          />
        </el-form-item>
        <el-form-item>
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="密码" 
            prefix-icon="Lock"
            @keyup.enter="handleLogin"
          />
        </el-form-item>
        <el-form-item>
          <el-button 
            type="primary" 
            :loading="loading" 
            @click="handleLogin" 
            class="login-button"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="login-tip">
        <p><strong>默认账号：</strong></p>
        <p>管理员 - 用户名：admin，密码：!Q@W#E4r5t6y</p>
        <p>普通用户 - 用户名：user，密码：user123</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-title {
  text-align: center;
  margin-bottom: 30px;
  color: #409EFF;
}

.login-form {
  margin-bottom: 20px;
}

.login-button {
  width: 100%;
}

.login-tip {
  font-size: 12px;
  color: #606266;
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 4px;
  margin-top: 20px;
}

@media (max-width: 550px) {
  .login-card {
    width: 90%;
    padding: 20px;
  }
}
</style> 