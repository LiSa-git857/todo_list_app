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
├── .cursor/               # Cursor编辑器配置
├── .git/                  # Git版本控制
├── .specstory/            # SpecStory相关文件
├── .vscode/               # VSCode配置
│   └── extensions.json    # 推荐扩展配置
├── dist/                  # 打包输出目录
├── docs/                  # 文档目录
│   ├── api_endpoints.md   # API接口文档
│   ├── architecture.puml  # 项目架构图
│   ├── architecture_simple.puml # 简化架构图
│   └── performance-guide.md # 性能优化指南
├── image/                 # 图片资源目录（空）
├── node_modules/          # 依赖包目录
├── public/                # 公共资源目录
│   └── favicon.ico        # 网站图标
├── src/                   # 源代码目录
│   ├── api/               # API接口目录（空）
│   ├── assets/            # 静态资源目录
│   │   ├── base.css       # 基础样式
│   │   ├── element-custom.css # 自定义Element样式
│   │   ├── logo.svg       # 项目logo
│   │   └── main.css       # 主要样式
│   ├── components/        # 组件目录
│   │   ├── AdminUserStats.vue # 管理员用户统计组件
│   │   ├── HelloWorld.vue # 欢迎组件
│   │   ├── LoginForm.vue  # 登录表单组件
│   │   ├── TheWelcome.vue # 欢迎页面组件
│   │   ├── TodoFilter.vue # 任务过滤组件
│   │   ├── TodoForm.vue   # 任务表单组件
│   │   ├── TodoItem.vue   # 单个任务项组件
│   │   ├── TodoList.vue   # 任务列表组件
│   │   ├── TodoStats.vue  # 任务统计组件
│   │   ├── WelcomeItem.vue # 欢迎项组件
│   │   └── icons/         # 图标组件目录
│   │       ├── IconCommunity.vue # 社区图标
│   │       ├── IconDocumentation.vue # 文档图标
│   │       ├── IconEcosystem.vue # 生态系统图标
│   │       ├── IconSupport.vue # 支持图标
│   │       └── IconTooling.vue # 工具图标
│   ├── config/            # 配置目录（空）
│   ├── constants/         # 常量定义目录（空）
│   ├── router/            # 路由配置目录
│   │   └── index.js       # 路由配置文件
│   ├── stores/            # 状态管理目录
│   │   ├── todoStore.js   # Todo状态管理
│   │   └── userStore.js   # 用户状态管理
│   ├── utils/             # 工具函数目录
│   │   ├── dateFormat.js  # 日期格式化工具
│   │   └── performance.js # 性能优化工具
│   ├── App.vue            # 应用入口组件
│   └── main.js            # 应用入口文件
├── .cursorindexingignore  # Cursor索引忽略配置
├── .gitignore             # Git忽略配置
├── .prettierignore        # Prettier忽略配置
├── .prettierrc            # Prettier代码格式化配置
├── daemon.json            # Docker守护进程配置
├── DEPLOY.md              # 部署文档
├── docker-deploy.sh       # Docker部署脚本
├── Dockerfile             # Docker构建文件
├── eslint.config.js       # ESLint配置文件
├── index.html             # HTML模板
├── jsconfig.json          # JavaScript配置文件
├── nginx.conf             # Nginx配置文件
├── package-lock.json      # 依赖锁定文件
├── package.json           # 项目依赖配置
├── PROJECT_DOCUMENTATION.md # 项目文档
├── README.md              # 项目说明文档
└── vite.config.js         # Vite配置文件
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
