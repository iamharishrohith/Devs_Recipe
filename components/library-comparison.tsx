"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, X } from "lucide-react"

interface ComparisonLibrary {
  id: string
  name: string
  bundleSize: string
  stars: string
  weeklyDownloads: string
  features: string[]
  pros: string[]
  cons: string[]
}

const comparisons: Record<string, ComparisonLibrary[]> = {
  stateManagement: [
    {
      id: "zustand",
      name: "Zustand",
      bundleSize: "~1.5KB",
      stars: "40k+",
      weeklyDownloads: "3M+",
      features: ["Minimal API", "No providers", "TypeScript support", "Middleware"],
      pros: ["Tiny bundle", "Simple API", "No boilerplate"],
      cons: ["Less ecosystem", "No devtools by default"],
    },
    {
      id: "redux",
      name: "Redux Toolkit",
      bundleSize: "~12KB",
      stars: "60k+",
      weeklyDownloads: "8M+",
      features: ["Devtools", "Middleware", "RTK Query", "Immer built-in"],
      pros: ["Large ecosystem", "Great devtools", "Battle-tested"],
      cons: ["More boilerplate", "Learning curve"],
    },
    {
      id: "jotai",
      name: "Jotai",
      bundleSize: "~3KB",
      stars: "15k+",
      weeklyDownloads: "1M+",
      features: ["Atomic state", "No providers", "Derived atoms", "Async support"],
      pros: ["Primitive approach", "Flexible", "React Suspense"],
      cons: ["Smaller community", "Different paradigm"],
    },
  ],
  uiLibrary: [
    {
      id: "shadcn",
      name: "shadcn/ui",
      bundleSize: "Varies",
      stars: "55k+",
      weeklyDownloads: "N/A",
      features: ["Copy-paste", "Customizable", "Accessible", "Tailwind-based"],
      pros: ["Full ownership", "No dependency", "Beautiful design"],
      cons: ["Manual updates", "Setup required"],
    },
    {
      id: "mui",
      name: "Material UI",
      bundleSize: "~300KB",
      stars: "90k+",
      weeklyDownloads: "4M+",
      features: ["Theme system", "Icons", "Date pickers", "Data grid"],
      pros: ["Complete solution", "Enterprise ready", "Great docs"],
      cons: ["Large bundle", "Opinionated styling"],
    },
    {
      id: "chakra",
      name: "Chakra UI",
      bundleSize: "~100KB",
      stars: "35k+",
      weeklyDownloads: "500k+",
      features: ["Style props", "Dark mode", "Accessible", "Composable"],
      pros: ["Easy styling", "Good DX", "Accessible by default"],
      cons: ["Runtime CSS-in-JS", "Smaller ecosystem"],
    },
  ],
}

interface LibraryComparisonProps {
  isOpen: boolean
  onClose: () => void
  category: string
  onSelect: (id: string) => void
}

export function LibraryComparison({ isOpen, onClose, category, onSelect }: LibraryComparisonProps) {
  const libraries = comparisons[category] || []

  if (libraries.length === 0) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto bg-white dark:bg-slate-900">
        <DialogHeader>
          <DialogTitle className="text-xl text-slate-900 dark:text-white">Compare Libraries</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {libraries.map((lib) => (
            <div
              key={lib.id}
              className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 transition-colors cursor-pointer"
              onClick={() => {
                onSelect(lib.id)
                onClose()
              }}
            >
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">{lib.name}</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Bundle</span>
                  <span className="text-slate-700 dark:text-slate-300">{lib.bundleSize}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">GitHub Stars</span>
                  <span className="text-slate-700 dark:text-slate-300">{lib.stars}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Downloads/week</span>
                  <span className="text-slate-700 dark:text-slate-300">{lib.weeklyDownloads}</span>
                </div>
              </div>

              <div className="mt-3">
                <h4 className="text-xs font-medium text-slate-500 uppercase mb-1">Features</h4>
                <div className="flex flex-wrap gap-1">
                  {lib.features.slice(0, 3).map((f) => (
                    <Badge key={f} variant="secondary" className="text-xs">
                      {f}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div>
                  <h4 className="text-xs font-medium text-emerald-600 mb-1">Pros</h4>
                  {lib.pros.slice(0, 2).map((p) => (
                    <div key={p} className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <Check className="w-3 h-3 text-emerald-500" />
                      {p}
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-medium text-red-500 mb-1">Cons</h4>
                  {lib.cons.slice(0, 2).map((c) => (
                    <div key={c} className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                      <X className="w-3 h-3 text-red-400" />
                      {c}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
