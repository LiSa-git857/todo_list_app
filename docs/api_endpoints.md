# 待办事项管理系统API接口文档

## 基础信息

- 基础URL: `/api/v1`
- 所有POST和PUT请求的Content-Type均为 `application/json`
- 所有接口返回的数据格式均为JSON
- 授权通过JWT令牌实现，使用Authorization请求头: `Authorization: Bearer {token}`

## 错误处理

所有API错误返回统一格式:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述信息"
  }
}
```

## 认证相关接口

### 用户登录

- **URL**: `/auth/login`
- **方法**: `POST`
- **描述**: 用户登录并获取JWT令牌
- **请求体**:
  ```json
  {
    "username": "admin",
    "password": "!Q@W#E4r5t6y"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "success": true,
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": 1,
        "username": "admin",
        "name": "管理员",
        "role": "admin"
      }
    }
  }
  ```

### 用户注销

- **URL**: `/auth/logout`
- **方法**: `POST`
- **描述**: 用户注销登录
- **请求头**: 需要Authorization
- **成功响应** (200):
  ```json
  {
    "success": true,
    "message": "成功注销"
  }
  ```

### 获取当前用户信息

- **URL**: `/auth/me`
- **方法**: `GET`
- **描述**: 获取当前登录用户的信息
- **请求头**: 需要Authorization
- **成功响应** (200):
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "role": "admin",
      "email": "admin@example.com",
      "avatar": "https://example.com/avatar.jpg"
    }
  }
  ```

## 待办事项接口

### 获取待办事项列表

- **URL**: `/todos`
- **方法**: `GET`
- **描述**: 获取当前用户的待办事项列表
- **请求头**: 需要Authorization
- **查询参数**:
  - `filter`: 可选，筛选条件 [all, completed, active]，默认all
  - `sort`: 可选，排序方式 [createdAt, priority, dueDate]，默认createdAt
  - `order`: 可选，排序顺序 [asc, desc]，默认desc
- **成功响应** (200):
  ```json
  {
    "success": true,
    "data": {
      "todos": [
        {
          "id": 1,
          "text": "测试工程",
          "completed": false,
          "priority": "low",
          "dueDate": "2023-05-20",
          "createdAt": "2023-05-10T08:00:00Z",
          "updatedAt": "2023-05-10T08:00:00Z"
        },
        {
          "id": 2,
          "text": "测试方法",
          "completed": false,
          "priority": "normal",
          "dueDate": "2023-05-22",
          "createdAt": "2023-05-10T09:00:00Z",
          "updatedAt": "2023-05-10T09:00:00Z"
        }
      ],
      "total": 2,
      "completed": 0,
      "uncompleted": 2,
      "completionRate": 0
    }
  }
  ```

### 创建待办事项

- **URL**: `/todos`
- **方法**: `POST`
- **描述**: 创建新的待办事项
- **请求头**: 需要Authorization
- **请求体**:
  ```json
  {
    "text": "新待办事项",
    "priority": "high",
    "dueDate": "2023-06-01"
  }
  ```
- **成功响应** (201):
  ```json
  {
    "success": true,
    "data": {
      "id": 3,
      "text": "新待办事项",
      "completed": false,
      "priority": "high",
      "dueDate": "2023-06-01",
      "createdAt": "2023-05-15T10:30:00Z",
      "updatedAt": "2023-05-15T10:30:00Z"
    }
  }
  ```

### 获取待办事项详情

