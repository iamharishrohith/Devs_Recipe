export interface ProjectConfig {
  projectName: string
  frontend: string
  variant: string
  styling: string[]
  uiLibrary: string[]
  backend: string
  database: string
  baas: string[]
  testing: string[]
  linting: string[]
  stateManagement: string[]
  animation: string[]
  dataViz: string[]
  tooling: string[]
  versions: {
    node?: string
    react?: string
    python?: string
    java?: string
  }
}

export interface FolderNode {
  id: string
  name: string
  type: "folder" | "file"
  children?: FolderNode[]
}

export interface AnalyticsEvent {
  type: "template_download" | "library_selected" | "project_generated"
  data: Record<string, string | number>
  timestamp: Date
}

export interface LibraryComparison {
  id: string
  name: string
  bundleSize: string
  stars: string
  weeklyDownloads: string
  features: string[]
  pros: string[]
  cons: string[]
}
