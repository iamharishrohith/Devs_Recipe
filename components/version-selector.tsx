"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VersionSelectorProps {
  versions: {
    node?: string
    react?: string
    python?: string
    java?: string
  }
  setVersions: (versions: VersionSelectorProps["versions"]) => void
  showNode?: boolean
  showReact?: boolean
  showPython?: boolean
  showJava?: boolean
}

const nodeVersions = ["20.x (LTS)", "18.x (LTS)", "22.x (Latest)", "16.x"]
const reactVersions = ["18.x (Latest)", "17.x", "16.x"]
const pythonVersions = ["3.12 (Latest)", "3.11", "3.10", "3.9"]
const javaVersions = ["21 (LTS)", "17 (LTS)", "11 (LTS)", "8"]

export function VersionSelector({
  versions,
  setVersions,
  showNode,
  showReact,
  showPython,
  showJava,
}: VersionSelectorProps) {
  const updateVersion = (key: keyof typeof versions, value: string) => {
    setVersions({ ...versions, [key]: value })
  }

  const hasAnyOption = showNode || showReact || showPython || showJava

  if (!hasAnyOption) return null

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 mt-4">
      <h4 className="font-medium text-slate-900 dark:text-white mb-3">Version Selection (Optional)</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {showNode && (
          <div>
            <Label className="text-xs text-slate-500">Node.js</Label>
            <Select value={versions.node || ""} onValueChange={(v) => updateVersion("node", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Latest" />
              </SelectTrigger>
              <SelectContent>
                {nodeVersions.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showReact && (
          <div>
            <Label className="text-xs text-slate-500">React</Label>
            <Select value={versions.react || ""} onValueChange={(v) => updateVersion("react", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Latest" />
              </SelectTrigger>
              <SelectContent>
                {reactVersions.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showPython && (
          <div>
            <Label className="text-xs text-slate-500">Python</Label>
            <Select value={versions.python || ""} onValueChange={(v) => updateVersion("python", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Latest" />
              </SelectTrigger>
              <SelectContent>
                {pythonVersions.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {showJava && (
          <div>
            <Label className="text-xs text-slate-500">Java</Label>
            <Select value={versions.java || ""} onValueChange={(v) => updateVersion("java", v)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Latest LTS" />
              </SelectTrigger>
              <SelectContent>
                {javaVersions.map((v) => (
                  <SelectItem key={v} value={v}>
                    {v}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </div>
  )
}
