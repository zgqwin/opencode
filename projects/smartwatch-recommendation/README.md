# 电子手表推荐页面

一个响应式的电子手表推荐网站，展示各种智能手表的详细信息并提供筛选功能。

## 功能特性

- 📱 响应式设计，支持移动端和桌面端
- 🔍 按价格范围和品牌筛选手表
- ⭐ 显示手表评分和详细功能
- 🎨 现代化的UI设计
- ⌨️ 支持键盘操作（按ESC重置筛选）

## 快速开始

1. 直接在浏览器中打开 `index.html` 文件
2. 或者使用本地服务器运行：

   ```bash
   # 使用Python
   python -m http.server 8000

   # 使用Node.js
   npx http-server

   # 使用PHP
   php -S localhost:8000
   ```

## 项目结构

```
smartwatch-recommendation/
├── index.html          # 主页面
├── style.css           # 样式文件
├── script.js           # JavaScript逻辑
└── README.md           # 说明文档
```

## 手表数据

当前包含以下品牌的手表：

- Apple (Apple Watch Series 9, Apple Watch SE)
- 华为 (华为 Watch 4 Pro)
- Samsung (三星 Galaxy Watch6)
- 小米 (小米手环8 Pro)
- Garmin (Garmin Fenix 7)

## 自定义

要添加新的手表，请在 `script.js` 文件的 `watches` 数组中添加新的手表对象：

```javascript
{
    id: 7,
    name: "手表名称",
    brand: "品牌",
    price: 价格,
    rating: 评分,
    features: ["功能1", "功能2"],
    image: "⌚"
}
```

## 技术栈

- HTML5
- CSS3 (Grid, Flexbox, 渐变背景)
- JavaScript (ES6+)
- 响应式设计
