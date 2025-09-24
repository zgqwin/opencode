// 产品详情页功能
function initProductPage() {
  // 标签页切换功能
  const tabLinks = document.querySelectorAll(".tab-link")
  const tabPanes = document.querySelectorAll(".tab-pane")

  tabLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      // 移除所有激活状态
      tabLinks.forEach((l) => l.classList.remove("active"))
      tabPanes.forEach((p) => p.classList.remove("active"))

      // 添加当前激活状态
      this.classList.add("active")
      const tabId = this.getAttribute("data-tab")
      document.getElementById(tabId).classList.add("active")
    })
  })

  // 设备展示动画
  function animateDevice() {
    const waveDisplay = document.querySelector(".wave-display")
    if (waveDisplay) {
      setInterval(() => {
        waveDisplay.style.animation = "none"
        setTimeout(() => {
          waveDisplay.style.animation = "wave 3s infinite linear"
        }, 10)
      }, 3000)
    }
  }

  // 初始化动画
  animateDevice()

  // 滚动动画效果
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1"
          entry.target.style.transform = "translateY(0)"
        }
      })
    }, observerOptions)

    // 观察所有需要动画的元素
    const animatedElements = document.querySelectorAll(".feature-card, .gallery-item, .spec-group")
    animatedElements.forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(el)
    })
  }

  // 初始化滚动动画
  initScrollAnimations()
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", initProductPage)
