"use client"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Download, Check, Search, Eye, TrendingUp } from "lucide-react"
import Image from "next/image"
import { TemplatePreviewModal } from "./template-preview-modal"
import { trackTemplateDownload, getPopularTemplates } from "@/lib/analytics"

interface QuickTemplate {
  id: string
  name: string
  description: string
  icon: string
  tags: string[]
  script: string
  category: string
}

const quickTemplates: QuickTemplate[] = [
  {
    id: "nextjs-shadcn",
    name: "Next.js + shadcn/ui",
    description: "Modern React with App Router, Tailwind CSS, and shadcn/ui components",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    tags: ["React", "TypeScript", "Tailwind"],
    category: "Frontend",
    script: `#!/bin/bash
# Next.js + shadcn/ui Starter
echo "Creating Next.js + shadcn/ui project..."
npx create-next-app@latest my-nextjs-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd my-nextjs-app
npx shadcn@latest init -y
npx shadcn@latest add button card input label dialog dropdown-menu
echo "Done! Run: cd my-nextjs-app && npm run dev"`,
  },
  {
    id: "vite-react-ts",
    name: "Vite + React + TypeScript",
    description: "Lightning fast React development with Vite and TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg",
    tags: ["React", "TypeScript", "Vite"],
    category: "Frontend",
    script: `#!/bin/bash
# Vite + React + TypeScript Starter
echo "Creating Vite React project..."
npm create vite@latest my-vite-app -- --template react-ts
cd my-vite-app
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
echo "Done! Run: cd my-vite-app && npm run dev"`,
  },
  {
    id: "fullstack-nextjs-prisma",
    name: "Full-Stack Next.js + Prisma",
    description: "Complete full-stack setup with Next.js, Prisma, and PostgreSQL",
    icon: "https://cdn.simpleicons.org/prisma/2D3748",
    tags: ["Full-Stack", "Prisma", "PostgreSQL"],
    category: "Full-Stack",
    script: `#!/bin/bash
# Full-Stack Next.js + Prisma
echo "Creating Full-Stack project..."
npx create-next-app@latest my-fullstack-app --typescript --tailwind --eslint --app --src-dir
cd my-fullstack-app
npm install prisma @prisma/client
npx prisma init
npm install zod @tanstack/react-query
npx shadcn@latest init -y
echo "Done! Configure DATABASE_URL in .env then run: npx prisma db push"`,
  },
  {
    id: "express-ts-api",
    name: "Express.js API (TypeScript)",
    description: "RESTful API with Express.js, TypeScript, and best practices",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg",
    tags: ["Backend", "Node.js", "API"],
    category: "Backend",
    script: `#!/bin/bash
# Express.js TypeScript API
echo "Creating Express API..."
mkdir my-express-api && cd my-express-api
npm init -y
npm install express cors dotenv helmet morgan
npm install -D typescript @types/express @types/cors @types/node ts-node nodemon
npx tsc --init
mkdir src && touch src/index.ts
echo "Done! Run: cd my-express-api && npm run dev"`,
  },
  {
    id: "fastapi-python",
    name: "FastAPI (Python)",
    description: "Modern Python API with FastAPI, async support, and auto docs",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
    tags: ["Backend", "Python", "API"],
    category: "Backend",
    script: `#!/bin/bash
# FastAPI Python API
echo "Creating FastAPI project..."
mkdir my-fastapi-app && cd my-fastapi-app
python -m venv venv
source venv/bin/activate
pip install fastapi uvicorn python-dotenv sqlalchemy pydantic
mkdir app && touch app/__init__.py app/main.py
echo "Done! Run: uvicorn app.main:app --reload"`,
  },
  {
    id: "django-rest",
    name: "Django REST Framework",
    description: "Robust Python backend with Django and REST Framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
    tags: ["Backend", "Python", "Django"],
    category: "Backend",
    script: `#!/bin/bash
# Django REST Framework
echo "Creating Django project..."
mkdir my-django-app && cd my-django-app
python -m venv venv
source venv/bin/activate
pip install django djangorestframework django-cors-headers python-dotenv
django-admin startproject backend .
python manage.py startapp api
echo "Done! Run: python manage.py runserver"`,
  },
  {
    id: "spring-boot-java",
    name: "Spring Boot (Java)",
    description: "Enterprise Java backend with Spring Boot",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg",
    tags: ["Backend", "Java", "Enterprise"],
    category: "Backend",
    script: `#!/bin/bash
# Spring Boot Java Setup Instructions
echo "Spring Boot Project Setup"
echo ""
echo "1. Visit: https://start.spring.io"
echo "2. Select: Maven/Gradle, Java 17+, Spring Boot 3.x"
echo "3. Add dependencies: Spring Web, Spring Data JPA, PostgreSQL Driver"
echo "4. Download and extract the project"
echo ""
echo "Or use: spring init --dependencies=web,data-jpa,postgresql my-spring-app"`,
  },
  {
    id: "react-native-expo",
    name: "React Native + Expo",
    description: "Cross-platform mobile app with Expo and TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    tags: ["Mobile", "React Native", "Expo"],
    category: "Mobile",
    script: `#!/bin/bash
# React Native + Expo
echo "Creating React Native app..."
npx create-expo-app my-mobile-app --template blank-typescript
cd my-mobile-app
npx expo install expo-router react-native-safe-area-context
npm install nativewind tailwindcss zustand
echo "Done! Run: npx expo start"`,
  },
  {
    id: "nextjs-supabase",
    name: "Next.js + Supabase",
    description: "Full-stack with Supabase auth, database, and storage",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
    tags: ["Full-Stack", "Supabase", "Auth"],
    category: "Full-Stack",
    script: `#!/bin/bash
# Next.js + Supabase
echo "Creating Next.js + Supabase project..."
npx create-next-app@latest my-supabase-app --typescript --tailwind --eslint --app --src-dir
cd my-supabase-app
npm install @supabase/supabase-js @supabase/ssr
npx shadcn@latest init -y
echo "Done! Add SUPABASE_URL and SUPABASE_ANON_KEY to .env.local"`,
  },
  {
    id: "nextjs-firebase",
    name: "Next.js + Firebase",
    description: "Full-stack with Firebase auth, Firestore, and hosting",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
    tags: ["Full-Stack", "Firebase", "Auth"],
    category: "Full-Stack",
    script: `#!/bin/bash
# Next.js + Firebase
echo "Creating Next.js + Firebase project..."
npx create-next-app@latest my-firebase-app --typescript --tailwind --eslint --app --src-dir
cd my-firebase-app
npm install firebase firebase-admin
npx shadcn@latest init -y
echo "Done! Run: firebase login && firebase init"`,
  },
  {
    id: "t3-stack",
    name: "T3 Stack",
    description: "Next.js, tRPC, Prisma, NextAuth, and Tailwind",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    tags: ["Full-Stack", "tRPC", "Prisma"],
    category: "Full-Stack",
    script: `#!/bin/bash
# T3 Stack
echo "Creating T3 Stack project..."
npm create t3-app@latest my-t3-app
cd my-t3-app
npm install
echo "Done! Run: npm run dev"`,
  },
  {
    id: "vue-nuxt",
    name: "Vue 3 + Nuxt",
    description: "Vue 3 with Nuxt 3, TypeScript, and Tailwind CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg",
    tags: ["Vue", "Nuxt", "TypeScript"],
    category: "Frontend",
    script: `#!/bin/bash
# Vue 3 + Nuxt 3
echo "Creating Nuxt project..."
npx nuxi@latest init my-nuxt-app
cd my-nuxt-app
npm install
npm install -D @nuxtjs/tailwindcss
npm install pinia @pinia/nuxt
echo "Done! Run: npm run dev"`,
  },
  {
    id: "svelte-sveltekit",
    name: "SvelteKit",
    description: "SvelteKit with TypeScript, Tailwind, and best practices",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg",
    tags: ["Svelte", "SvelteKit", "TypeScript"],
    category: "Frontend",
    script: `#!/bin/bash
# SvelteKit
echo "Creating SvelteKit project..."
npm create svelte@latest my-svelte-app
cd my-svelte-app
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
echo "Done! Run: npm run dev"`,
  },
  {
    id: "astro-blog",
    name: "Astro Blog",
    description: "Static blog with Astro, MDX, and Tailwind CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg",
    tags: ["Astro", "Blog", "MDX"],
    category: "Frontend",
    script: `#!/bin/bash
# Astro Blog
echo "Creating Astro blog..."
npm create astro@latest my-astro-blog -- --template blog
cd my-astro-blog
npm install @astrojs/tailwind tailwindcss @astrojs/mdx
echo "Done! Run: npm run dev"`,
  },
  {
    id: "go-gin-api",
    name: "Go + Gin API",
    description: "High-performance Go backend with Gin framework",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg",
    tags: ["Backend", "Go", "API"],
    category: "Backend",
    script: `#!/bin/bash
# Go + Gin API
echo "Creating Go Gin project..."
mkdir my-go-api && cd my-go-api
go mod init my-go-api
go get -u github.com/gin-gonic/gin
go get -u gorm.io/gorm
go get -u gorm.io/driver/postgres
mkdir cmd pkg internal
touch cmd/main.go
echo "Done! Run: go run cmd/main.go"`,
  },
  {
    id: "flask-python",
    name: "Flask (Python)",
    description: "Lightweight Python web framework for quick APIs",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
    tags: ["Backend", "Python", "API"],
    category: "Backend",
    script: `#!/bin/bash
# Flask Python API
echo "Creating Flask project..."
mkdir my-flask-app && cd my-flask-app
python -m venv venv
source venv/bin/activate
pip install flask flask-cors python-dotenv flask-sqlalchemy
mkdir app && touch app/__init__.py app/routes.py
echo "Done! Run: flask run"`,
  },
  {
    id: "electron-desktop",
    name: "Electron Desktop App",
    description: "Cross-platform desktop application with Electron",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg",
    tags: ["Desktop", "Electron", "Node.js"],
    category: "Desktop",
    script: `#!/bin/bash
# Electron Desktop App
echo "Creating Electron app..."
mkdir my-electron-app && cd my-electron-app
npm init -y
npm install electron electron-builder
mkdir src && touch src/main.js src/preload.js
echo "Done! Run: npm start"`,
  },
  {
    id: "remix-app",
    name: "Remix Full-Stack",
    description: "Remix with TypeScript, Tailwind, and Prisma",
    icon: "https://cdn.simpleicons.org/remix/000000",
    tags: ["Remix", "Full-Stack", "TypeScript"],
    category: "Full-Stack",
    script: `#!/bin/bash
# Remix Full-Stack
echo "Creating Remix project..."
npx create-remix@latest my-remix-app
cd my-remix-app
npm install -D tailwindcss postcss autoprefixer
npm install prisma @prisma/client
npx prisma init
echo "Done! Run: npm run dev"`,
  },
  {
    id: "angular-standalone",
    name: "Angular Standalone",
    description: "Angular with standalone components and signals",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg",
    tags: ["Angular", "TypeScript", "Standalone"],
    category: "Frontend",
    script: `#!/bin/bash
# Angular Standalone
echo "Creating Angular project..."
npx @angular/cli new my-angular-app --standalone --style=scss
cd my-angular-app
npm install
echo "Done! Run: ng serve"`,
  },
  {
    id: "nestjs-api",
    name: "NestJS API",
    description: "Enterprise Node.js framework with TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nestjs/nestjs-original.svg",
    tags: ["Backend", "NestJS", "TypeScript"],
    category: "Backend",
    script: `#!/bin/bash
# NestJS API
echo "Creating NestJS project..."
npx @nestjs/cli new my-nestjs-api
cd my-nestjs-api
npm install @nestjs/typeorm typeorm pg
echo "Done! Run: npm run start:dev"`,
  },
]

