const express = require("express")
const cors = require("cors")
const path = require("path")

const app = express()
const PORT = 3102

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, "public")))

const productData = {
  name: "工业级超声波检测设备 ULTRA-SCAN PRO",
  model: "ULTRA-SCAN PRO-5000",
  description: "高精度工业超声波无损检测设备，专为严苛工业环境设计",
  features: [
    "检测频率范围：0.5MHz - 15MHz",
    "检测深度：0-10米",
    "分辨率：0.1mm",
    "工作温度：-20°C 至 60°C",
    "IP67防护等级",
    "实时数据采集与分析",
    "自动缺陷识别",
    "多语言操作界面",
  ],
  applications: [
    "金属材料缺陷检测",
    "焊缝质量评估",
    "管道腐蚀检测",
    "复合材料检测",
    "航空航天部件检测",
    "压力容器检测",
  ],
  specifications: {
    power: "100-240V AC / 24V DC",
    weight: "8.5kg",
    dimensions: "350mm × 250mm × 150mm",
    display: "10.1英寸触摸屏",
    storage: "256GB SSD",
    connectivity: "WiFi, Bluetooth, USB, Ethernet",
  },
}

app.get("/api/product", (req, res) => {
  res.json(productData)
})

app.get("/api/contact", (req, res) => {
  res.json({
    company: "先进检测技术有限公司",
    phone: "+86-400-123-4567",
    email: "sales@ultrasonic-tech.com",
    address: "中国上海市浦东新区张江高科技园区",
  })
})

app.post("/api/inquiry", (req, res) => {
  const { name, company, phone, email, message } = req.body

  console.log("收到咨询请求:", { name, company, phone, email, message })

  res.json({
    success: true,
    message: "咨询信息已收到，我们将尽快与您联系",
    inquiryId: Date.now(),
  })
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.listen(PORT, () => {
  console.log(`超声波检测设备产品页面服务器运行在端口 ${PORT}`)
  console.log(`访问地址: http://localhost:${PORT}`)
})
