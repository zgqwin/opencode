class ContactPage {
  constructor() {
    this.init()
  }

  init() {
    this.setupForm()
    this.setupAnimations()
  }

  setupForm() {
    const form = document.getElementById("contact-form")

    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(form)
      const data = Object.fromEntries(formData)

      if (this.validateForm(data)) {
        this.submitForm(data)
      }
    })

    this.setupFormValidation()
  }

  setupFormValidation() {
    const inputs = document.querySelectorAll("input, textarea, select")

    inputs.forEach((input) => {
      input.addEventListener("blur", () => {
        this.validateField(input)
      })

      input.addEventListener("input", () => {
        this.clearFieldError(input)
      })
    })
  }

  validateField(field) {
    const value = field.value.trim()
    const fieldName = field.getAttribute("name")

    this.clearFieldError(field)

    if (field.hasAttribute("required") && !value) {
      this.showFieldError(field, "此字段为必填项")
      return false
    }

    if (fieldName === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        this.showFieldError(field, "请输入有效的电子邮箱地址")
        return false
      }
    }

    if (fieldName === "phone" && value) {
      const phoneRegex = /^1[3-9]\d{9}$/
      if (!phoneRegex.test(value)) {
        this.showFieldError(field, "请输入有效的手机号码")
        return false
      }
    }

    return true
  }

  showFieldError(field, message) {
    field.classList.add("error")

    let errorElement = field.nextElementSibling
    if (!errorElement || !errorElement.classList.contains("error-message")) {
      errorElement = document.createElement("div")
      errorElement.className = "error-message"
      field.parentNode.appendChild(errorElement)
    }

    errorElement.textContent = message
  }

  clearFieldError(field) {
    field.classList.remove("error")

    const errorElement = field.nextElementSibling
    if (errorElement && errorElement.classList.contains("error-message")) {
      errorElement.remove()
    }
  }

  validateForm(data) {
    let isValid = true
    const fields = document.querySelectorAll("input, textarea, select")

    fields.forEach((field) => {
      if (!this.validateField(field)) {
        isValid = false
      }
    })

    return isValid
  }

  submitForm(data) {
    const submitBtn = document.querySelector(".submit-btn")
    const originalText = submitBtn.innerHTML

    submitBtn.disabled = true
    submitBtn.innerHTML = "<span>提交中...</span>"

    fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.success) {
          this.showSuccessMessage()
          document.getElementById("contact-form").reset()
        } else {
          this.showErrorMessage(result.message || "提交失败，请稍后重试")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
        this.showErrorMessage("网络错误，请检查网络连接后重试")
      })
      .finally(() => {
        submitBtn.disabled = false
        submitBtn.innerHTML = originalText
      })
  }

  showSuccessMessage() {
    this.showMessage("咨询提交成功！我们的专业团队将在24小时内与您联系。", "success")
  }

  showErrorMessage(message) {
    this.showMessage(message, "error")
  }

  showMessage(message, type) {
    const messageDiv = document.createElement("div")
    messageDiv.className = `message ${type}`
    messageDiv.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()">×</button>
        `

    const form = document.getElementById("contact-form")
    form.parentNode.insertBefore(messageDiv, form)

    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove()
      }
    }, 5000)
  }

  setupAnimations() {
    const observer = new IntersectionObserver(
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
      },
    )

    document.querySelectorAll(".contact-method, .team-member").forEach((item) => {
      item.style.opacity = "0"
      item.style.transform = "translateY(30px)"
      item.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(item)
    })
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ContactPage()
})