const categories = ["All", "Frontend", "Backend", "Full-Stack", "Mobile", "Desktop"]

export function QuickTemplates() {
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [previewTemplate, setPreviewTemplate] = useState<QuickTemplate | null>(null)
  const [popularTemplates, setPopularTemplates] = useState<string[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setPopularTemplates(getPopularTemplates())
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-template-id")
            if (id) {
              setVisibleCards((prev) => new Set([...prev, id]))
            }
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" },
    )

    const cards = containerRef.current?.querySelectorAll("[data-template-id]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [searchQuery, selectedCategory])

  const filteredTemplates = quickTemplates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleTemplate = (id: string) => {
    setSelectedTemplates((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
  }

  const downloadSelected = () => {
    if (selectedTemplates.length === 0) return

    const combinedScript = selectedTemplates
      .map((id) => {
        const template = quickTemplates.find((t) => t.id === id)
        trackTemplateDownload(id)
        return template?.script || ""
      })
      .join("\n\n# ========================================\n\n")

    const blob = new Blob([combinedScript], { type: "text/x-sh" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = selectedTemplates.length === 1 ? `${selectedTemplates[0]}-setup.sh` : "combined-setup.sh"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadSingle = async (template: QuickTemplate) => {
    setDownloadingId(template.id)
    await new Promise((resolve) => setTimeout(resolve, 300))

    trackTemplateDownload(template.id)

    const blob = new Blob([template.script], { type: "text/x-sh" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${template.id}-setup.sh`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    setDownloadingId(null)
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Quick Templates</h2>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Select one or multiple templates and download instantly
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={cn(
                selectedCategory === category &&
                  "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600",
              )}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Selected count and download button */}
      {selectedTemplates.length > 0 && (
        <div className="flex items-center justify-center gap-4 mb-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <span className="text-sm text-slate-600 dark:text-slate-400">
            {selectedTemplates.length} template
            {selectedTemplates.length > 1 ? "s" : ""} selected
          </span>
          <Button
            onClick={downloadSelected}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Selected
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSelectedTemplates([])}>
            Clear
          </Button>
        </div>
      )}

      <div ref={containerRef} className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTemplates.map((template, index) => (
          <Card
            key={template.id}
            data-template-id={template.id}
            className={cn(
              "p-4 cursor-pointer border-2 bg-white dark:bg-slate-800 relative overflow-hidden group",
              "transition-all duration-300 ease-out",
              visibleCards.has(template.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              selectedTemplates.includes(template.id)
                ? "border-emerald-500 shadow-lg shadow-emerald-500/20"
                : "border-slate-200 dark:border-slate-700 hover:border-emerald-300 hover:shadow-md",
              hoveredId === template.id && "scale-[1.02]",
            )}
            style={{ transitionDelay: `${(index % 8) * 50}ms` }}
            onClick={() => toggleTemplate(template.id)}
            onMouseEnter={() => setHoveredId(template.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Popular badge */}
            {popularTemplates.includes(template.id) && (
              <div className="absolute top-2 left-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Popular
              </div>
            )}

            {/* Background glow on hover */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 opacity-0 transition-opacity duration-300",
                hoveredId === template.id && "opacity-100",
              )}
            />

            {/* Selection indicator */}
            {selectedTemplates.includes(template.id) && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="relative flex items-start gap-3">
              <Checkbox
                checked={selectedTemplates.includes(template.id)}
                onCheckedChange={() => toggleTemplate(template.id)}
                className="mt-1 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600",
                      selectedTemplates.includes(template.id) && "border-emerald-300",
                    )}
                  >
                    <Image
                      src={template.icon || "/placeholder.svg"}
                      alt={template.name}
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{template.name}</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 line-clamp-2">{template.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewTemplate(template)
                    }}
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={downloadingId === template.id}
                    className="flex-1 text-xs bg-white dark:bg-slate-700 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:border-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      downloadSingle(template)
                    }}
                  >
                    {downloadingId === template.id ? (
                      <>
                        <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mr-1" />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400">No templates found matching your search.</p>
        </div>
      )}

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        onDownload={() => {
          if (previewTemplate) {
            downloadSingle(previewTemplate)
            setPreviewTemplate(null)
          }
        }}
      />
    </div>
  )
}
