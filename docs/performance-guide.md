# 性能优化指南

本文档提供有关如何使用代码分割、懒加载和 Lighthouse 进行性能评估和优化的指南。

## 目录

1. [代码分割与懒加载](#代码分割与懒加载)
2. [性能分析工具](#性能分析工具)
3. [Lighthouse 性能评估](#lighthouse-性能评估)
4. [构建优化](#构建优化)
5. [性能最佳实践](#性能最佳实践)

## 代码分割与懒加载

### 路由级代码分割

我们在 `src/router/index.js` 文件中实施了路由级别的代码分割，使用动态导入加载组件：

```js
// 懒加载组件，使用动态导入
const TodoList = () => import('../components/TodoList.vue')
const AdminUserStats = () => import('../components/AdminUserStats.vue')
const LoginForm = () => import('../components/LoginForm.vue')
```

这种方式可以:

- 减小初始加载包的大小
- 仅在需要时才加载对应的组件代码
- 提高首屏加载速度

### 组件级代码分割

在大型组件中，我们使用 `defineAsyncComponent` 实现了组件级懒加载：

```js
import { defineAsyncComponent } from 'vue'

// 使用异步组件懒加载
const TodoItem = defineAsyncComponent(() => import('./TodoItem.vue'))
const TodoForm = defineAsyncComponent(() => import('./TodoForm.vue'))
// ...
```

### 分包策略

在 `vite.config.js` 中，我们配置了手动分块策略：

```js
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'vendor': ['vue', 'vue-router', 'pinia'],
        'element-plus': ['element-plus', '@element-plus/icons-vue'],
      }
    }
  }
}
```

## 性能分析工具

### 使用内置的性能监控工具

我们创建了 `src/utils/performance.js` 工具用于监控组件性能：

```js
// 在组件中使用
import { usePerformanceMonitor } from '../utils/performance'

// 在setup中
const { onBeforeMount, onMounted, onBeforeUpdate, onUpdated } = usePerformanceMonitor('MyComponent')
```

### 构建分析

使用以下命令分析构建包大小：

```bash
npm run analyze
```

这将生成一个可视化报告，位于 `dist/stats.html`，帮助您识别大型依赖项。

## Lighthouse 性能评估

### 运行 Lighthouse 分析

```bash
# 构建并预览项目，然后运行 Lighthouse 分析
npm run audit
```

### 关键指标

1. **First Contentful Paint (FCP)**: 首次内容绘制
2. **Largest Contentful Paint (LCP)**: 最大内容绘制
3. **Time to Interactive (TTI)**: 可交互时间
4. **Total Blocking Time (TBT)**: 总阻塞时间
5. **Cumulative Layout Shift (CLS)**: 累积布局偏移

## 构建优化

我们的项目已配置了以下构建优化：

1. **terser 压缩**: 减小文件大小，删除调试代码
2. **代码分割**: 将代码拆分为更小的块
3. **PWA 支持**: 缓存策略，离线支持
4. **资源优化**: 大文件单独打包，小文件内联

## 性能最佳实践

1. **避免大型组件**: 拆分复杂组件为更小的子组件
2. **懒加载图片**: 使用 `v-lazy` 或原生 `loading="lazy"` 属性
3. **优化计算属性**: 避免在计算属性中进行耗时操作
4. **使用 v-memo**: 对列表项使用 `v-memo` 减少不必要的更新
5. **减少不必要的渲染**: 使用 `v-once` 对静态内容只渲染一次
6. **批量更新状态**: 避免频繁修改响应式数据
7. **使用虚拟滚动**: 对大型列表使用虚拟滚动

## 参考资源

- [Vue 性能优化指南](https://vuejs.org/guide/best-practices/performance.html)
- [Lighthouse 性能指标](https://web.dev/lighthouse-performance/)
- [Vite 构建优化](https://vitejs.dev/guide/features.html#build-optimization)
