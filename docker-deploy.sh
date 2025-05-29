#!/bin/bash

# 构建Docker镜像
docker build -t todo-list-app .

# 运行Docker容器
docker run -d -p 8080:80 --name todo-app todo-list-app

echo "应用已部署，请访问 http://localhost:8080" 