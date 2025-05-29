# Todo List 应用部署指南

本文档提供了部署Todo List应用的详细步骤。

## 前提条件

- Node.js 16+
- npm 或 yarn

## 构建生产版本

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build
```

构建完成后，生产文件将生成在`dist`目录中。

## 部署选项

### 选项1：静态托管服务

将`dist`目录中的文件上传到以下任一静态托管服务：

- GitHub Pages
- Netlify
- Vercel
- 阿里云OSS
- 腾讯云COS
- 华为云OBS

### 选项2：使用Docker部署

1. 确保已安装Docker
2. 构建并运行Docker容器：

```bash
# 构建Docker镜像
docker build -t todo-list-app .

# 运行Docker容器
docker run -d -p 8080:80 --name todo-app todo-list-app
```

3. 访问 http://localhost:8080

### 选项3：使用Nginx部署

1. 安装Nginx
2. 将`dist`目录中的文件复制到Nginx的静态文件目录：

```bash
sudo cp -r dist/* /usr/share/nginx/html/
```

3. 将项目中的`nginx.conf`配置复制到Nginx配置目录：

```bash
sudo cp nginx.conf /etc/nginx/conf.d/todo-app.conf
```

4. 重启Nginx：

```bash
sudo systemctl restart nginx
```

5. 访问 http://localhost

## 环境变量配置

如果需要配置不同的API地址或其他环境变量，请在部署前创建`.env.production`文件并设置相应的变量。

## 常见问题

### 路由问题

如果部署后发现刷新页面出现404错误，请确保服务器配置支持单页应用的路由。对于Nginx，已在配置文件中添加了相应的`try_files`指令。

### 静态资源加载问题

如果静态资源（如图片、CSS、JS）无法正确加载，请检查部署路径和`vite.config.js`中的`base`配置是否一致。 