"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import type { FolderNode, ProjectConfig } from "@/lib/types"
import { Folder, FolderOpen, File, Plus, Trash2, ChevronRight, ChevronDown, FolderPlus, FilePlus } from "lucide-react"

interface FolderStructureProps {
  folders: FolderNode[]
  setFolders: React.Dispatch<React.SetStateAction<FolderNode[]>>
  config: ProjectConfig
}

function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

function MindMapNode({
  node,
  onAddChild,
  onDelete,
  level = 0,
  isLast = false,
}: {
  node: FolderNode
  onAddChild: (parentId: string, type: "folder" | "file", name: string) => void
  onDelete: (id: string) => void
  level?: number
  isLast?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [isAddingChild, setIsAddingChild] = useState<"folder" | "file" | null>(null)
  const [newName, setNewName] = useState("")

  const handleAdd = () => {
    if (newName.trim() && isAddingChild) {
      onAddChild(node.id, isAddingChild, newName.trim())
      setNewName("")
      setIsAddingChild(null)
    }
  }

  const hasChildren = node.type === "folder" && node.children && node.children.length > 0

  return (
    <div className="relative">
      {/* Connection lines for mind map effect */}
      {level > 0 && (
        <>
          <div className="absolute left-[-20px] top-[20px] w-5 h-0.5 bg-slate-300" style={{ zIndex: 0 }} />
          {!isLast && (
            <div className="absolute left-[-20px] top-[20px] w-0.5 h-full bg-slate-300" style={{ zIndex: 0 }} />
          )}
        </>
      )}

      <div className="relative z-10">
        {/* Node */}
        <div
          className={cn(
            "group flex items-center gap-2 px-3 py-2 rounded-lg transition-all",
            "hover:bg-slate-100 cursor-pointer",
            node.type === "folder" ? "bg-white border border-slate-200 shadow-sm" : "bg-slate-50",
          )}
        >
          {node.type === "folder" && hasChildren && (
            <button onClick={() => setIsExpanded(!isExpanded)} className="text-slate-400 hover:text-slate-600">
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
          {node.type === "folder" && !hasChildren && <span className="w-4" />}

          {node.type === "folder" ? (
            isExpanded ? (
              <FolderOpen className="w-5 h-5 text-amber-500" />
            ) : (
              <Folder className="w-5 h-5 text-amber-500" />
            )
          ) : (
            <File className="w-4 h-4 text-slate-400 ml-4" />
          )}

          <span
            className={cn(
              "font-medium text-sm",
              node.type === "folder" ? "text-slate-900" : "text-slate-600 font-mono text-xs",
            )}
          >
            {node.name}
          </span>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {node.type === "folder" && (
              <>
                <Dialog open={isAddingChild === "folder"} onOpenChange={(open) => !open && setIsAddingChild(null)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsAddingChild("folder")}>
                      <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Folder to {node.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="folder-name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        className="font-mono"
                      />
                      <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Add
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Dialog open={isAddingChild === "file"} onOpenChange={(open) => !open && setIsAddingChild(null)}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsAddingChild("file")}>
                      <FilePlus className="w-3.5 h-3.5 text-slate-500" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add File to {node.name}</DialogTitle>
                    </DialogHeader>
                    <div className="flex gap-2 mt-4">
                      <Input
                        placeholder="filename.tsx"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                        className="font-mono"
                      />
                      <Button onClick={handleAdd} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        Add
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => onDelete(node.id)}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Children */}
        {node.type === "folder" && isExpanded && node.children && node.children.length > 0 && (
          <div className="ml-6 mt-2 space-y-2 relative">
            {/* Vertical connector line */}
            <div className="absolute left-[-20px] top-0 w-0.5 bg-slate-300" style={{ height: "calc(100% - 20px)" }} />
            {node.children.map((child, index) => (
              <MindMapNode
                key={child.id}
                node={child}
                onAddChild={onAddChild}
                onDelete={onDelete}
                level={level + 1}
                isLast={index === node.children!.length - 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export function FolderStructure({ folders, setFolders, config }: FolderStructureProps) {
  const [newFolderName, setNewFolderName] = useState("")
  const [isAddingRoot, setIsAddingRoot] = useState(false)
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([])

  const addChildToNode = (
    nodes: FolderNode[],
    parentId: string,
    type: "folder" | "file",
    name: string,
  ): FolderNode[] => {
    return nodes.map((node) => {
      if (node.id === parentId && node.type === "folder") {
        return {
          ...node,
          children: [
            ...(node.children || []),
            {
              id: generateId(),
              name,
              type,
              children: type === "folder" ? [] : undefined,
            },
          ],
        }
      }
      if (node.children) {
        return {
          ...node,
          children: addChildToNode(node.children, parentId, type, name),
        }
      }
      return node
    })
  }

  const deleteNode = (nodes: FolderNode[], targetId: string): FolderNode[] => {
    return nodes
      .filter((node) => node.id !== targetId)
      .map((node) => ({
        ...node,
        children: node.children ? deleteNode(node.children, targetId) : undefined,
      }))
  }

  const handleAddChild = (parentId: string, type: "folder" | "file", name: string) => {
    setFolders((prev) => addChildToNode(prev, parentId, type, name))
  }

  const handleDelete = (id: string) => {
    setFolders((prev) => deleteNode(prev, id))
  }

  const handleAddRootFolder = () => {
    if (newFolderName.trim()) {
      setFolders((prev) => [
        ...prev,
        {
          id: generateId(),
          name: newFolderName.trim(),
          type: "folder",
          children: [],
        },
      ])
      setNewFolderName("")
      setIsAddingRoot(false)
    }
  }

  const quickTemplates = [
    {
      id: "react-standard",
      name: "React Standard",
      folders: ["components", "hooks", "utils", "styles", "assets", "types"],
    },
    { id: "feature-based", name: "Feature-based", folders: ["features", "shared", "config", "types", "services"] },
    {
      id: "clean-arch",
      name: "Clean Architecture",
      folders: ["domain", "application", "infrastructure", "presentation"],
    },
    {
      id: "nextjs-app",
      name: "Next.js App Router",
      folders: ["components", "lib", "hooks", "types", "styles", "actions"],
    },
    { id: "atomic", name: "Atomic Design", folders: ["atoms", "molecules", "organisms", "templates", "pages"] },
    { id: "ddd", name: "Domain-Driven", folders: ["modules", "shared", "core", "infra"] },
    { id: "mvc", name: "MVC Pattern", folders: ["models", "views", "controllers", "routes", "middleware"] },
    {
      id: "api-structure",
      name: "API Structure",
      folders: ["routes", "controllers", "services", "models", "middleware", "utils"],
    },
    { id: "monorepo", name: "Monorepo", folders: ["apps", "packages", "libs", "tools", "configs"] },
    { id: "fullstack", name: "Full-Stack", folders: ["client", "server", "shared", "types", "config"] },
  ]

  const toggleTemplate = (templateId: string) => {
    setSelectedTemplates((prev) =>
      prev.includes(templateId) ? prev.filter((t) => t !== templateId) : [...prev, templateId],
    )
  }

  const applySelectedTemplates = () => {
    const allFolders: string[] = []
    selectedTemplates.forEach((templateId) => {
      const template = quickTemplates.find((t) => t.id === templateId)
      if (template) {
        template.folders.forEach((folder) => {
          if (!allFolders.includes(folder)) {
            allFolders.push(folder)
          }
        })
      }
    })

    const newFolders: FolderNode[] = allFolders.map((name) => ({
      id: generateId(),
      name,
      type: "folder",
      children: [],
    }))

    setFolders([
      {
        id: "src",
        name: "src",
        type: "folder",
        children: newFolders,
      },
    ])
    setSelectedTemplates([])
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Folder Structure</h2>
          <p className="text-sm text-slate-500">Click on folders to add files and subfolders</p>
        </div>
        <Dialog open={isAddingRoot} onOpenChange={setIsAddingRoot}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Plus className="w-4 h-4" />
              Add Folder
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Root Folder</DialogTitle>
            </DialogHeader>
            <div className="flex gap-2 mt-4">
              <Input
                placeholder="folder-name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddRootFolder()}
                className="font-mono"
              />
              <Button onClick={handleAddRootFolder} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Add
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Project Root */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
          <Folder className="w-5 h-5 text-emerald-600" />
          <span className="font-mono font-semibold text-slate-900">{config.projectName}/</span>
        </div>

        {/* Mind Map Tree */}
        <div className="space-y-3 pl-2">
          {folders.length === 0 ? (
            <p className="text-sm text-slate-500 italic">
              No custom folders yet. Select templates or add one manually!
            </p>
          ) : (
            folders.map((folder, index) => (
              <MindMapNode
                key={folder.id}
                node={folder}
                onAddChild={handleAddChild}
                onDelete={handleDelete}
                isLast={index === folders.length - 1}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-slate-700">Quick Templates (multi-select)</h3>
          {selectedTemplates.length > 0 && (
            <Button
              size="sm"
              onClick={applySelectedTemplates}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
            >
              Apply {selectedTemplates.length} Template{selectedTemplates.length > 1 ? "s" : ""}
            </Button>
          )}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {quickTemplates.map((template) => (
            <label
              key={template.id}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-all text-xs bg-white",
                selectedTemplates.includes(template.id)
                  ? "border-emerald-500 bg-emerald-50"
                  : "border-slate-200 hover:border-slate-300",
              )}
            >
              <Checkbox
                checked={selectedTemplates.includes(template.id)}
                onCheckedChange={() => toggleTemplate(template.id)}
                className="h-3.5 w-3.5"
              />
              <span className="text-slate-700 font-medium truncate">{template.name}</span>
            </label>
          ))}
        </div>
        {selectedTemplates.length > 0 && (
          <p className="text-xs text-slate-500 mt-2">
            Folders to create:{" "}
            {selectedTemplates
              .flatMap((id) => quickTemplates.find((t) => t.id === id)?.folders || [])
              .filter((v, i, a) => a.indexOf(v) === i)
              .join(", ")}
          </p>
        )}
      </div>
    </div>
  )
}
