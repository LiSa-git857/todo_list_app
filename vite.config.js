import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录加载 .env 文件
  const env = loadEnv(mode, process.cwd(), '')

  // 是否开启分析器
  const isAnalyze = mode === 'analyze'

  const config = {
    plugins: [
      vue(),
      vueDevTools(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: '待办事项应用',
          short_name: '待办',
          description: '一个简单的待办事项管理应用',
          theme_color: '#409EFF',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        workbox: {
          // 缓存策略
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
              handler: 'CacheFirst',
              options: {
                cacheName: 'google-fonts-cache',
                expiration: {
                  maxEntries: 10,
                  maxAgeSeconds: 60 * 60 * 24 * 365, // 1年
                },
                cacheableResponse: {
                  statuses: [0, 200],
                },
              },
            },
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif)$/,
              handler: 'CacheFirst',
              options: {
                cacheName: 'images-cache',
                expiration: {
                  maxEntries: 50,
                  maxAgeSeconds: 60 * 60 * 24 * 30, // 30天
                },
              },
            },
          ],
        },
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      port: 3000,
    },
    build: {
      // 启用源码映射以便于调试
      sourcemap: false,
      // 代码分割策略
      rollupOptions: {
        output: {
          // 根据类型拆分代码块
          manualChunks: {
            vendor: ['vue', 'vue-router', 'pinia'],
            'element-plus': ['element-plus', '@element-plus/icons-vue'],
          },
        },
      },
      // 启用压缩
      minify: 'terser',
      terserOptions: {
        compress: {
          // 删除console
          drop_console: true,
          drop_debugger: true,
        },
      },
      // 设置生成的静态资源的存放路径
      assetsDir: 'assets',
      // 静态资源超过4kb会单独提取
      assetsInlineLimit: 4096,
    },
  }

  // 添加打包分析插件
  if (isAnalyze) {
    config.plugins.push(
      visualizer({
        open: true,
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
      })
    )
  }

  return config
})
