# Vue3 待办事项应用 - 项目技术文档

## 项目概述

这是一个基于 Vue 3 构建的现代化待办事项管理应用，采用了当前前端开发的最佳实践和工具链。项目支持 PWA（渐进式Web应用）、性能监控、代码质量控制等功能。

## 核心技术栈

### 前端框架

- **Vue 3** (3.2.47) - 采用 Composition API，提供更好的 TypeScript 支持和性能优化
- **Vue Router** (4.1.6) - 单页面应用路由管理
- **Pinia** (2.0.35) - Vue 3 推荐的状态管理库，替代 Vuex

### UI 组件库

- **Element Plus** (2.3.4) - 基于 Vue 3 的桌面端组件库
- **@element-plus/icons-vue** (2.3.1) - Element Plus 图标组件库

## 构建工具与插件配置

### 核心构建工具

- **Vite** (^4.3.4) - 下一代前端构建工具，提供极速的开发体验

### Vite 插件配置

#### 1. @vitejs/plugin-vue

**作用**: 提供 Vue 单文件组件支持

```javascript
import vue from '@vitejs/plugin-vue'
```

#### 2. vite-plugin-vue-devtools

**作用**: Vue 开发者工具集成，提供组件调试和性能分析

```javascript
import vueDevTools from 'vite-plugin-vue-devtools'
```

#### 3. vite-plugin-pwa (VitePWA)

**作用**: 将应用转换为 PWA（渐进式Web应用）
**配置功能**:

- 自动更新注册
- Service Worker 生成
- 离线缓存策略
- Web App Manifest 配置

**缓存策略实现**:

```javascript
VitePWA({
  registerType: 'autoUpdate',
  workbox: {
    runtimeCaching: [
      // Google Fonts 缓存策略
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: 'CacheFirst',
        options: {
          cacheName: 'google-fonts-cache',
          expiration: { maxAgeSeconds: 60 * 60 * 24 * 365 }
        }
      },
      // 图片资源缓存策略
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
        handler: 'CacheFirst',
        options: {
          cacheName: 'images-cache',
          expiration: { maxAgeSeconds: 60 * 60 * 24 * 30 }
        }
      }
    ]
  }
})
```

#### 4. rollup-plugin-visualizer

**作用**: 构建产物分析，生成可视化的打包体积报告
**使用方式**:

```bash
npm run analyze  # 生成分析报告
```

## 代码质量工具

### ESLint 配置

**插件组合**:

- `@eslint/js` - JavaScript 基础规则
- `eslint-plugin-vue` - Vue 专用规则
- `@typescript-eslint/eslint-plugin` - TypeScript 支持
- `eslint-plugin-prettier` - Prettier 集成
- `eslint-config-prettier` - 避免与 Prettier 冲突

**关键规则配置**:

```javascript
rules: {
  'vue/multi-word-component-names': 'off',  // 允许单词组件名
  'vue/no-unused-vars': 'error',            // 禁止未使用的变量
  'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
  'prefer-const': 'error',                  // 强制使用 const
  'no-var': 'error'                         // 禁用 var
}
```

### Prettier 代码格式化

**配置特点**:

```json
{
  "semi": false,              // 不使用分号
  "singleQuote": true,        // 使用单引号
  "printWidth": 100,          // 行宽限制
  "tabWidth": 2,              // 缩进宽度
  "trailingComma": "es5"      // ES5 兼容的尾随逗号
}
```

## 性能优化策略

### 构建优化

1. **代码分割**:

```javascript
manualChunks: {
  vendor: ['vue', 'vue-router', 'pinia'],
  'element-plus': ['element-plus', '@element-plus/icons-vue']
}
```

2. **压缩优化**:

- 使用 Terser 进行 JavaScript 压缩
- 生产环境移除 console 和 debugger
- 静态资源超过 4KB 自动提取

3. **运行时性能监控**:

```javascript
// 开发环境启用长任务监控
if (process.env.NODE_ENV === 'development') {
  import('./utils/performance').then(({ createLongTaskObserver }) => {
    createLongTaskObserver()
  })
}
```

### 网络优化

- PWA 离线缓存
- 静态资源 CDN 缓存策略
- 图片和字体资源缓存

## 状态管理架构

### Pinia Store 设计

```javascript
// todoStore.js - 待办事项状态管理
// userStore.js - 用户状态管理
```

**优势**:

- 更好的 TypeScript 支持
- 自动的 devtools 集成
- 模块化设计
- 更简洁的 API

## 组件架构

### 组件层次结构

```
App.vue (根组件)
├── TodoForm.vue      (任务表单)
├── TodoFilter.vue    (任务过滤器)
├── TodoList.vue      (任务列表)
│   └── TodoItem.vue  (单个任务项)
├── TodoStats.vue     (统计组件)
└── 其他功能组件...
```

### 组件特点

- 采用 Composition API
- 响应式数据管理
- 事件驱动的组件通信
- Element Plus 组件集成

## 开发工具集成

### VSCode 推荐插件

- **Volar**: Vue 3 语言服务
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Vue VSCode Snippets**: Vue 代码片段

### 开发脚本

```json
{
  "dev": "vite",                    // 开发服务器
  "build": "vite build",            // 生产构建
  "preview": "vite preview",        // 预览构建结果
  "analyze": "vite build --mode analyze",  // 构建分析
  "lint": "eslint . --fix",         // 代码检查并修复
  "format": "prettier --write .",   // 代码格式化
  "lighthouse": "lighthouse http://localhost:4173/", // 性能审计
  "audit": "npm run build && npm run preview & npm run lighthouse"
}
```

## 部署配置

### Docker 支持

- 提供 `Dockerfile` 和 `nginx.conf`
- 支持容器化部署
- 优化的静态资源服务配置

### 性能监控

- **Lighthouse**: 自动化性能审计
- **性能观察者**: 长任务监控（开发环境）
- **构建分析**: 打包体积可视化

## 国际化支持

- Element Plus 中文语言包
- 支持多语言扩展

## 最佳实践应用

1. **现代化工具链**: Vite + Vue 3 + Pinia
2. **代码质量**: ESLint + Prettier + TypeScript 支持
3. **性能优化**: 代码分割 + 缓存策略 + PWA
4. **开发体验**: 热重载 + 开发者工具 + 类型检查
5. **部署优化**: Docker + Nginx + 性能监控

这个项目展示了如何构建一个生产就绪的现代 Vue 3 应用，集成了当前前端开发的最佳实践工具和技术。
