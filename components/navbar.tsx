"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Menu, BookOpen, Info, Mail, Keyboard } from "lucide-react"
import { KeyboardShortcutsDialog } from "./keyboard-shortcuts"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "?" && !e.metaKey && !e.ctrlKey) {
        setShowShortcuts(true)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const navLinks = [
    { href: "/tutorials", label: "Tutorials", icon: BookOpen },
    { href: "/about", label: "About Us", icon: Info },
    { href: "/contact", label: "Contact", icon: Mail },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-white/90 via-emerald-50/80 to-white/90 backdrop-blur-xl border-b border-emerald-200/50 shadow-lg shadow-emerald-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/30">
                <Image
                  src="/devs-recipe-logo.png"
                  alt="Devs Recipe Logo"
                  width={56}
                  height={56}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                Devs Recipe
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button variant="ghost" className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/80">
                    <link.icon className="w-4 h-4 mr-2" />
                    {link.label}
                  </Button>
                </Link>
              ))}

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowShortcuts(true)}
                className="text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/80"
              >
                <Keyboard className="w-5 h-5" />
              </Button>
            </nav>

            <div className="flex items-center gap-2 lg:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-slate-700">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-72 bg-white/95 backdrop-blur-xl">
                  {/* Accessibility Fix: Added Title and Description for Screen Readers */}
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    Mobile navigation links for Devs Recipe
                  </SheetDescription>

                  <div className="flex flex-col gap-4 mt-8">
                    {navLinks.map((link) => (
                      <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                        >
                          <link.icon className="w-4 h-4 mr-2" />
                          {link.label}
                        </Button>
                      </Link>
                    ))}
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-slate-600 hover:text-emerald-600 hover:bg-emerald-50"
                      onClick={() => {
                        setIsOpen(false)
                        setShowShortcuts(true)
                      }}
                    >
                      <Keyboard className="w-4 h-4 mr-2" />
                      Keyboard Shortcuts
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <KeyboardShortcutsDialog isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
    </>
  )
}