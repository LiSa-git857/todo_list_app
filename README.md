# todo_list_app

这个模板可以帮助你开始使用Vue 3和Vite进行开发。

## 项目架构

项目架构图使用 PlantUML 创建，位于 `docs/architecture.puml` 文件中。该图描述了应用的组件结构、数据流和主要功能。

要查看架构图，你需要：
1. 安装 PlantUML 插件（如果使用 VSCode）
2. 或者使用在线 PlantUML 查看器，如 [PlantUML Web Server](http://www.plantuml.com/plantuml/uml/)

## 项目结构

```
todo_list_app/
├── docs/                  # 文档目录
│   └── architecture.puml  # 项目架构图
├── public/                # 公共资源目录
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码目录
│   ├── assets/            # 静态资源目录
│   │   ├── base.css       # 基础样式
│   │   ├── main.css       # 主要样式
│   │   ├── element-custom.css # 自定义Element样式
│   │   └── logo.svg       # 项目logo
│   ├── components/        # 组件目录
│   │   ├── TodoFilter.vue # 任务过滤组件
│   │   ├── TodoForm.vue   # 任务表单组件
│   │   ├── TodoItem.vue   # 单个任务项组件
│   │   ├── TodoList.vue   # 任务列表组件
│   │   ├── TodoStats.vue  # 任务统计组件
│   │   └── icons/         # 图标组件目录
│   ├── stores/            # 状态管理目录
│   │   └── todoStore.js   # Todo状态管理
│   ├── utils/             # 工具函数目录
│   │   └── dateFormat.js  # 日期格式化工具
│   ├── App.vue            # 应用入口组件
│   └── main.js            # 应用入口文件
├── index.html             # HTML模板
├── vite.config.js         # Vite配置文件
├── package.json           # 项目依赖配置
└── jsconfig.json          # JavaScript配置文件
```

## 推荐的IDE设置

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (并禁用Vetur)。

## 自定义配置

查看 [Vite配置参考](https://vite.dev/config/)。

## 项目设置

```sh
npm install
```

### 编译和热重载用于开发

```sh
npm run dev
```

### 编译和压缩用于生产环境

```sh
npm run build
```
