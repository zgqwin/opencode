# 工业级超声波检测设备产品介绍页面

这是一个完整的工业级超声波检测设备产品介绍页面，包含前端展示页面和Node.js后端API。

## 功能特点

- 响应式设计，支持移动端和桌面端
- 现代化的UI界面设计
- 完整的RESTful API接口
- 产品咨询表单提交功能
- 平滑滚动导航

## 技术栈

### 前端

- HTML5
- CSS3 (Grid布局，Flexbox)
- 原生JavaScript (ES6+)

### 后端

- Node.js
- Express.js框架
- CORS中间件

## 安装和运行

### 1. 安装依赖

```bash
cd projects/ultrasonic-detector
npm install
```

### 2. 启动服务器

```bash
npm start
```

或者使用开发模式（需要安装nodemon）：

```bash
npm run dev
```

### 3. 访问应用

打开浏览器访问：http://localhost:3102

## API接口

### 获取产品信息

- **GET** `/api/product`
- 返回产品名称、型号、特点、应用领域和技术规格

### 获取联系信息

- **GET** `/api/contact`
- 返回公司联系信息

### 提交产品咨询

- **POST** `/api/inquiry`
- 接收咨询表单数据
- 请求体格式：

```json
{
  "name": "姓名",
  "company": "公司名称",
  "phone": "联系电话",
  "email": "电子邮箱",
  "message": "咨询内容"
}
```

## 项目结构

```
ultrasonic-detector/
├── server.js          # 后端服务器主文件
├── package.json       # 项目配置和依赖
├── README.md          # 项目说明文档
└── public/            # 前端静态文件
    ├── index.html     # 主页面
    ├── styles.css     # 样式文件
    └── script.js      # 前端交互逻辑
```

## 产品特性

- **检测频率范围**：0.5MHz - 15MHz
- **检测深度**：0-10米
- **分辨率**：0.1mm
- **工作温度**：-20°C 至 60°C
- **防护等级**：IP67
- **实时数据采集与分析**
- **自动缺陷识别**
- **多语言操作界面**

## 应用领域

- 金属材料缺陷检测
- 焊缝质量评估
- 管道腐蚀检测
- 复合材料检测
- 航空航天部件检测
- 压力容器检测

## 开发说明

- 后端服务器运行在端口3102
- 前端通过AJAX与后端API通信
- 支持跨域请求（CORS已配置）
- 响应式设计，适配各种屏幕尺寸
