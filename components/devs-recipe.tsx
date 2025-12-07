"use client"

import { useState, useRef, useEffect } from "react"
import { StepIndicator } from "./step-indicator"
import { StackSelector } from "./stack-selector"
import { FolderStructure } from "./folder-structure"
import { ScriptPreview } from "./script-preview"
import { QuickTemplates } from "./quick-templates"
import { HeroSection } from "./hero-section"
import { VersionSelector } from "./version-selector"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, X, Keyboard } from "lucide-react"
import { generateBashScript } from "@/lib/script-generator"
import { useKeyboardShortcuts } from "./keyboard-shortcuts"
import { trackProjectGenerated } from "@/lib/analytics"
import type { ProjectConfig, FolderNode } from "@/lib/types"

const STORAGE_KEY = "devs-recipe-progress"

const defaultFolders: FolderNode[] = [
  {
    id: "src",
    name: "src",
    type: "folder",
    children: [
      { id: "components", name: "components", type: "folder", children: [] },
      { id: "hooks", name: "hooks", type: "folder", children: [] },
      { id: "utils", name: "utils", type: "folder", children: [] },
    ],
  },
]

const defaultConfig: ProjectConfig = {
  projectName: "my-awesome-app",
  frontend: "react",
  variant: "ts",
  styling: ["tailwind"],
  uiLibrary: [],
  backend: "none",
  database: "none",
  baas: [],
  testing: [],
  linting: ["eslint", "prettier"],
  stateManagement: [],
  animation: [],
  dataViz: [],
  tooling: [],
  versions: {},
}

export function DevsRecipe() {
  const [currentView, setCurrentView] = useState<"home" | "builder">("home")
  const [currentStep, setCurrentStep] = useState(1)
  const [config, setConfig] = useState<ProjectConfig>(defaultConfig)
  const [folders, setFolders] = useState<FolderNode[]>(defaultFolders)
  const builderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const { config: savedConfig, folders: savedFolders, step } = JSON.parse(saved)
        if (savedConfig) setConfig(savedConfig)
        if (savedFolders) setFolders(savedFolders)
        if (step) setCurrentStep(step)
      } catch (e) {
        console.error("Failed to load saved progress")
      }
    }
  }, [])

  useEffect(() => {
    if (currentView === "builder") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          config,
          folders,
          step: currentStep,
        }),
      )
    }
  }, [config, folders, currentStep, currentView])

  const script = generateBashScript(config, folders)

  const handleDownload = () => {
    trackProjectGenerated()
    const blob = new Blob([script], { type: "text/x-sh" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${config.projectName}-setup.sh`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleStartBuilding = () => {
    setCurrentView("builder")
    setCurrentStep(1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBackToHome = () => {
    setCurrentView("home")
    localStorage.removeItem(STORAGE_KEY)
    setConfig(defaultConfig)
    setFolders(defaultFolders)
    setCurrentStep(1)
  }

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((s) => s + 1)
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1)
    }
  }

  useKeyboardShortcuts({
    onNext: currentView === "builder" ? goToNextStep : undefined,
    onPrevious: currentView === "builder" ? goToPreviousStep : undefined,
    onDownload: currentView === "builder" && currentStep === 3 ? handleDownload : undefined,
    onExit: currentView === "builder" ? handleBackToHome : undefined,
  })

  // Determine which version selectors to show
  const showNodeVersion = ["react", "next", "vue", "nuxt", "svelte", "sveltekit", "angular"].includes(config.frontend)
  const showReactVersion = ["react", "next"].includes(config.frontend)
  const showPythonVersion = ["flask", "fastapi", "django"].includes(config.backend)
  const showJavaVersion = ["spring", "quarkus"].includes(config.backend)

  const steps = [
    { number: 1, title: "Stack & Config", description: "Choose your technologies" },
    { number: 2, title: "Structure", description: "Organize folders & files" },
    { number: 3, title: "Generate", description: "Preview & download" },
  ]

  if (currentView === "builder") {
    return (
      <div
        ref={builderRef}
        className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 pt-20"
      >
        {/* Step Indicator */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                <Keyboard className="w-3 h-3 inline mr-1" />
                Press ? for shortcuts
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToHome}
              className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Exit Builder
            </Button>
          </div>
          <StepIndicator steps={steps} currentStep={currentStep} />
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          {currentStep === 3 ? (
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Ready to Generate!</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Your project configuration is complete. Review the script on the right and download when ready.
                </p>
                <div className="space-y-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                    <h3 className="font-medium text-emerald-800 dark:text-emerald-300 mb-2">Project Summary</h3>
                    <ul className="text-sm text-emerald-700 dark:text-emerald-400 space-y-1">
                      <li>
                        - Project: <span className="font-mono">{config.projectName}</span>
                      </li>
                      <li>
                        - Frontend: {config.frontend} ({config.variant.toUpperCase()})
                      </li>
                      <li>- Styling: {config.styling.join(", ") || "None"}</li>
                      <li>- UI Libraries: {config.uiLibrary.join(", ") || "None"}</li>
                      <li>- Backend: {config.backend}</li>
                      <li>- Database: {config.database}</li>
                      <li>- State Management: {config.stateManagement.join(", ") || "None"}</li>
                      <li>- Services: {config.baas.join(", ") || "None"}</li>
                    </ul>
                  </div>
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Setup Script
                  </Button>
                </div>
              </div>
              <div>
                <ScriptPreview script={script} projectName={config.projectName} />
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              {currentStep === 1 && (
                <>
                  <StackSelector config={config} setConfig={setConfig} />
                  <VersionSelector
                    versions={config.versions}
                    setVersions={(versions) => setConfig((prev) => ({ ...prev, versions }))}
                    showNode={showNodeVersion}
                    showReact={showReactVersion}
                    showPython={showPythonVersion}
                    showJava={showJavaVersion}
                  />
                </>
              )}
              {currentStep === 2 && <FolderStructure folders={folders} setFolders={setFolders} config={config} />}
            </div>
          )}
        </main>

        {/* Navigation - Only in builder */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-700 p-4 z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Button
              variant="outline"
              onClick={goToPreviousStep}
              disabled={currentStep === 1}
              className="text-slate-600 dark:text-slate-300 bg-transparent"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-slate-500 dark:text-slate-400">Step {currentStep} of 3</span>
            {currentStep < 3 ? (
              <Button
                onClick={goToNextStep}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <HeroSection onStartBuilding={handleStartBuilding} />

      {/* Quick Templates Section */}
      <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <QuickTemplates />
        </div>
      </section>
    </div>
  )
}
