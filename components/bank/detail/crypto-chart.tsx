"use client"

import { useEffect, useRef, useState } from "react"

export default function CryptoChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredCandle, setHoveredCandle] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for sharper rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`

    // Draw chart
    drawPremiumChart(ctx, rect.width, rect.height, hoveredCandle)

    // Handle mouse move for interactive effects
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setMousePosition({ x, y })

      // Determine which candle is being hovered
      const candleWidth = rect.width / (chartData.length + 2)
      const padding = candleWidth / 2

      let hoveredIndex = null
      for (let i = 0; i < chartData.length; i++) {
        const candleX = padding + i * candleWidth
        if (Math.abs(x - candleX) < candleWidth / 2) {
          hoveredIndex = i
          break
        }
      }

      setHoveredCandle(hoveredIndex)
    }

    canvas.addEventListener("mousemove", handleMouseMove)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [hoveredCandle])

  return (
    <div className="relative h-32 w-full">
      <canvas ref={canvasRef} className="w-full h-full rounded-md" />

      {hoveredCandle !== null && (
        <div
          className="absolute bg-black/80 text-white text-xs p-2 rounded pointer-events-none z-10 backdrop-blur-sm border border-gray-700"
          style={{
            left: `${mousePosition.x + 10}px`,
            top: `${mousePosition.y - 60}px`,
            transform: mousePosition.x > 200 ? "translateX(-100%)" : "translateX(0)",
          }}
        >
          <div className="font-medium">{chartData[hoveredCandle].date}</div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1 mt-1">
            <div className="text-gray-400">Open:</div>
            <div>{chartData[hoveredCandle].open.toLocaleString()}</div>
            <div className="text-gray-400">Close:</div>
            <div className={chartData[hoveredCandle].isUp ? "text-green-400" : "text-rose-400"}>
              {chartData[hoveredCandle].close.toLocaleString()}
            </div>
            <div className="text-gray-400">High:</div>
            <div className="text-green-400">{chartData[hoveredCandle].high.toLocaleString()}</div>
            <div className="text-gray-400">Low:</div>
            <div className="text-rose-400">{chartData[hoveredCandle].low.toLocaleString()}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Sample data with dates
const chartData = [
  { date: "13:50", open: 100, close: 110, high: 115, low: 95, isUp: true },
  { date: "13:51", open: 110, close: 105, high: 112, low: 103, isUp: false },
  { date: "13:52", open: 105, close: 115, high: 118, low: 103, isUp: true },
  { date: "13:53", open: 115, close: 112, high: 120, low: 110, isUp: false },
  { date: "13:54", open: 112, close: 118, high: 125, low: 110, isUp: true },
  { date: "13:55", open: 118, close: 125, high: 130, low: 117, isUp: true },
  { date: "13:56", open: 125, close: 123, high: 128, low: 121, isUp: false },
  { date: "13:57", open: 123, close: 128, high: 130, low: 122, isUp: true },
  { date: "13:58", open: 128, close: 135, high: 138, low: 127, isUp: true },
  { date: "13:59", open: 135, close: 132, high: 136, low: 130, isUp: false },
  { date: "14:00", open: 132, close: 138, high: 140, low: 131, isUp: true },
  { date: "14:01", open: 138, close: 135, high: 139, low: 134, isUp: false },
  { date: "14:02", open: 135, close: 140, high: 142, low: 134, isUp: true },
  { date: "14:03", open: 140, close: 145, high: 148, low: 139, isUp: true },
  { date: "14:04", open: 145, close: 142, high: 146, low: 141, isUp: false },
  { date: "14:05", open: 142, close: 148, high: 150, low: 141, isUp: true },
  { date: "14:06", open: 148, close: 152, high: 155, low: 147, isUp: true },
  { date: "14:07", open: 152, close: 149, high: 153, low: 148, isUp: false },
  { date: "14:08", open: 149, close: 153, high: 156, low: 148, isUp: true },
  { date: "14:09", open: 153, close: 158, high: 160, low: 152, isUp: true },
  { date: "14:10", open: 158, close: 155, high: 159, low: 154, isUp: false },
  { date: "14:11", open: 155, close: 160, high: 163, low: 154, isUp: true },
  { date: "14:12", open: 160, close: 157, high: 161, low: 156, isUp: false },
  { date: "14:13", open: 157, close: 162, high: 165, low: 156, isUp: true },
  { date: "14:14", open: 162, close: 167, high: 170, low: 161, isUp: true },
]

function drawPremiumChart(ctx: CanvasRenderingContext2D, width: number, height: number, hoveredIndex: number | null) {
  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Add background gradient
  const bgGradient = ctx.createLinearGradient(0, 0, 0, height)
  bgGradient.addColorStop(0, "rgba(30, 41, 59, 0.05)")
  bgGradient.addColorStop(1, "rgba(30, 41, 59, 0)")
  ctx.fillStyle = bgGradient
  ctx.fillRect(0, 0, width, height)

  // Calculate min and max values for scaling
  const allValues = chartData.flatMap((d) => [d.high, d.low])
  const min = Math.min(...allValues) * 0.98
  const max = Math.max(...allValues) * 1.02
  const range = max - min

  // Draw grid lines
  ctx.strokeStyle = "rgba(148, 163, 184, 0.15)"
  ctx.lineWidth = 0.5

  // Horizontal grid lines
  const gridLines = 5
  for (let i = 0; i <= gridLines; i++) {
    const y = (i / gridLines) * height
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()

    // Add price labels
    const price = max - (i / gridLines) * range
    ctx.fillStyle = "rgba(148, 163, 184, 0.7)"
    ctx.font = "8px Inter, system-ui, sans-serif"
    ctx.textAlign = "left"
    ctx.fillText(price.toLocaleString(), 4, y - 3)
  }

  // Vertical grid lines - based on time labels
  const timeLabels = ["13:50", "13:55", "14:00", "14:05", "14:10", "14:14"]
  const timeStep = width / (timeLabels.length - 1)

  timeLabels.forEach((label, i) => {
    const x = i * timeStep
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height - 15) // Stop above the time labels
    ctx.stroke()
  })

  // Draw time labels
  ctx.fillStyle = "rgba(148, 163, 184, 0.7)"
  ctx.font = "8px Inter, system-ui, sans-serif"
  ctx.textAlign = "center"

  timeLabels.forEach((label, i) => {
    const x = i * timeStep
    ctx.fillText(label, x, height - 4)
  })

  // Draw area chart for trend visualization
  const areaPoints = chartData.map((candle, i) => {
    const x = (i / (chartData.length - 1)) * width
    const y = height - ((candle.close - min) / range) * (height - 20)
    return { x, y }
  })

  // Draw area under the line
  ctx.beginPath()
  ctx.moveTo(areaPoints[0].x, height - 15)
  areaPoints.forEach((point) => {
    ctx.lineTo(point.x, point.y)
  })
  ctx.lineTo(areaPoints[areaPoints.length - 1].x, height - 15)
  ctx.closePath()

  const areaGradient = ctx.createLinearGradient(0, 0, 0, height)
  areaGradient.addColorStop(0, "rgba(244, 63, 94, 0.2)")
  areaGradient.addColorStop(1, "rgba(244, 63, 94, 0)")
  ctx.fillStyle = areaGradient
  ctx.fill()

  // Draw the trend line
  ctx.beginPath()
  ctx.moveTo(areaPoints[0].x, areaPoints[0].y)
  areaPoints.forEach((point) => {
    ctx.lineTo(point.x, point.y)
  })
  ctx.strokeStyle = "rgba(244, 63, 94, 0.8)"
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Draw candlesticks
  const candleWidth = width / (chartData.length + 2)
  const padding = candleWidth / 2

  chartData.forEach((candle, i) => {
    const x = padding + i * candleWidth
    const isHovered = i === hoveredIndex

    // Scale prices to fit canvas height
    const scaledOpen = height - ((candle.open - min) / range) * (height - 20)
    const scaledClose = height - ((candle.close - min) / range) * (height - 20)
    const scaledHigh = height - ((candle.high - min) / range) * (height - 20)
    const scaledLow = height - ((candle.low - min) / range) * (height - 20)

    // Draw the wick (high to low line)
    ctx.beginPath()
    ctx.moveTo(x, scaledHigh)
    ctx.lineTo(x, scaledLow)

    // Use gradients for up/down candles
    if (candle.isUp) {
      ctx.strokeStyle = isHovered ? "#10b981" : "#34d399"
    } else {
      ctx.strokeStyle = isHovered ? "#f43f5e" : "#fb7185"
    }

    ctx.lineWidth = isHovered ? 2 : 1
    ctx.stroke()

    // Draw the body (open to close rectangle)
    const bodyTop = Math.min(scaledOpen, scaledClose)
    const bodyBottom = Math.max(scaledOpen, scaledClose)
    const bodyHeight = Math.max(bodyBottom - bodyTop, 1) // Ensure minimum height of 1px

    // Create gradient for candle body
    let bodyGradient
    if (candle.isUp) {
      bodyGradient = ctx.createLinearGradient(x - candleWidth / 4, bodyTop, x - candleWidth / 4, bodyBottom)
      bodyGradient.addColorStop(0, isHovered ? "#059669" : "#10b981")
      bodyGradient.addColorStop(1, isHovered ? "#10b981" : "#34d399")
    } else {
      bodyGradient = ctx.createLinearGradient(x - candleWidth / 4, bodyTop, x - candleWidth / 4, bodyBottom)
      bodyGradient.addColorStop(0, isHovered ? "#e11d48" : "#f43f5e")
      bodyGradient.addColorStop(1, isHovered ? "#f43f5e" : "#fb7185")
    }

    ctx.fillStyle = bodyGradient

    // Draw rounded rectangle for candle body
    const bodyWidth = isHovered ? candleWidth / 1.5 : candleWidth / 2
    const radius = 1
    const bodyX = x - bodyWidth / 2

    ctx.beginPath()
    ctx.moveTo(bodyX + radius, bodyTop)
    ctx.lineTo(bodyX + bodyWidth - radius, bodyTop)
    ctx.quadraticCurveTo(bodyX + bodyWidth, bodyTop, bodyX + bodyWidth, bodyTop + radius)
    ctx.lineTo(bodyX + bodyWidth, bodyBottom - radius)
    ctx.quadraticCurveTo(bodyX + bodyWidth, bodyBottom, bodyX + bodyWidth - radius, bodyBottom)
    ctx.lineTo(bodyX + radius, bodyBottom)
    ctx.quadraticCurveTo(bodyX, bodyBottom, bodyX, bodyBottom - radius)
    ctx.lineTo(bodyX, bodyTop + radius)
    ctx.quadraticCurveTo(bodyX, bodyTop, bodyX + radius, bodyTop)
    ctx.closePath()
    ctx.fill()

    // Add shadow for hovered candle
    if (isHovered) {
      ctx.shadowColor = candle.isUp ? "rgba(16, 185, 129, 0.5)" : "rgba(244, 63, 94, 0.5)"
      ctx.shadowBlur = 8
      ctx.fill()
      ctx.shadowBlur = 0
    }
  })
}
