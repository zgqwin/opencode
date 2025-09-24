const API_BASE = "http://localhost:3102/api"

async function loadProductData() {
  try {
    const response = await fetch(`${API_BASE}/product`)
    const data = await response.json()

    renderFeatures(data.features)
    renderApplications(data.applications)
    renderSpecifications(data.specifications)
  } catch (error) {
    console.error("加载产品数据失败:", error)
  }
}

async function loadContactInfo() {
  try {
    const response = await fetch(`${API_BASE}/contact`)
    const data = await response.json()

    renderContactDetails(data)
  } catch (error) {
    console.error("加载联系信息失败:", error)
  }
}

const featureIcons = [
  "fas fa-wave-square",
  "fas fa-ruler-combined",
  "fas fa-microchip",
  "fas fa-temperature-low",
  "fas fa-shield-alt",
  "fas fa-chart-line",
  "fas fa-robot",
  "fas fa-globe",
]

const applicationIcons = [
  "fas fa-industry",
  "fas fa-wrench",
  "fas fa-oil-can",
  "fas fa-layer-group",
  "fas fa-plane",
  "fas fa-flask",
]

function renderFeatures(features) {
  const container = document.getElementById("features-list")
  container.innerHTML = features
    .map(
      (feature, index) => `
        <div class="feature-card">
            <div class="feature-icon">
                <i class="${featureIcons[index] || "fas fa-cog"}"></i>
            </div>
            <h3>${feature}</h3>
        </div>
    `,
    )
    .join("")
}

function renderApplications(applications) {
  const container = document.getElementById("applications-list")
  container.innerHTML = applications
    .map(
      (app, index) => `
        <div class="application-item">
            <div class="application-icon">
                <i class="${applicationIcons[index] || "fas fa-cog"}"></i>
            </div>
            <span>${app}</span>
        </div>
    `,
    )
    .join("")
}

function renderSpecifications(specs) {
  const container = document.getElementById("specs-content")
  container.innerHTML = `
        <div class="spec-item">
            <h4>电源要求</h4>
            <p>${specs.power}</p>
        </div>
        <div class="spec-item">
            <h4>设备重量</h4>
            <p>${specs.weight}</p>
        </div>
        <div class="spec-item">
            <h4>外形尺寸</h4>
            <p>${specs.dimensions}</p>
        </div>
        <div class="spec-item">
            <h4>显示屏</h4>
            <p>${specs.display}</p>
        </div>
        <div class="spec-item">
            <h4>存储容量</h4>
            <p>${specs.storage}</p>
        </div>
        <div class="spec-item">
            <h4>连接接口</h4>
            <p>${specs.connectivity}</p>
        </div>
    `
}

function renderContactDetails(contact) {
  const container = document.getElementById("contact-details")
  container.innerHTML = `
        <div class="contact-detail">
            <strong>公司:</strong> ${contact.company}
        </div>
        <div class="contact-detail">
            <strong>电话:</strong> ${contact.phone}
        </div>
        <div class="contact-detail">
            <strong>邮箱:</strong> ${contact.email}
        </div>
        <div class="contact-detail">
            <strong>地址:</strong> ${contact.address}
        </div>
    `
}

function scrollToContact() {
  document.getElementById("contact").scrollIntoView({
    behavior: "smooth",
  })
}

async function handleInquirySubmit(event) {
  event.preventDefault()

  const form = event.target
  const submitButton = form.querySelector('button[type="submit"]')
  const originalText = submitButton.textContent

  const formData = new FormData(form)
  const data = {
    name: formData.get("name").trim(),
    company: formData.get("company").trim(),
    phone: formData.get("phone").trim(),
    email: formData.get("email").trim(),
    message: formData.get("message").trim(),
  }

  if (!validateForm(data)) {
    return
  }

  submitButton.disabled = true
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...'

  try {
    const response = await fetch(`${API_BASE}/inquiry`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (result.success) {
      showNotification("咨询提交成功！我们会尽快与您联系。", "success")
      form.reset()
    } else {
      showNotification("提交失败，请稍后重试。", "error")
    }
  } catch (error) {
    console.error("提交咨询失败:", error)
    showNotification("网络错误，请检查网络连接后重试。", "error")
  } finally {
    submitButton.disabled = false
    submitButton.textContent = originalText
  }
}

function validateForm(data) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const phoneRegex = /^[\d\s\-\(\)\+]+$/

  if (!data.name || data.name.length < 2) {
    showNotification("请输入有效的姓名", "error")
    return false
  }

  if (!data.company || data.company.length < 2) {
    showNotification("请输入有效的公司名称", "error")
    return false
  }

  if (!data.phone || !phoneRegex.test(data.phone)) {
    showNotification("请输入有效的电话号码", "error")
    return false
  }

  if (!data.email || !emailRegex.test(data.email)) {
    showNotification("请输入有效的电子邮箱", "error")
    return false
  }

  if (!data.message || data.message.length < 10) {
    showNotification("请输入详细的咨询内容", "error")
    return false
  }

  return true
}

function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i>
    <span>${message}</span>
  `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

function updateActiveNav() {
  const sections = document.querySelectorAll(".section")
  const navLinks = document.querySelectorAll(".nav-menu a")

  let currentSection = ""

  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100
    const sectionHeight = section.clientHeight

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute("id")
    }
  })

  navLinks.forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href").substring(1) === currentSection) {
      link.classList.add("active")
    }
  })
}

function handleScroll() {
  const header = document.querySelector(".header")
  if (window.scrollY > 100) {
    header.classList.add("scrolled")
  } else {
    header.classList.remove("scrolled")
  }
  updateActiveNav()
  checkSectionVisibility()
}

function checkSectionVisibility() {
  const sections = document.querySelectorAll(".section")

  sections.forEach((section) => {
    const sectionTop = section.offsetTop
    const sectionHeight = section.clientHeight
    const windowHeight = window.innerHeight

    if (window.scrollY > sectionTop - windowHeight + 100) {
      section.classList.add("visible")
    }
  })
}

document.addEventListener("DOMContentLoaded", function () {
  loadProductData()
  loadContactInfo()

  document.getElementById("inquiry-form").addEventListener("submit", handleInquirySubmit)

  const navLinks = document.querySelectorAll(".nav-menu a")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetSection = document.getElementById(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  window.addEventListener("scroll", handleScroll)
  handleScroll()

  setTimeout(() => {
    document.querySelector("#hero").classList.add("visible")
  }, 100)
})
