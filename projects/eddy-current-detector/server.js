const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const fs = require("fs")

const app = express()
const PORT = process.env.PORT || 3101

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, "public")))

app.post("/api/contact", (req, res) => {
  const { name, email, phone, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: "请填写所有必填字段",
    })
  }

  const contactData = {
    timestamp: new Date().toISOString(),
    name,
    email,
    phone: phone || "未提供",
    message,
  }

  const logEntry = JSON.stringify(contactData) + "\n"

  fs.appendFile("contact_log.txt", logEntry, (err) => {
    if (err) {
      console.error("写入联系记录失败:", err)
      return res.status(500).json({
        success: false,
        message: "服务器错误",
      })
    }

    console.log("收到新的咨询:", contactData)
    res.json({
      success: true,
      message: "咨询提交成功",
    })
  })
})

app.get("/api/contacts", (req, res) => {
  fs.readFile("contact_log.txt", "utf8", (err, data) => {
    if (err) {
      if (err.code === "ENOENT") {
        return res.json({ contacts: [] })
      }
      return res.status(500).json({
        success: false,
        message: "读取数据失败",
      })
    }

    const contacts = data
      .trim()
      .split("\n")
      .filter((line) => line.trim())
      .map((line) => JSON.parse(line))

    res.json({ contacts })
  })
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"))
})

app.get("/product", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "product.html"))
})

app.get("/cases", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cases.html"))
})

app.get("/docs", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "docs.html"))
})

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "contact.html"))
})

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`)
  console.log("电磁涡流检测器宣传页面已启动")
})