- **URL**: `/todos/{id}`
- **方法**: `GET`
- **描述**: 获取指定ID的待办事项详情
- **请求头**: 需要Authorization
- **成功响应** (200):
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "text": "测试工程",
      "completed": false,
      "priority": "low",
      "dueDate": "2023-05-20",
      "createdAt": "2023-05-10T08:00:00Z",
      "updatedAt": "2023-05-10T08:00:00Z"
    }
  }
  ```

### 更新待办事项

- **URL**: `/todos/{id}`
- **方法**: `PUT`
- **描述**: 更新指定ID的待办事项
- **请求头**: 需要Authorization
- **请求体**:
  ```json
  {
    "text": "已更新的待办事项",
    "priority": "normal",
    "dueDate": "2023-05-25"
  }
  ```
- **成功响应** (200):
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "text": "已更新的待办事项",
      "completed": false,
      "priority": "normal",
      "dueDate": "2023-05-25",
      "createdAt": "2023-05-10T08:00:00Z",
      "updatedAt": "2023-05-15T11:00:00Z"
    }
  }
  ```

### 标记待办事项状态

- **URL**: `/todos/{id}/toggle`
- **方法**: `PATCH`
- **描述**: 切换待办事项的完成状态
- **请求头**: 需要Authorization
- **成功响应** (200):
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "completed": true,
      "updatedAt": "2023-05-15T12:00:00Z",
      "completedAt": "2023-05-15T12:00:00Z"
    }
  }
  ```

### 删除待办事项

- **URL**: `/todos/{id}`
- **方法**: `DELETE`
- **描述**: 删除指定ID的待办事项
- **请求头**: 需要Authorization
- **成功响应** (200):
  ```json
  {
    "success": true,
    "message": "待办事项已删除"
  }
  ```

## 管理员接口

### 获取所有用户统计

- **URL**: `/admin/users/stats`
- **方法**: `GET`
- **描述**: 获取所有用户的待办事项统计信息
- **请求头**: 需要Authorization (管理员权限)
- **成功响应** (200):
  ```json
  {
    "success": true,
    "data": [
      {
        "userId": 1,
        "userName": "管理员",
        "total": 2,
        "completed": 1,
        "uncompleted": 1,
        "rate": 50
      },
      {
        "userId": 2,
        "userName": "普通用户",
        "total": 2,
        "completed": 1,
        "uncompleted": 1,
        "rate": 50
      }
    ]
  }
  ```

### 获取指定用户的待办事项

- **URL**: `/admin/users/{userId}/todos`
- **方法**: `GET`
- **描述**: 获取指定用户的待办事项列表
- **请求头**: 需要Authorization (管理员权限)
- **查询参数**:
  - `filter`: 可选，筛选条件 [all, completed, active]，默认all
  - `sort`: 可选，排序方式 [createdAt, priority, dueDate]，默认createdAt
- **成功响应** (200):
  ```json
  {
    "success": true,
    "data": {
      "todos": [
        {
          "id": 3,
          "text": "完成报告",
          "completed": false,
          "priority": "high",
          "dueDate": "2023-05-27",
          "createdAt": "2023-05-10T10:00:00Z",
          "updatedAt": "2023-05-10T10:00:00Z"
        },
        {
          "id": 4,
          "text": "开会讨论",
          "completed": true,
          "priority": "normal",
          "dueDate": "2023-05-19",
          "createdAt": "2023-05-10T11:00:00Z",
          "updatedAt": "2023-05-20T09:00:00Z",
          "completedAt": "2023-05-20T09:00:00Z"
        }
      ],
      "userName": "普通用户",
      "total": 2,
      "completed": 1,
      "uncompleted": 1,
      "completionRate": 50
    }
  }
  ```

## 用户管理接口

### 创建新用户 (仅管理员)

- **URL**: `/admin/users`
- **方法**: `POST`
- **描述**: 创建新用户
- **请求头**: 需要Authorization (管理员权限)
- **请求体**:
  ```json
  {
    "username": "newuser",
    "password": "password123",
    "name": "新用户",
    "role": "user",
    "email": "newuser@example.com"
  }
  ```
- **成功响应** (201):
  ```json
  {
    "success": true,
    "data": {
      "id": 3,
      "username": "newuser",
      "name": "新用户",
      "role": "user",
      "email": "newuser@example.com",
      "createdAt": "2023-05-20T08:00:00Z"
    }
  }
  ```
