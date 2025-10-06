"use client"

import { useEffect, useRef } from "react"

// Simple Perlin-like noise implementation for organic movement
class SimplexNoise {
  private perm: number[]

  constructor(seed = Math.random()) {
    this.perm = []
    for (let i = 0; i < 256; i++) {
      this.perm[i] = i
    }
    // Shuffle based on seed
    for (let i = 255; i > 0; i--) {
      const j = Math.floor((seed * (i + 1)) % (i + 1))
      ;[this.perm[i], this.perm[j]] = [this.perm[j], this.perm[i]]
    }
    // Duplicate for overflow
    for (let i = 0; i < 256; i++) {
      this.perm[256 + i] = this.perm[i]
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10)
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a)
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 3
    const u = h < 2 ? x : y
    const v = h < 2 ? y : x
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v)
  }

  noise(x: number, y: number): number {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    x -= Math.floor(x)
    y -= Math.floor(y)
    const u = this.fade(x)
    const v = this.fade(y)
    const a = this.perm[X] + Y
    const b = this.perm[X + 1] + Y
    return this.lerp(
      this.lerp(this.grad(this.perm[a], x, y), this.grad(this.perm[b], x - 1, y), u),
      this.lerp(this.grad(this.perm[a + 1], x, y - 1), this.grad(this.perm[b + 1], x - 1, y - 1), u),
      v,
    )
  }
}

interface Blob {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  color: string
  speed: number
  angle: number
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: false })
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize noise
    const noise = new SimplexNoise(42)

    // Create organic color blobs
    const blobs: Blob[] = [
      {
        x: canvas.width * 0.2,
        y: canvas.height * 0.25,
        baseX: canvas.width * 0.2,
        baseY: canvas.height * 0.25,
        radius: 500,
        color: "rgba(129, 199, 132, 0.4)", // Soft green
        speed: 0.03,
        angle: 0,
      },
      {
        x: canvas.width * 0.7,
        y: canvas.height * 0.4,
        baseX: canvas.width * 0.7,
        baseY: canvas.height * 0.4,
        radius: 380,
        color: "rgba(100, 200, 246, 0.35)", // Soft blue
        speed: 0.008,
        angle: Math.PI / 3,
      },
      {
        x: canvas.width * 0.5,
        y: canvas.height * 0.7,
        baseX: canvas.width * 0.5,
        baseY: canvas.height * 0.7,
        radius: 280,
        color: "rgba(15, 181, 139, 0.3)", // Soft purple
        speed: 0.035,
        angle: (Math.PI * 2) / 3,
      },
      {
        x: canvas.width * 0.8,
        y: canvas.height * 0.8,
        baseX: canvas.width * 0.8,
        baseY: canvas.height * 0.8,
        radius: 250,
        color: "rgba(174, 213, 129, 0.35)", // Light green
        speed: 0.00045,
        angle: Math.PI,
      },
    ]

    let time = 0

    // Animation loop
    const animate = () => {
      time += 1

      // Clear with base color
      ctx.fillStyle = "#f5f5f5"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw blobs
      blobs.forEach((blob) => {
        // Use noise for organic movement
        const noiseX = noise.noise(blob.baseX * 0.001 + time * blob.speed, time * blob.speed)
        const noiseY = noise.noise(blob.baseY * 0.001 + time * blob.speed + 100, time * blob.speed + 100)

        // Move blob in circular pattern with noise
        blob.x = blob.baseX + Math.cos(blob.angle + time * blob.speed) * 80 + noiseX * 60
        blob.y = blob.baseY + Math.sin(blob.angle + time * blob.speed) * 80 + noiseY * 60

        // Create radial gradient
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius)
        gradient.addColorStop(0, blob.color)
        gradient.addColorStop(0.5, blob.color.replace(/[\d.]+\)/, "0.15)"))
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)")

        // Draw blob
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      })

      // Add subtle grain texture
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data
      const grainIntensity = 8

      for (let i = 0; i < data.length; i += 4) {
        const grain = (Math.random() - 0.5) * grainIntensity
        data[i] += grain // R
        data[i + 1] += grain // G
        data[i + 2] += grain // B
      }

      ctx.putImageData(imageData, 0, 0)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  )
}
