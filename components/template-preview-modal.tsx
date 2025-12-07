"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Folder, FileCode, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface TemplatePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  template: {
    id: string
    name: string
    description: string
    script: string
    structure?: FolderItem[]
  } | null
  onDownload: () => void
}

interface FolderItem {
  name: string
  type: "folder" | "file"
  children?: FolderItem[]
}

// Parse script to extract folder structure
function parseScriptToStructure(script: string): FolderItem[] {
  const lines = script.split("\n")
  const structure: FolderItem[] = []

  // Look for mkdir commands
  const mkdirPattern = /mkdir\s+(-p\s+)?([^\s&|;]+)/g
  const touchPattern = /touch\s+([^\s&|;]+)/g

  const folders = new Set<string>()
  const files = new Set<string>()

  lines.forEach((line) => {
    let match
    while ((match = mkdirPattern.exec(line)) !== null) {
      folders.add(match[2])
    }
    while ((match = touchPattern.exec(line)) !== null) {
      files.add(match[1])
    }
  })

  // Create common structure based on project type
  if (script.includes("create-next-app")) {
    return [
      {
        name: "app",
        type: "folder",
        children: [
          { name: "page.tsx", type: "file" },
          { name: "layout.tsx", type: "file" },
          { name: "globals.css", type: "file" },
        ],
      },
      { name: "components", type: "folder", children: [{ name: "ui", type: "folder", children: [] }] },
      { name: "lib", type: "folder", children: [{ name: "utils.ts", type: "file" }] },
      { name: "public", type: "folder", children: [] },
      { name: "package.json", type: "file" },
      { name: "tsconfig.json", type: "file" },
      { name: "tailwind.config.ts", type: "file" },
    ]
  }

  if (script.includes("create vite")) {
    return [
      {
        name: "src",
        type: "folder",
        children: [
          { name: "App.tsx", type: "file" },
          { name: "main.tsx", type: "file" },
          { name: "index.css", type: "file" },
        ],
      },
      { name: "public", type: "folder", children: [] },
      { name: "package.json", type: "file" },
      { name: "vite.config.ts", type: "file" },
    ]
  }

  if (script.includes("fastapi") || script.includes("flask")) {
    return [
      {
        name: "app",
        type: "folder",
        children: [
          { name: "__init__.py", type: "file" },
          { name: "main.py", type: "file" },
          { name: "routes.py", type: "file" },
        ],
      },
      { name: "tests", type: "folder", children: [] },
      { name: "requirements.txt", type: "file" },
      { name: ".env", type: "file" },
    ]
  }

  if (script.includes("django")) {
    return [
      {
        name: "backend",
        type: "folder",
        children: [
          { name: "settings.py", type: "file" },
          { name: "urls.py", type: "file" },
          { name: "wsgi.py", type: "file" },
        ],
      },
      {
        name: "api",
        type: "folder",
        children: [
          { name: "views.py", type: "file" },
          { name: "models.py", type: "file" },
        ],
      },
      { name: "manage.py", type: "file" },
    ]
  }

  // Default structure
  return [
    { name: "src", type: "folder", children: [{ name: "index.ts", type: "file" }] },
    { name: "package.json", type: "file" },
  ]
}

function FolderTree({ items, depth = 0 }: { items: FolderItem[]; depth?: number }) {
  return (
    <div className={cn("space-y-1", depth > 0 && "ml-4 border-l border-slate-200 dark:border-slate-700 pl-3")}>
      {items.map((item, index) => (
        <div key={`${item.name}-${index}`}>
          <div className="flex items-center gap-2 py-1 text-sm">
            {item.type === "folder" ? (
              <>
                <Folder className="w-4 h-4 text-emerald-500" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">{item.name}</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </>
            ) : (
              <>
                <FileCode className="w-4 h-4 text-slate-400" />
                <span className="text-slate-600 dark:text-slate-400">{item.name}</span>
              </>
            )}
          </div>
          {item.children && item.children.length > 0 && <FolderTree items={item.children} depth={depth + 1} />}
        </div>
      ))}
    </div>
  )
}

export function TemplatePreviewModal({ isOpen, onClose, template, onDownload }: TemplatePreviewModalProps) {
  if (!template) return null

  const structure = template.structure || parseScriptToStructure(template.script)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900 dark:text-white">{template.name}</DialogTitle>
          <p className="text-sm text-slate-600 dark:text-slate-400">{template.description}</p>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {/* Folder Structure */}
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 max-h-[400px] overflow-auto">
            <h4 className="font-medium text-slate-900 dark:text-white mb-3 flex items-center gap-2">
              <Folder className="w-4 h-4 text-emerald-500" />
              Project Structure
            </h4>
            <FolderTree items={structure} />
          </div>

          {/* Script Preview */}
          <div className="bg-slate-900 rounded-xl p-4 max-h-[400px] overflow-auto">
            <h4 className="font-medium text-slate-300 mb-3">Setup Script</h4>
            <pre className="text-xs text-slate-400 font-mono whitespace-pre-wrap">
              {template.script.slice(0, 500)}...
            </pre>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onDownload}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Script
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
