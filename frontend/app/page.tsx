"use client"

import { useState } from "react"
import { EventHeader } from "@/components/event-header"
import { PhotoGrid } from "@/components/photo-grid"
import { UploadButton } from "@/components/upload-button"
import { WishesSection } from "@/components/wishes-section"
import { cn } from "../lib/utils"

export default function EventGalleryPage() {
  const [currentTheme, setCurrentTheme] = useState<string>("elegant")

  const getEventInfo = () => {
    switch (currentTheme) {
      case "elegant":
        return {
          name: "Minh & Hương",
          date: "20.02.2026 • Hà Nội",
        }
      case "vibrant":
        return {
          name: "Happy Birthday Minh",
          date: "15.01.2026 • TP. Hồ Chí Minh",
        }
      case "moody":
        return {
          name: "Kỷ Niệm Một Năm",
          date: "10.12.2025 • Đà Nẵng",
        }
      default:
        return {
          name: "Our Special Event",
          date: "2026",
        }
    }
  }

  const eventInfo = getEventInfo()

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <EventHeader
        eventName={eventInfo.name}
        eventDate={eventInfo.date}
        onThemeChange={setCurrentTheme}
      />

      {/* Hero Section */}
      <section className="relative py-8 sm:py-12 px-4 overflow-hidden">
        <div
          className={cn(
            "absolute inset-0 opacity-30",
            "bg-[radial-gradient(ellipse_at_top,var(--gradient-start)_0%,transparent_50%)]"
          )}
        />
        <div className="relative container mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3">
            {currentTheme === "elegant" && "Chào mừng đến với đám cưới của chúng tôi"}
            {currentTheme === "vibrant" && "Let's Celebrate Together! 🎉"}
            {currentTheme === "moody" && "Những khoảnh khắc đáng nhớ"}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            {currentTheme === "elegant" && "Hãy chia sẻ những khoảnh khắc đáng nhớ và gửi lời chúc phúc đến cặp đôi"}
            {currentTheme === "vibrant" && "Upload ảnh, chia sẻ niềm vui và cùng tạo nên những kỷ niệm tuyệt vời"}
            {currentTheme === "moody" && "Lưu giữ mọi cảm xúc, mọi khoảnh khắc trong không gian riêng"}
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">128</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Ảnh đã chia sẻ</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">56</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Lời chúc</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">89</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Khách tham dự</p>
            </div>
          </div>
        </div>
      </section>

      {/* Photo Grid */}
      <section className="pb-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="font-serif text-lg sm:text-xl font-semibold text-foreground">
              Thư viện ảnh
            </h3>
            <span className="text-sm text-muted-foreground">
              Mới nhất
            </span>
          </div>
          <PhotoGrid />
        </div>
      </section>

      {/* Wishes Section */}
      <WishesSection />

      {/* Floating Upload Button */}
      <UploadButton />

      {/* Bottom safe area for mobile */}
      <div className="h-24" />
    </main>
  )
}
