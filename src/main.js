import './assets/main.css'
import './assets/element-custom.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

// 仅在开发环境中初始化性能监控
if (process.env.NODE_ENV === 'development') {
  import('./utils/performance').then(({ createLongTaskObserver }) => {
    // 初始化长任务监控
    createLongTaskObserver();
    console.info('[性能] 性能监控已启用');
  });
}

const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(createPinia())
app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.mount('#app')
