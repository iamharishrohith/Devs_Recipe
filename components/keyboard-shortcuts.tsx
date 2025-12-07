"use client"

import { useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Kbd } from "@/components/ui/kbd"

interface KeyboardShortcutsProps {
  isOpen: boolean
  onClose: () => void
}

interface ShortcutHandler {
  onNext?: () => void
  onPrevious?: () => void
  onDownload?: () => void
  onExit?: () => void
}

export function useKeyboardShortcuts({ onNext, onPrevious, onDownload, onExit }: ShortcutHandler) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Cmd/Ctrl + Enter for next step
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault()
        onNext?.()
      }
      // Cmd/Ctrl + Backspace for previous step
      if ((e.metaKey || e.ctrlKey) && e.key === "Backspace") {
        e.preventDefault()
        onPrevious?.()
      }
      // Cmd/Ctrl + D for download
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault()
        onDownload?.()
      }
      // Escape to exit
      if (e.key === "Escape") {
        onExit?.()
      }
    },
    [onNext, onPrevious, onDownload, onExit],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}

export function KeyboardShortcutsDialog({ isOpen, onClose }: KeyboardShortcutsProps) {
  const shortcuts = [
    { keys: ["⌘/Ctrl", "Enter"], description: "Go to next step" },
    { keys: ["⌘/Ctrl", "Backspace"], description: "Go to previous step" },
    { keys: ["⌘/Ctrl", "D"], description: "Download script" },
    { keys: ["Esc"], description: "Exit builder" },
    { keys: ["?"], description: "Show shortcuts" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-white">Keyboard Shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 mt-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-400">{shortcut.description}</span>
              <div className="flex gap-1">
                {shortcut.keys.map((key, i) => (
                  <Kbd key={i}>{key}</Kbd>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
