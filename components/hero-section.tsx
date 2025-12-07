"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Code2, Layers, Zap, Database, Terminal, GitBranch, Boxes } from "lucide-react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

interface HeroSectionProps {
  onStartBuilding: () => void
}

export function HeroSection({ onStartBuilding }: HeroSectionProps) {
  const [particles, setParticles] = useState<Particle[]>([])
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.2,
    }))
    setParticles(initialParticles)
    setIsVisible(true)
  }, [])

  useEffect(() => {
    const animate = () => {
      setParticles((prev) =>
        prev.map((p) => ({
          ...p,
          x: (p.x + p.speedX + 100) % 100,
          y: (p.y + p.speedY + 100) % 100,
        })),
      )
      animationRef.current = requestAnimationFrame(animate)
    }
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    setMousePos({
      x: (e.clientX - rect.left - rect.width / 2) / 50,
      y: (e.clientY - rect.top - rect.height / 2) / 50,
    })
  }

  const floatingIcons = [
    { Icon: Code2, delay: 0, x: 10, y: 20 },
    { Icon: Layers, delay: 0.2, x: 85, y: 15 },
    { Icon: Zap, delay: 0.4, x: 15, y: 70 },
    { Icon: Database, delay: 0.6, x: 80, y: 75 },
    { Icon: Terminal, delay: 0.8, x: 5, y: 45 },
    { Icon: GitBranch, delay: 1, x: 92, y: 45 },
    { Icon: Boxes, delay: 1.2, x: 25, y: 85 },
  ]

  const scrollToTemplates = () => {
    const section = document.querySelector("section.bg-gradient-to-br")
    section?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{
        background: "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
      }}
      onMouseMove={handleMouseMove}
    >
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white transition-transform duration-1000"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity * 0.6,
              transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)`,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div
        className="absolute w-96 h-96 rounded-full bg-white/20 blur-3xl transition-transform duration-700"
        style={{
          left: "20%",
          top: "20%",
          transform: `translate(${mousePos.x * 3}px, ${mousePos.y * 3}px)`,
        }}
      />
      <div
        className="absolute w-80 h-80 rounded-full bg-white/10 blur-3xl transition-transform duration-700"
        style={{
          right: "15%",
          bottom: "25%",
          transform: `translate(${-mousePos.x * 2}px, ${-mousePos.y * 2}px)`,
        }}
      />

      {/* Floating Tech Icons */}
      {floatingIcons.map(({ Icon, delay, x, y }, i) => (
        <div
          key={i}
          className={`absolute transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `translate(${mousePos.x * (i % 2 === 0 ? 1 : -1)}px, ${mousePos.y * (i % 2 === 0 ? 1 : -1)}px)`,
            transitionDelay: `${delay}s`,
            animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        >
          <div className="w-12 h-12 rounded-xl bg-white/90 shadow-lg shadow-black/10 backdrop-blur-sm border border-white/50 flex items-center justify-center">
            <Icon className="w-6 h-6 text-emerald-600" />
          </div>
        </div>
      ))}

      {/* Main Content */}
      <div
        className={`relative z-10 text-center px-4 max-w-4xl mx-auto transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
      >
        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-white/90 mb-4 max-w-2xl mx-auto">Visual Project Scaffolder</p>
        <p className="text-base sm:text-lg text-white/80 mb-12 max-w-xl mx-auto">
          Generate production-ready setup scripts for your next project. Choose your stack, customize your structure,
          and download in seconds.
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 sm:gap-12 mb-12">
          {[
            { number: "50+", label: "Frameworks" },
            { number: "100+", label: "Libraries" },
            { number: "20+", label: "Templates" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`text-center transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
              style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
            >
              <div className="text-3xl sm:text-4xl font-bold text-white">{stat.number}</div>
              <div className="text-sm text-white/70">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          size="lg"
          onClick={onStartBuilding}
          className="bg-white text-emerald-600 hover:bg-white/90 px-8 py-6 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 font-semibold"
        >
          Start Creating Your Own
        </Button>

        {/* Scroll Indicator */}
        <button onClick={scrollToTemplates} className="mt-16 animate-bounce block mx-auto">
          <ArrowDown className="w-6 h-6 text-white/70 mx-auto" />
          <span className="text-sm text-white/60 mt-2 block">View Quick Templates</span>
        </button>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </section>
  )
}
