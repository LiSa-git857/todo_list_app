FROM nginx:alpine

# 复制构建的文件到nginx目录
COPY dist/ /usr/share/nginx/html/

# 暴露80端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"] 