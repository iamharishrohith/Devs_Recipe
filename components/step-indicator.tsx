"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  number: number
  title: string
  description: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300",
                currentStep > step.number
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                  : currentStep === step.number
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-100"
                    : "bg-slate-100 text-slate-400",
              )}
            >
              {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
            </div>
            <div className="mt-2 text-center">
              <p
                className={cn("text-sm font-medium", currentStep >= step.number ? "text-slate-900" : "text-slate-400")}
              >
                {step.title}
              </p>
              <p className="text-xs text-slate-500 hidden sm:block">{step.description}</p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-16 sm:w-24 h-0.5 mx-2 sm:mx-4 transition-colors duration-300",
                currentStep > step.number ? "bg-emerald-500" : "bg-slate-200",
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
