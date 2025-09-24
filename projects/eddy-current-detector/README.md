# 电磁涡流检测器宣传页面

这是一个工业设备电磁涡流检测器的宣传页面项目，包含前端静态页面和Node.js后端服务。

## 功能特点

- 响应式设计，支持移动端和桌面端
- 平滑滚动导航
- 联系表单提交功能
- 现代化的UI设计

## 技术栈

- 前端：HTML5, CSS3, JavaScript
- 后端：Node.js, Express
- 样式：CSS Grid, Flexbox

## 项目结构

```
eddy-current-detector/
├── public/
│   ├── css/
│   │   └── style.css          # 样式文件
│   ├── js/
│   │   └── script.js          # 交互脚本
│   ├── images/                # 图片资源目录
│   └── index.html             # 主页面
├── server.js                  # Node.js服务器
├── package.json               # 项目配置
└── README.md                  # 项目说明
```

## 安装和运行

### 1. 安装依赖

```bash
cd projects/eddy-current-detector
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 生产环境启动

```bash
npm start
```

服务器将运行在 http://localhost:3000

## API接口

### 提交联系表单

- **URL**: `/api/contact`
- **方法**: `POST`
- **参数**:
  - `name` (必填): 姓名
  - `email` (必填): 邮箱
  - `phone` (可选): 电话
  - `message` (必填): 留言内容

### 获取联系记录

- **URL**: `/api/contacts`
- **方法**: `GET`
- **返回**: 所有联系记录列表

## 页面内容

- **首页**: 产品介绍和主要特点
- **产品特点**: 高精度检测、快速响应等特性
- **应用领域**: 航空航天、汽车制造等应用场景
- **技术参数**: 详细的技术规格参数
- **联系我们**: 联系表单和联系信息

## 部署说明

1. 确保服务器已安装Node.js (版本 >= 14.0.0)
2. 上传项目文件到服务器
3. 运行 `npm install` 安装依赖
4. 运行 `npm start` 启动服务
5. 配置反向代理（如Nginx）指向3000端口（可选）

## 开发说明

- 使用 `npm run dev` 启动开发服务器，支持热重载
- 联系记录保存在 `contact_log.txt` 文件中
- 前端资源位于 `public` 目录
- 后端API接口在 `server.js` 中定义
