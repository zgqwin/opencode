class DetectionDemo {
  constructor() {
    this.canvas = document.getElementById("detectionCanvas")
    this.ctx = this.canvas.getContext("2d")
    this.defectSlider = document.getElementById("defectSlider")
    this.defectValue = document.getElementById("defectValue")
    this.materialType = document.getElementById("materialType")
    this.defectStatus = document.getElementById("defectStatus")
    this.confidence = document.getElementById("confidence")

    this.currentMaterial = "steel"
    this.defectLevel = 0

    this.init()
  }

  init() {
    this.setupEventListeners()
    this.drawDetection()
  }

  setupEventListeners() {
    this.defectSlider.addEventListener("input", (e) => {
      this.defectLevel = parseInt(e.target.value)
      this.defectValue.textContent = `缺陷程度: ${this.defectLevel}%`
      this.updateResults()
      this.drawDetection()
    })

    document.querySelectorAll(".material-option").forEach((option) => {
      option.addEventListener("click", (e) => {
        document.querySelectorAll(".material-option").forEach((opt) => {
          opt.classList.remove("active")
        })
        option.classList.add("active")
        this.currentMaterial = option.dataset.material
        this.updateResults()
        this.drawDetection()
      })
    })
  }

  updateResults() {
    this.materialType.textContent = this.getMaterialName(this.currentMaterial)

    if (this.defectLevel === 0) {
      this.defectStatus.textContent = "无缺陷"
      this.defectStatus.style.color = "#10b981"
    } else if (this.defectLevel <= 30) {
      this.defectStatus.textContent = "轻微缺陷"
      this.defectStatus.style.color = "#f59e0b"
    } else {
      this.defectStatus.textContent = "严重缺陷"
      this.defectStatus.style.color = "#ef4444"
    }

    const baseConfidence = 99.8
    const confidenceLoss = (this.defectLevel / 100) * 0.5
    this.confidence.textContent = `${(baseConfidence - confidenceLoss).toFixed(1)}%`
  }

  getMaterialName(material) {
    const materials = {
      steel: "钢材",
      aluminum: "铝合金",
      copper: "铜材",
    }
    return materials[material] || "未知材料"
  }

  drawDetection() {
    const width = this.canvas.width
    const height = this.canvas.height

    this.ctx.clearRect(0, 0, width, height)

    this.drawMaterialBackground()
    this.drawDefectPattern()
    this.drawDetectionLines()
    this.drawSignalWave()
  }

  drawMaterialBackground() {
    const colors = {
      steel: ["#4b5563", "#6b7280"],
      aluminum: ["#9ca3af", "#d1d5db"],
      copper: ["#b45309", "#d97706"],
    }

    const [color1, color2] = colors[this.currentMaterial] || colors.steel

    const gradient = this.ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, color1)
    gradient.addColorStop(1, color2)

    this.ctx.fillStyle = gradient
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    this.ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * this.canvas.width
      const y = Math.random() * this.canvas.height
      const size = Math.random() * 3 + 1
      this.ctx.beginPath()
      this.ctx.arc(x, y, size, 0, Math.PI * 2)
      this.ctx.fill()
    }
  }

  drawDefectPattern() {
    if (this.defectLevel === 0) return

    const defectCount = Math.floor(this.defectLevel / 10) + 1
    const maxSize = Math.min(30, this.defectLevel / 3)

    this.ctx.fillStyle = "rgba(239, 68, 68, 0.6)"

    for (let i = 0; i < defectCount; i++) {
      const x = 50 + Math.random() * (this.canvas.width - 100)
      const y = 50 + Math.random() * (this.canvas.height - 100)
      const size = Math.random() * maxSize + 5

      this.ctx.beginPath()
      this.ctx.arc(x, y, size, 0, Math.PI * 2)
      this.ctx.fill()

      this.ctx.strokeStyle = "rgba(239, 68, 68, 0.8)"
      this.ctx.lineWidth = 2
      this.ctx.stroke()
    }
  }

  drawDetectionLines() {
    this.ctx.strokeStyle = "rgba(6, 182, 212, 0.8)"
    this.ctx.lineWidth = 2

    for (let y = 30; y < this.canvas.height; y += 40) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y)

      for (let x = 0; x < this.canvas.width; x += 10) {
        const noise = Math.sin(x * 0.1 + Date.now() * 0.001) * 3
        this.ctx.lineTo(x, y + noise)
      }

      this.ctx.stroke()
    }
  }

  drawSignalWave() {
    const centerY = this.canvas.height / 2
    const amplitude = 20
    const frequency = 0.02

    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.9)"
    this.ctx.lineWidth = 3
    this.ctx.beginPath()

    for (let x = 0; x < this.canvas.width; x++) {
      const y = centerY + Math.sin(x * frequency + Date.now() * 0.005) * amplitude

      if (x === 0) {
        this.ctx.moveTo(x, y)
      } else {
        this.ctx.lineTo(x, y)
      }
    }

    this.ctx.stroke()

    this.drawSignalPoints()
  }

  drawSignalPoints() {
    const centerY = this.canvas.height / 2
    const amplitude = 20
    const frequency = 0.02

    this.ctx.fillStyle = "#06b6d4"

    for (let x = 0; x < this.canvas.width; x += 30) {
      const y = centerY + Math.sin(x * frequency + Date.now() * 0.005) * amplitude

      this.ctx.beginPath()
      this.ctx.arc(x, y, 4, 0, Math.PI * 2)
      this.ctx.fill()

      this.ctx.beginPath()
      this.ctx.arc(x, y, 8, 0, Math.PI * 2)
      this.ctx.strokeStyle = "rgba(6, 182, 212, 0.3)"
      this.ctx.lineWidth = 1
      this.ctx.stroke()
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new DetectionDemo()
})
