"use client"

import { ThemeSwitcher } from "@/components/theme-switcher"
import { Camera } from "lucide-react"

interface EventHeaderProps {
  eventName: string
  eventDate: string
  onThemeChange?: (theme: string) => void
}

export function EventHeader({ eventName, eventDate, onThemeChange }: EventHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 w-full"
      style={{ background: "var(--header-bg)" }}
    >
      <div className="backdrop-blur-md border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo & Event Info */}
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-xl"
                style={{ background: "var(--fab-bg)" }}
              >
                <Camera className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-serif text-lg sm:text-xl font-semibold text-foreground leading-tight">
                  {eventName}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">{eventDate}</p>
              </div>
            </div>

            {/* Theme Switcher */}
            <ThemeSwitcher onThemeChange={onThemeChange} />
          </div>
        </div>
      </div>
    </header>
  )
}
