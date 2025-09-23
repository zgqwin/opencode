# 专业 CRM 系统

一个功能完整的客户关系管理系统，使用 Bun + SQLite + TypeScript 构建。

## 功能特性

### 🔐 用户认证

- JWT 身份验证
- 基于角色的权限控制（管理员/用户）
- 安全的密码哈希

### 👥 客户管理

- 完整的客户 CRUD 操作
- 客户状态跟踪（潜在客户/客户/非活跃）
- 客户分配和跟进
- 客户来源追踪

### 💼 销售机会管理

- 销售管道管理
- 机会阶段跟踪（潜在/资格/提案/谈判/成交/失败）
- 成交概率预测
- 预计成交日期

### 📅 活动管理

- 任务和活动创建
- 活动类型（电话/邮件/会议/任务）
- 截止日期管理
- 完成状态跟踪

### 📊 仪表板

- 客户统计概览
- 销售管道分析
- 近期活动提醒

## 技术栈

- **后端**: Bun + TypeScript
- **数据库**: SQLite with better-sqlite3
- **认证**: JWT + bcrypt
- **前端**: HTML + Tailwind CSS + Alpine.js
- **构建工具**: Bun

## 快速开始

### 安装依赖

```bash
bun install
```

### 初始化数据库

```bash
bun run migrate
```

### 启动开发服务器

```bash
bun run dev
```

服务器将在 http://localhost:3000 启动

## API 文档

### 认证端点

#### 用户登录

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### 用户注册

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "用户名",
  "role": "user"
}
```

### 客户管理

#### 获取所有客户

```http
GET /api/customers
Authorization: Bearer <token>
```

#### 创建客户

```http
POST /api/customers
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "客户名称",
  "email": "customer@example.com",
  "phone": "1234567890",
  "company": "公司名称",
  "industry": "行业",
  "status": "lead",
  "source": "来源",
  "assigned_to": 1
}
```

### 销售机会

#### 获取所有机会

```http
GET /api/opportunities
Authorization: Bearer <token>
```

#### 创建机会

```http
POST /api/opportunities
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "机会标题",
  "description": "机会描述",
  "amount": 10000.00,
  "stage": "prospecting",
  "probability": 20,
  "close_date": "2024-12-31",
  "customer_id": 1,
  "assigned_to": 1
}
```

### 活动管理

#### 获取所有活动

```http
GET /api/activities
Authorization: Bearer <token>
```

#### 创建活动

```http
POST /api/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "call",
  "subject": "活动主题",
  "description": "活动描述",
  "due_date": "2024-12-31",
  "completed": false,
  "customer_id": 1,
  "opportunity_id": 1,
  "assigned_to": 1
}
```

### 仪表板

#### 获取统计信息

```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

## 数据库架构

### 用户表 (users)

- id: 主键
- email: 邮箱（唯一）
- password: 密码哈希
- name: 姓名
- role: 角色（admin/user）
- created_at/updated_at: 时间戳

### 客户表 (customers)

- id: 主键
- name: 客户名称
- email: 邮箱（唯一）
- phone: 电话
- company: 公司
- industry: 行业
- status: 状态（lead/customer/inactive）
- source: 来源
- assigned_to: 分配用户
- created_by: 创建用户

### 机会表 (opportunities)

- id: 主键
- title: 标题
- description: 描述
- amount: 金额
- stage: 阶段
- probability: 概率
- close_date: 预计成交日期
- customer_id: 关联客户
- assigned_to: 分配用户

### 活动表 (activities)

- id: 主键
- type: 类型（call/email/meeting/task）
- subject: 主题
- description: 描述
- due_date: 截止日期
- completed: 完成状态
- customer_id: 关联客户
- opportunity_id: 关联机会
- assigned_to: 分配用户

## 开发

### 运行测试

```bash
bun test
```

### 代码格式化

```bash
bun run format
```

## 部署

### 生产环境变量

```bash
JWT_SECRET=your-secret-key
```

### 数据库备份

定期备份 SQLite 数据库文件 `crm.db`

## 许可证

MIT License
