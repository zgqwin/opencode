class DocsPage {
  constructor() {
    this.init()
  }

  init() {
    this.setupNavigation()
    this.setupEventListeners()
  }

  setupNavigation() {
    const navLinks = document.querySelectorAll(".docs-nav-link")
    const sections = document.querySelectorAll(".docs-section")

    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()

        navLinks.forEach((l) => l.classList.remove("active"))
        link.classList.add("active")

        const targetId = link.getAttribute("href").substring(1)
        const targetSection = document.getElementById(targetId)

        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      })
    })

    window.addEventListener("scroll", () => {
      let current = ""
      sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100
        if (window.scrollY >= sectionTop) {
          current = section.getAttribute("id")
        }
      })

      navLinks.forEach((link) => {
        link.classList.remove("active")
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active")
        }
      })
    })
  }

  setupEventListeners() {
    document.addEventListener("DOMContentLoaded", () => {
      this.animateContent()
    })
  }

  animateContent() {
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

    document.querySelectorAll(".doc-card, .api-endpoint, .faq-item, .cert-item").forEach((item) => {
      item.style.opacity = "0"
      item.style.transform = "translateY(30px)"
      item.style.transition = "opacity 0.6s ease, transform 0.6s ease"
      observer.observe(item)
    })
  }
}

function downloadDoc(docType) {
  const docNames = {
    "quick-start": "EDDY-PRO快速入门指南.pdf",
    "full-manual": "EDDY-PRO详细操作手册.pdf",
  }

  const fileName = docNames[docType] || "document.pdf"

  alert(`开始下载: ${fileName}\n\n（演示功能，实际使用时会连接到真实文件）`)
}

function viewOnline(docType) {
  const docTitles = {
    "quick-start": "快速入门指南",
    "full-manual": "详细操作手册",
  }

  const title = docTitles[docType] || "文档"

  openModal(
    "在线查看",
    `
        <div style="text-align: center;">
            <h3>${title}</h3>
            <div style="background: #f8fafc; padding: 2rem; border-radius: 8px; margin: 1rem 0;">
                <p style="color: #64748b;">文档查看功能正在开发中...</p>
                <p style="color: #64748b; font-size: 0.9rem;">实际产品将提供完整的在线文档查看功能</p>
            </div>
            <button onclick="closeModal()" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
                关闭
            </button>
        </div>
    `,
  )
}

function viewCert(certType) {
  const certNames = {
    iso9001: "ISO 9001质量管理体系认证",
    ce: "CE欧洲市场准入认证",
    rohs: "RoHS环保认证",
  }

  const certName = certNames[certType] || "认证证书"

  openModal(
    "认证证书",
    `
        <div style="text-align: center;">
            <h3>${certName}</h3>
            <div style="background: #f8fafc; padding: 2rem; border-radius: 8px; margin: 1rem 0;">
                <p style="color: #64748b;">证书查看功能正在开发中...</p>
                <p style="color: #64748b; font-size: 0.9rem;">实际产品将提供完整的证书查看和下载功能</p>
            </div>
            <button onclick="closeModal()" style="background: #2563eb; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer;">
                关闭
            </button>
        </div>
    `,
  )
}

document.addEventListener("DOMContentLoaded", () => {
  new DocsPage()
})
