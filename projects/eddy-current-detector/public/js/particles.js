class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById("particleCanvas")
    this.ctx = this.canvas.getContext("2d")
    this.particles = []
    this.mouse = { x: 0, y: 0 }

    this.init()
    this.animate()
  }

  init() {
    this.resize()
    window.addEventListener("resize", () => this.resize())
    window.addEventListener("mousemove", (e) => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY
    })

    this.createParticles()
  }

  resize() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }

  createParticles() {
    const particleCount = Math.min(100, Math.floor(window.innerWidth / 20))

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: `rgba(37, 99, 235, ${Math.random() * 0.3 + 0.1})`,
      })
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.particles.forEach((particle, index) => {
      particle.x += particle.speedX
      particle.y += particle.speedY

      if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1
      if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1

      const dx = this.mouse.x - particle.x
      const dy = this.mouse.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        const angle = Math.atan2(dy, dx)
        const force = ((100 - distance) / 100) * 0.5
        particle.speedX -= Math.cos(angle) * force
        particle.speedY -= Math.sin(angle) * force
      }

      this.ctx.beginPath()
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
      this.ctx.fillStyle = particle.color
      this.ctx.fill()

      for (let j = index + 1; j < this.particles.length; j++) {
        const otherParticle = this.particles[j]
        const dx = particle.x - otherParticle.x
        const dy = particle.y - otherParticle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 100) {
          this.ctx.beginPath()
          this.ctx.strokeStyle = `rgba(37, 99, 235, ${0.1 * (1 - distance / 100)})`
          this.ctx.lineWidth = 0.5
          this.ctx.moveTo(particle.x, particle.y)
          this.ctx.lineTo(otherParticle.x, otherParticle.y)
          this.ctx.stroke()
        }
      }
    })

    requestAnimationFrame(() => this.animate())
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new ParticleSystem()
})
