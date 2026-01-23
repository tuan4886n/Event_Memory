"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Sparkles, Heart, Moon } from "lucide-react"
import { cn } from "../lib/utils"

type Theme = "elegant" | "vibrant" | "moody"

const themes: { id: Theme; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "elegant",
    label: "Elegant",
    icon: <Heart className="h-4 w-4" />,
    description: "Trắng & Vàng Gold",
  },
  {
    id: "vibrant",
    label: "Vibrant",
    icon: <Sparkles className="h-4 w-4" />,
    description: "Gradient rực rỡ",
  },
  {
    id: "moody",
    label: "Moody",
    icon: <Moon className="h-4 w-4" />,
    description: "Tông màu trầm",
  },
]

interface ThemeSwitcherProps {
  onThemeChange?: (theme: Theme) => void
}

export function ThemeSwitcher({ onThemeChange }: ThemeSwitcherProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>("elegant")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Apply theme class to body
    document.body.classList.remove("theme-elegant", "theme-vibrant", "theme-moody")
    document.body.classList.add(`theme-${currentTheme}`)
    onThemeChange?.(currentTheme)
  }, [currentTheme, onThemeChange])

  const currentThemeData = themes.find((t) => t.id === currentTheme)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-full",
          "bg-card/80 backdrop-blur-sm border border-border",
          "hover:bg-secondary transition-all duration-200",
          "text-sm font-medium text-foreground"
        )}
      >
        {currentThemeData?.icon}
        <span className="hidden sm:inline">{currentThemeData?.label}</span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div
            className={cn(
              "absolute right-0 top-full mt-2 z-50",
              "w-48 p-2 rounded-xl",
              "bg-card/95 backdrop-blur-md border border-border",
              "shadow-xl"
            )}
          >
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => {
                  setCurrentTheme(theme.id)
                  setIsOpen(false)
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg",
                  "transition-all duration-200",
                  currentTheme === theme.id
                    ? "bg-primary/20 text-primary"
                    : "hover:bg-secondary text-foreground"
                )}
              >
                <span className={cn(
                  "p-1.5 rounded-full",
                  currentTheme === theme.id ? "bg-primary/20" : "bg-muted"
                )}>
                  {theme.icon}
                </span>
                <div className="text-left">
                  <div className="text-sm font-medium">{theme.label}</div>
                  <div className="text-xs text-muted-foreground">{theme.description}</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
