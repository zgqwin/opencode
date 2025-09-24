// 应用案例页面功能
function initCasesPage() {
  // 案例筛选功能
  const filterTabs = document.querySelectorAll(".filter-tab")
  const caseCards = document.querySelectorAll(".case-card")

  filterTabs.forEach((tab) => {
    tab.addEventListener("click", function () {
      // 移除所有激活状态
      filterTabs.forEach((t) => t.classList.remove("active"))

      // 添加当前激活状态
      this.classList.add("active")
      const filter = this.getAttribute("data-filter")

      // 筛选案例
      caseCards.forEach((card) => {
        if (filter === "all" || card.getAttribute("data-industry") === filter) {
          card.style.display = "block"
          setTimeout(() => {
            card.style.opacity = "1"
            card.style.transform = "translateY(0)"
          }, 100)
        } else {
          card.style.opacity = "0"
          card.style.transform = "translateY(20px)"
          setTimeout(() => {
            card.style.display = "none"
          }, 300)
        }
      })
    })
  })

  // 图表动画效果
  function animateChart() {
    const chartBars = document.querySelectorAll(".chart-bar")
    chartBars.forEach((bar, index) => {
      setTimeout(() => {
        bar.style.transform = "scaleY(1)"
      }, index * 200)
    })
  }

  // 初始化图表动画
  setTimeout(animateChart, 500)

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
    const animatedElements = document.querySelectorAll(".case-card, .client-card")
    animatedElements.forEach((el) => {
      el.style.opacity = "0"
      el.style.transform = "translateY(30px)"
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(el)
    })
  }

  // 初始化滚动动画
  initScrollAnimations()

  // 案例详情展示
  window.showCaseDetail = function (industry) {
    const caseDetails = {
      aerospace: {
        title: "航空发动机制造商叶片检测项目",
        content: "详细的项目介绍、技术方案和实施效果...",
      },
      automotive: {
        title: "汽车零部件焊接质量检测项目",
        content: "详细的项目介绍、技术方案和实施效果...",
      },
      energy: {
        title: "变压器关键部件检测项目",
        content: "详细的项目介绍、技术方案和实施效果...",
      },
      petrochemical: {
        title: "石化管道腐蚀检测项目",
        content: "详细的项目介绍、技术方案和实施效果...",
      },
    }

    const detail = caseDetails[industry]
    if (detail) {
      alert(`查看 ${detail.title} 的详细信息\n\n${detail.content}`)
    }
  }
}

// 页面加载完成后初始化
document.addEventListener("DOMContentLoaded", initCasesPage)
