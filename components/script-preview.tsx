"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, Copy, Terminal, Apple, Monitor, Laptop } from "lucide-react"
import { cn } from "@/lib/utils"

interface ScriptPreviewProps {
  script: string
  projectName: string
}

type OSType = "mac" | "windows" | "linux"

export function ScriptPreview({ script, projectName }: ScriptPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [selectedOS, setSelectedOS] = useState<OSType>("mac")

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const osInstructions: Record<OSType, { command: string; steps: string[] }> = {
    mac: {
      command: `chmod +x ${projectName}-setup.sh && ./${projectName}-setup.sh`,
      steps: [
        'Open Terminal (Cmd + Space, type "Terminal")',
        "Navigate to download folder: cd ~/Downloads",
        "Make script executable and run the command above",
      ],
    },
    windows: {
      command: `bash ${projectName}-setup.sh`,
      steps: [
        "Install Git Bash or WSL if not already installed",
        "Open Git Bash or WSL terminal",
        "Navigate to download folder and run the command above",
      ],
    },
    linux: {
      command: `chmod +x ${projectName}-setup.sh && ./${projectName}-setup.sh`,
      steps: [
        "Open your terminal (Ctrl + Alt + T)",
        "Navigate to download folder: cd ~/Downloads",
        "Make script executable and run the command above",
      ],
    },
  }

  // Syntax highlighting for bash
  const highlightedScript = script.split("\n").map((line, i) => {
    // Comments
    if (line.trim().startsWith("#")) {
      return (
        <span key={i} className="text-slate-500">
          {line}
        </span>
      )
    }

    // Echo statements
    if (line.includes("echo")) {
      const parts = line.split(/(echo\s+)/)
      const highlighted = parts.map((part, j) => {
        if (part.startsWith("echo")) {
          return (
            <span key={j} className="text-amber-600">
              {part}
            </span>
          )
        }
        if (part.startsWith('"') || part.startsWith("'")) {
          return (
            <span key={j} className="text-emerald-600">
              {part}
            </span>
          )
        }
        return part
      })
      return <span key={i}>{highlighted}</span>
    }

    // Commands
    const commands = ["mkdir", "cd", "npm", "npx", "pip", "python", "touch", "cat", "git", "chmod"]
    for (const cmd of commands) {
      if (line.trim().startsWith(cmd)) {
        const regex = new RegExp(`^(\\s*)(${cmd})(.*)$`)
        const match = line.match(regex)
        if (match) {
          return (
            <span key={i}>
              {match[1]}
              <span className="text-sky-600 font-semibold">{match[2]}</span>
              <span className="text-slate-700">{match[3]}</span>
            </span>
          )
        }
      }
    }

    return <span key={i}>{line}</span>
  })

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      {/* Terminal Header */}
      <div className="bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <div className="w-3 h-3 rounded-full bg-emerald-400" />
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <Terminal className="w-4 h-4" />
            <span className="font-mono">{projectName}-setup.sh</span>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Terminal Content */}
      <div className="bg-slate-950 p-4 overflow-auto max-h-[400px]">
        <pre className="font-mono text-sm leading-relaxed">
          <code className="text-slate-300">
            {highlightedScript.map((line, i) => (
              <div key={i} className="hover:bg-slate-900/50 px-2 -mx-2 rounded">
                <span className="text-slate-600 select-none mr-4 inline-block w-6 text-right">{i + 1}</span>
                {line}
              </div>
            ))}
          </code>
        </pre>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900">
        <h4 className="font-medium text-slate-900 dark:text-white mb-3">How to Run</h4>

        {/* OS Tabs */}
        <div className="flex gap-2 mb-3">
          <Button
            variant={selectedOS === "mac" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedOS("mac")}
            className={cn(selectedOS === "mac" && "bg-emerald-500 hover:bg-emerald-600")}
          >
            <Apple className="w-4 h-4 mr-1" />
            macOS
          </Button>
          <Button
            variant={selectedOS === "windows" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedOS("windows")}
            className={cn(selectedOS === "windows" && "bg-emerald-500 hover:bg-emerald-600")}
          >
            <Monitor className="w-4 h-4 mr-1" />
            Windows
          </Button>
          <Button
            variant={selectedOS === "linux" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedOS("linux")}
            className={cn(selectedOS === "linux" && "bg-emerald-500 hover:bg-emerald-600")}
          >
            <Laptop className="w-4 h-4 mr-1" />
            Linux
          </Button>
        </div>

        {/* Instructions */}
        <div className="space-y-2">
          <ol className="list-decimal list-inside text-sm text-slate-600 dark:text-slate-400 space-y-1">
            {osInstructions[selectedOS].steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>

          {/* Copyable command */}
          <div className="mt-3 bg-slate-900 rounded-lg p-3 flex items-center justify-between">
            <code className="text-sm text-emerald-400 font-mono">{osInstructions[selectedOS].command}</code>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(osInstructions[selectedOS].command)
              }}
              className="text-slate-400 hover:text-white"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-4 py-2">
        <p className="text-xs text-slate-500 dark:text-slate-500">
          {script.split("\n").length} lines • Ready to download
        </p>
      </div>
    </div>
  )
}
