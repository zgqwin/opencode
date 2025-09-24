class App {
  constructor() {
    this.init()
  }

  init() {
    this.setupNavigation()
    this.setupAnimations()
    this.setupEventListeners()
    this.setupScrollEffects()
  }

  setupNavigation() {
    const currentPath = window.location.pathname
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.classList.remove("active")
      if (link.getAttribute("href") === currentPath) {
        link.classList.add("active")
      }
    })
  }

  setupAnimations() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    )

    document.querySelectorAll(".feature-card, .industry-card").forEach((card) => {
      card.style.opacity = "0"
      card.style.transform = "translateY(30px)"
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      this.observer.observe(card)
    })
  }

  setupEventListeners() {
    window.addEventListener("scroll", this.handleScroll.bind(this))

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", this.handleSmoothScroll.bind(this))
    })
  }

  setupScrollEffects() {
    const navbar = document.querySelector(".navbar")

    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)"
        navbar.style.backdropFilter = "blur(20px)"
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)"
        navbar.style.backdropFilter = "blur(20px)"
      }
    })
  }

  handleScroll() {
    const scrolled = window.pageYOffset
    const parallax = document.querySelector(".hero")

    if (parallax) {
      parallax.style.transform = `translateY(${scrolled * 0.5}px)`
    }
  }

  handleSmoothScroll(e) {
    e.preventDefault()
    const targetId = this.getAttribute("href").substring(1)
    const targetElement = document.getElementById(targetId)

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }
}

function scrollToDemo() {
  const demoSection = document.getElementById("demoSection")
  if (demoSection) {
    demoSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    })
  }
}

function startDemo() {
  scrollToDemo()

  setTimeout(() => {
    const slider = document.getElementById("defectSlider")
    if (slider) {
      let value = 0
      const interval = setInterval(() => {
        value += 5
        if (value > 100) {
          clearInterval(interval)
          setTimeout(() => {
            value = 0
            slider.value = value
            slider.dispatchEvent(new Event("input"))
          }, 2000)
        } else {
          slider.value = value
          slider.dispatchEvent(new Event("input"))
        }
      }, 100)
    }
  }, 1000)
}

function showPrecisionDemo() {
  openModal(
    "精度演示",
    `
        <div style="text-align: center;">
            <h3>微米级检测精度演示</h3>
            <div style="background: #0f172a; padding: 2rem; border-radius: 8px; margin: 1rem 0;">
                <canvas id="precisionCanvas" width="400" height="200" style="width: 100%; height: 200px; background: #1e293b;"></canvas>
            </div>
            <p>我们的系统可以检测到0.1微米级别的缺陷，远超行业标准</p>
        </div>
    `,
  )

  setTimeout(() => {
    const canvas = document.getElementById("precisionCanvas")
    if (canvas) {
      const ctx = canvas.getContext("2d")
      animatePrecisionDemo(ctx, canvas.width, canvas.height)
    }
  }, 100)
}

function animatePrecisionDemo(ctx, width, height) {
  function draw() {
    ctx.clearRect(0, 0, width, height)

    ctx.fillStyle = "#1e293b"
    ctx.fillRect(0, 0, width, height)

    const time = Date.now() * 0.001

    for (let i = 0; i < 5; i++) {
      const x = 50 + i * 70
      const y = height / 2 + Math.sin(time + i) * 20
      const size = 2 + Math.sin(time * 2 + i) * 1

      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = "#06b6d4"
      ctx.fill()

      ctx.strokeStyle = "rgba(6, 182, 212, 0.3)"
      ctx.lineWidth = 1
      ctx.stroke()
    }

    requestAnimationFrame(draw)
  }

  draw()
}

function showAnalysisDemo() {
  openModal(
    "数据分析演示",
    `
        <div style="text-align: center;">
            <h3>AI实时数据分析</h3>
            <div style="background: #0f172a; padding: 2rem; border-radius: 8px; margin: 1rem 0;">
                <div id="analysisChart" style="height: 200px; background: #1e293b; position: relative;">
                    <canvas width="400" height="200" style="width: 100%; height: 100%;"></canvas>
                </div>
            </div>
            <p>人工智能算法实时分析检测数据，自动识别缺陷类型和严重程度</p>
        </div>
    `,
  )
}

function showCloudDemo() {
  openModal(
    "云端管理演示",
    `
        <div style="text-align: center;">
            <h3>云端数据管理平台</h3>
            <div style="background: #0f172a; padding: 2rem; border-radius: 8px; margin: 1rem 0;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div style="background: #334155; padding: 1rem; border-radius: 4px;">
                        <h4 style="color: #06b6d4; margin: 0 0 0.5rem 0;">实时监控</h4>
                        <p style="margin: 0; font-size: 0.9rem;">多设备同时监控</p>
                    </div>
                    <div style="background: #334155; padding: 1rem; border-radius: 4px;">
                        <h4 style="color: #06b6d4; margin: 0 0 0.5rem 0;">数据分析</h4>
                        <p style="margin: 0; font-size: 0.9rem;">智能报告生成</p>
                    </div>
                    <div style="background: #334155; padding: 1rem; border-radius: 4px;">
                        <h4 style="color: #06b6d4; margin: 0 0 0.5rem 0;">历史记录</h4>
                        <p style="margin: 0; font-size: 0.9rem;">完整检测档案</p>
                    </div>
                    <div style="background: #334155; padding: 1rem; border-radius: 4px;">
                        <h4 style="color: #06b6d4; margin: 0 0 0.5rem 0;">远程控制</h4>
                        <p style="margin: 0; font-size: 0.9rem;">随时随地操作</p>
                    </div>
                </div>
            </div>
            <p>检测数据实时上传云端，支持远程监控、数据分析和报告生成</p>
        </div>
    `,
  )
}

function showIndustryDetail(industry) {
  const details = {
    aerospace: {
      title: "航空航天应用",
      content: "用于飞机发动机叶片、机身结构、起落架等关键部件的无损检测，确保飞行安全。",
    },
    automotive: {
      title: "汽车制造应用",
      content: "检测汽车零部件焊接质量、材料缺陷，提高整车安全性和可靠性。",
    },
    energy: {
      title: "能源电力应用",
      content: "用于变压器、发电机、输电线路等设备的定期检测和维护。",
    },
    petrochemical: {
      title: "石油化工应用",
      content: "检测管道、压力容器、储罐等设备的腐蚀和缺陷，预防事故发生。",
    },
  }

  const detail = details[industry] || details.aerospace
  openModal(
    detail.title,
    `
        <div style="text-align: center;">
            <h3>${detail.title}</h3>
            <p style="line-height: 1.6;">${detail.content}</p>
            <div style="margin-top: 2rem;">
                <button onclick="closeModal()" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
                    了解更多
                </button>
            </div>
        </div>
    `,
  )
}

function openModal(title, content) {
  const modal = document.getElementById("demoModal")
  const modalContent = document.getElementById("modalContent")

  modalContent.innerHTML = `
        <h2 style="margin-bottom: 1rem; color: #2563eb;">${title}</h2>
        ${content}
    `

  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

function closeModal() {
  const modal = document.getElementById("demoModal")
  modal.style.display = "none"
  document.body.style.overflow = "auto"
}

document.addEventListener("DOMContentLoaded", () => {
  new App()

  const modal = document.getElementById("demoModal")
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal()
    }
  })
})
