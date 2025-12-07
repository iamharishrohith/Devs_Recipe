"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  ChevronRight,
  Terminal,
  Code,
  Monitor,
  Settings,
  FolderOpen,
  Play,
  Copy,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface Tutorial {
  id: string
  title: string
  icon: React.ElementType
  iconColor: string
  content: string[]
}

const tutorials: Tutorial[] = [
  {
    id: "run-script",
    title: "How to Run the Script",
    icon: Terminal,
    iconColor: "text-emerald-500",
    content: [
      "1. Download the .sh file from Devs Recipe",
      "2. Open Terminal (Mac/Linux) or Git Bash (Windows)",
      "3. Navigate to where you want your project: cd ~/Projects",
      "4. Make the script executable: chmod +x script-name.sh",
      "5. Run the script: ./script-name.sh",
      "6. Wait for all installations to complete",
      "7. Follow the printed instructions to start your project",
    ],
  },
  {
    id: "vscode-setup",
    title: "VS Code Setup",
    icon: Code,
    iconColor: "text-blue-500",
    content: [
      "Recommended Extensions:",
      "- ESLint (dbaeumer.vscode-eslint)",
      "- Prettier (esbenp.prettier-vscode)",
      "- Tailwind CSS IntelliSense (bradlc.vscode-tailwindcss)",
      "- Auto Rename Tag (formulahendry.auto-rename-tag)",
      "- GitLens (eamodio.gitlens)",
      "- Error Lens (usernamehw.errorlens)",
      "",
      "Useful Settings (settings.json):",
      '{ "editor.formatOnSave": true,',
      '  "editor.defaultFormatter": "esbenp.prettier-vscode" }',
    ],
  },
  {
    id: "python-setup",
    title: "Python Backend Setup",
    icon: Monitor,
    iconColor: "text-yellow-500",
    content: [
      "Prerequisites:",
      "- Python 3.9+ installed (python --version)",
      "- pip package manager (pip --version)",
      "",
      "Virtual Environment:",
      "1. Create: python -m venv venv",
      "2. Activate (Mac/Linux): source venv/bin/activate",
      "3. Activate (Windows): venv\\Scripts\\activate",
      "4. Install deps: pip install -r requirements.txt",
      "",
      "Running FastAPI: uvicorn app.main:app --reload",
      "Running Django: python manage.py runserver",
    ],
  },
  {
    id: "java-setup",
    title: "Java/Spring Boot Setup",
    icon: Settings,
    iconColor: "text-orange-500",
    content: [
      "Prerequisites:",
      "- Java 17+ (java --version)",
      "- Maven or Gradle",
      "",
      "Project Generation:",
      "1. Visit start.spring.io",
      "2. Select Maven/Gradle, Java 17+",
      "3. Add: Spring Web, Spring Data JPA",
      "4. Download and extract",
      "",
      "Running:",
      "Maven: ./mvnw spring-boot:run",
      "Gradle: ./gradlew bootRun",
    ],
  },
  {
    id: "project-structure",
    title: "Project Structure Best Practices",
    icon: FolderOpen,
    iconColor: "text-purple-500",
    content: [
      "Frontend (React/Next.js):",
      "src/components/ - Reusable UI components",
      "src/hooks/ - Custom React hooks",
      "src/lib/ - Utilities and helpers",
      "src/app/ - Routes (Next.js App Router)",
      "",
      "Backend (Node/Python):",
      "src/routes/ - API endpoints",
      "src/services/ - Business logic",
      "src/models/ - Database models",
      "src/middleware/ - Request middleware",
    ],
  },
  {
    id: "first-run",
    title: "First Run Checklist",
    icon: Play,
    iconColor: "text-green-500",
    content: [
      "After running the script:",
      "",
      "1. Open project in VS Code: code .",
      "2. Install recommended extensions",
      "3. Create .env file from .env.example",
      "4. Set up database (if applicable):",
      "   - Prisma: npx prisma db push",
      "   - Django: python manage.py migrate",
      "5. Start development server:",
      "   - npm run dev (JS/TS)",
      "   - uvicorn app.main:app --reload (FastAPI)",
    ],
  },
]

export function TutorialSection() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [visibleCards, setVisibleCards] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  // Intersection observer for card animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-tutorial-id")
            if (id) {
              setVisibleCards((prev) => new Set([...prev, id]))
            }
          }
        })
      },
      { threshold: 0.1, rootMargin: "50px" },
    )

    const cards = containerRef.current?.querySelectorAll("[data-tutorial-id]")
    cards?.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [])

  const copyContent = (tutorial: Tutorial) => {
    const text = tutorial.content.join("\n")
    navigator.clipboard.writeText(text)
    setCopiedId(tutorial.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Getting Started Tutorials</h2>
        <p className="text-slate-600 mt-1">Learn how to use your generated scripts</p>
      </div>

      <div ref={containerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorials.map((tutorial, index) => (
          <Card
            key={tutorial.id}
            data-tutorial-id={tutorial.id}
            className={cn(
              "overflow-hidden bg-white border-slate-200 transition-all duration-500",
              visibleCards.has(tutorial.id) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
              expandedId === tutorial.id && "row-span-2 shadow-lg",
            )}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <button
              className="w-full p-4 flex items-center gap-3 text-left hover:bg-slate-50 transition-colors"
              onClick={() => setExpandedId(expandedId === tutorial.id ? null : tutorial.id)}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
                  expandedId === tutorial.id ? "bg-emerald-100 scale-110" : "bg-slate-100",
                )}
              >
                <tutorial.icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    expandedId === tutorial.id ? "text-emerald-600" : tutorial.iconColor,
                  )}
                />
              </div>
              <span className="font-medium text-slate-900 flex-1">{tutorial.title}</span>
              <div className={cn("transition-transform duration-300", expandedId === tutorial.id && "rotate-180")}>
                {expandedId === tutorial.id ? (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-slate-400" />
                )}
              </div>
            </button>

            <div
              className={cn(
                "overflow-hidden transition-all duration-300",
                expandedId === tutorial.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
              )}
            >
              <div className="px-4 pb-4">
                <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm text-slate-700 space-y-1 relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-8 w-8 p-0"
                    onClick={() => copyContent(tutorial)}
                  >
                    {copiedId === tutorial.id ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4 text-slate-400" />
                    )}
                  </Button>
                  {tutorial.content.map((line, i) => (
                    <div
                      key={i}
                      className={cn(
                        "transition-all duration-200",
                        line === "" && "h-2",
                        line.startsWith("-") && "pl-4 text-slate-600",
                        line.match(/^\d\./) && "text-emerald-700 font-medium",
                      )}
                      style={{ transitionDelay: `${i * 30}ms` }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
