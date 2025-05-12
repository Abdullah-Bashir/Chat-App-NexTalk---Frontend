"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

export function CircuitBackground() {
  const canvasRef = useRef(null)
  const { theme } = useTheme()
  const mouseRef = useRef({ x: null, y: null })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId
    let particles = []
    let connections = []

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 1 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }

      draw() {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    class Connection {
      constructor(from, to) {
        this.from = from
        this.to = to
        this.distance = Math.hypot(from.x - to.x, from.y - to.y)
      }

      draw(mouse) {
        if (this.distance >= 100) return

        const midX = (this.from.x + this.to.x) / 2
        const midY = (this.from.y + this.to.y) / 2

        let baseOpacity = 1 - this.distance / 100
        let glowStrength = 0

        if (mouse.x !== null && mouse.y !== null) {
          const distToMouse = Math.hypot(mouse.x - midX, mouse.y - midY)
          if (distToMouse < 150) {
            glowStrength = 1 - distToMouse / 150
          }
        }

        const isDark = theme === "dark"
        const normalColor = isDark ? "rgba(147, 51, 234, 0.25)" : "rgba(79, 70, 229, 0.25)"
        const glowColor = isDark ? "rgba(168, 85, 247, 0.9)" : "rgba(99, 102, 241, 0.9)"

        // Base line
        ctx.strokeStyle = normalColor
        ctx.lineWidth = 1
        ctx.globalAlpha = baseOpacity
        ctx.beginPath()
        ctx.moveTo(this.from.x, this.from.y)
        ctx.lineTo(this.to.x, this.to.y)
        ctx.stroke()

        // Glow line on top
        if (glowStrength > 0) {
          ctx.strokeStyle = glowColor
          ctx.lineWidth = 1.5 + glowStrength * 2
          ctx.globalAlpha = 0.3 + glowStrength * 0.7
          ctx.beginPath()
          ctx.moveTo(this.from.x, this.from.y)
          ctx.lineTo(this.to.x, this.to.y)
          ctx.stroke()
        }

        ctx.globalAlpha = 1
      }
    }

    const initParticles = () => {
      particles = []
      connections = []

      const particleCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 9000), 100)

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const distance = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y)
          if (distance < 100) {
            connections.push(new Connection(particles[i], particles[j]))
          }
        }
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const isDark = theme === "dark"
      ctx.fillStyle = isDark ? "rgba(147, 51, 234, 0.7)" : "rgba(79, 70, 229, 0.7)"

      particles.forEach((p) => {
        p.update()
        p.draw()
      })

      connections.forEach((c) => {
        c.draw(mouseRef.current)
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null }
    }

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [theme])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10 bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-black"
    />
  )
}
