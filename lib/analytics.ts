interface AnalyticsData {
  templateDownloads: Record<string, number>
  librarySelections: Record<string, number>
  projectsGenerated: number
}

const STORAGE_KEY = "devs-recipe-analytics"

export function getAnalytics(): AnalyticsData {
  if (typeof window === "undefined") {
    return { templateDownloads: {}, librarySelections: {}, projectsGenerated: 0 }
  }
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored) {
    return JSON.parse(stored)
  }
  return { templateDownloads: {}, librarySelections: {}, projectsGenerated: 0 }
}

export function trackTemplateDownload(templateId: string) {
  const analytics = getAnalytics()
  analytics.templateDownloads[templateId] = (analytics.templateDownloads[templateId] || 0) + 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics))
}

export function trackLibrarySelection(libraryId: string) {
  const analytics = getAnalytics()
  analytics.librarySelections[libraryId] = (analytics.librarySelections[libraryId] || 0) + 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics))
}

export function trackProjectGenerated() {
  const analytics = getAnalytics()
  analytics.projectsGenerated += 1
  localStorage.setItem(STORAGE_KEY, JSON.stringify(analytics))
}

export function getPopularTemplates(): string[] {
  const analytics = getAnalytics()
  return Object.entries(analytics.templateDownloads)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id]) => id)
}

export function getPopularLibraries(): string[] {
  const analytics = getAnalytics()
  return Object.entries(analytics.librarySelections)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([id]) => id)
}
