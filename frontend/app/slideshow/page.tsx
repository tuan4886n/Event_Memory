"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Settings,
  Sparkles,
  Quote,
  ChevronLeft,
  ChevronRight,
  Maximize,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";

// ===========================================
// MOCK DATA - Replace with API calls later
// ===========================================
interface SlideData {
  id: string;
  imageUrl: string;
  wish?: {
    author: string;
    message: string;
  };
  aiCaption: string;
  uploadedAt: string;
}

const MOCK_SLIDES: SlideData[] = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=1920&h=1080&fit=crop",
    wish: {
      author: "Nguyen Van A",
      message: "Chuc mung hanh phuc tram nam! Mong hai ban luon yeu thuong va dong hanh cung nhau.",
    },
    aiCaption: "A beautiful wedding ceremony with the couple exchanging vows under a flower-decorated arch",
    uploadedAt: "2024-01-15T10:30:00Z",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1920&h=1080&fit=crop",
    wish: {
      author: "Tran Thi B",
      message: "Hanh phuc mai mai ben nhau, xay dung to am am ap nhe!",
    },
    aiCaption: "Guests raising champagne glasses in celebration at an elegant reception",
    uploadedAt: "2024-01-15T11:00:00Z",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1920&h=1080&fit=crop",
    aiCaption: "A romantic sunset view with wedding decorations and warm golden lighting",
    uploadedAt: "2024-01-15T11:30:00Z",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1529634806980-85c3dd6d34ac?w=1920&h=1080&fit=crop",
    wish: {
      author: "Le Van C",
      message: "Mot chuong moi, mot hanh trinh moi. Chuc co dau chu re tram nam hanh phuc!",
    },
    aiCaption: "Wedding party dancing joyfully on the decorated dance floor",
    uploadedAt: "2024-01-15T12:00:00Z",
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=1920&h=1080&fit=crop",
    wish: {
      author: "Pham Thi D",
      message: "Love is not about how many days, months, or years you have been together. Love is about how much you love each other every single day.",
    },
    aiCaption: "Close-up of wedding rings placed on a bouquet of white roses",
    uploadedAt: "2024-01-15T12:30:00Z",
  },
];

// API placeholder functions - replace with real API calls
async function fetchSlides(): Promise<SlideData[]> {
  // TODO: Replace with actual API call
  // const response = await fetch('/api/slideshow/slides');
  // return response.json();
  return MOCK_SLIDES;
}

// ===========================================
// THEME CONFIGURATIONS
// ===========================================
type ThemeType = "elegant" | "vibrant" | "moody";

const THEME_CONFIG = {
  elegant: {
    name: "Elegant",
    description: "Trang nha - Dam cuoi",
    class: "theme-elegant slideshow-elegant",
    textColor: "text-amber-100",
    accentColor: "text-[#c9a961]",
    overlayGradient: "from-black/40 via-transparent to-black/60",
    captionBg: "bg-white/10 backdrop-blur-md border border-white/20",
    wishBg: "bg-gradient-to-r from-black/50 via-black/30 to-transparent",
  },
  vibrant: {
    name: "Vibrant",
    description: "Ruc ro - Tiec tung",
    class: "theme-vibrant slideshow-vibrant",
    textColor: "text-white",
    accentColor: "text-orange-300",
    overlayGradient: "from-purple-900/40 via-transparent to-orange-900/50",
    captionBg: "bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-md border border-white/20",
    wishBg: "bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-transparent",
  },
  moody: {
    name: "Moody",
    description: "Sau lang - Tam trang",
    class: "theme-moody slideshow-moody",
    textColor: "text-gray-100",
    accentColor: "text-violet-300",
    overlayGradient: "from-black/70 via-black/30 to-black/80",
    captionBg: "bg-black/40 backdrop-blur-md border border-white/10",
    wishBg: "bg-gradient-to-r from-black/80 via-black/50 to-transparent",
  },
};

// ===========================================
// MAIN COMPONENT
// ===========================================
export default function SlideshowPage() {
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [theme, setTheme] = useState<ThemeType>("elegant");
  const [interval, setIntervalTime] = useState(8000);
  const [showControls, setShowControls] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [slideKey, setSlideKey] = useState(0);

  const themeConfig = THEME_CONFIG[theme];

  // Fetch slides on mount
  useEffect(() => {
    fetchSlides().then(setSlides);
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval);

    return () => clearInterval(timer);
  }, [isPlaying, currentIndex, slides.length, interval]);

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    timeout = setTimeout(() => setShowControls(false), 3000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, []);

  const goToNext = useCallback(() => {
    if (slides.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
      setSlideKey((prev) => prev + 1);
      setIsTransitioning(false);
    }, 800);
  }, [slides.length]);

  const goToPrev = useCallback(() => {
    if (slides.length === 0) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setSlideKey((prev) => prev + 1);
      setIsTransitioning(false);
    }, 800);
  }, [slides.length]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          goToNext();
          break;
        case "ArrowLeft":
          goToPrev();
          break;
        case "p":
          setIsPlaying((prev) => !prev);
          break;
        case "f":
          toggleFullscreen();
          break;
        case "Escape":
          setShowControls(true);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToNext, goToPrev]);

  if (slides.length === 0) {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", themeConfig.class)}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Dang tai anh...</p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  return (
    <div className={cn("relative min-h-screen overflow-hidden bg-black", themeConfig.class)}>
      {/* Background Image with Ken Burns Effect */}
      <div
        key={slideKey}
        className={cn(
          "absolute inset-0 z-0",
          isTransitioning ? "slideshow-exit" : "slideshow-enter"
        )}
      >
        <div className="absolute inset-0 slideshow-zoom">
          <Image
            src={currentSlide.imageUrl || "/placeholder.svg"}
            alt="Slideshow image"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        {/* Theme-specific overlay gradient */}
        <div className={cn("absolute inset-0 bg-gradient-to-b", themeConfig.overlayGradient)} />
      </div>

      {/* Wish Overlay - Beautiful Typography */}
      {currentSlide.wish && (
        <div className={cn("absolute inset-0 z-10 flex items-center justify-center p-8 md:p-16")}>
          <div className={cn("max-w-4xl text-center", themeConfig.wishBg, "p-8 md:p-12 rounded-2xl")}>
            <Quote className={cn("w-12 h-12 md:w-16 md:h-16 mx-auto mb-6 opacity-60", themeConfig.accentColor)} />
            <p
              className={cn(
                "wish-text text-2xl md:text-4xl lg:text-5xl font-serif leading-relaxed mb-8 text-reveal",
                themeConfig.textColor
              )}
              style={{ fontStyle: "italic" }}
            >
              &ldquo;{currentSlide.wish.message}&rdquo;
            </p>
            <div className="text-reveal" style={{ animationDelay: "0.8s" }}>
              <p className={cn("text-lg md:text-xl tracking-widest uppercase", themeConfig.accentColor)}>
                - {currentSlide.wish.author} -
              </p>
            </div>
          </div>
        </div>
      )}

      {/* AI Caption - Corner Display */}
      <div
        className={cn(
          "absolute bottom-24 md:bottom-32 right-4 md:right-8 z-20 max-w-xs md:max-w-md caption-slide",
          themeConfig.captionBg,
          "rounded-xl p-4"
        )}
      >
        <div className="flex items-start gap-3">
          <div className={cn("p-2 rounded-lg bg-white/10", themeConfig.accentColor)}>
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className={cn("text-xs uppercase tracking-wider mb-1 opacity-70", themeConfig.accentColor)}>
              AI Caption
            </p>
            <p className={cn("text-sm leading-relaxed", themeConfig.textColor)}>
              {currentSlide.aiCaption}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
          style={{
            width: `${((currentIndex + 1) / slides.length) * 100}%`,
          }}
        />
      </div>

      {/* Slide Counter */}
      <div
        className={cn(
          "absolute bottom-6 left-1/2 -translate-x-1/2 z-30 transition-opacity duration-500",
          showControls ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(idx);
                  setSlideKey((prev) => prev + 1);
                  setIsTransitioning(false);
                }, 800);
              }}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                idx === currentIndex
                  ? "w-8 bg-primary"
                  : "bg-white/40 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={goToPrev}
        className={cn(
          "absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 transition-all duration-500 hover:bg-black/50",
          showControls ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        )}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-white" />
      </button>
      <button
        onClick={goToNext}
        className={cn(
          "absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/30 backdrop-blur-md border border-white/10 transition-all duration-500 hover:bg-black/50",
          showControls ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
        )}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-white" />
      </button>

      {/* Top Controls */}
      <div
        className={cn(
          "absolute top-0 left-0 right-0 z-30 p-4 md:p-6 transition-all duration-500",
          showControls ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
        )}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          {/* Event Title */}
          <div className="flex items-center gap-4">
            <h1 className={cn("text-xl md:text-2xl font-serif", themeConfig.textColor)}>
              Event Gallery
            </h1>
            <span className={cn("text-sm opacity-60", themeConfig.textColor)}>
              {currentIndex + 1} / {slides.length}
            </span>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:bg-white/10"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            {/* Skip Buttons */}
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrev}
              className="text-white hover:bg-white/10 hidden md:flex"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="text-white hover:bg-white/10 hidden md:flex"
            >
              <SkipForward className="w-5 h-5" />
            </Button>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
              className="text-white hover:bg-white/10"
            >
              <Maximize className="w-5 h-5" />
            </Button>

            {/* Settings Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                  <Settings className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Cai dat Slideshow</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Theme Selection */}
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Phong cach
                </DropdownMenuLabel>
                {(Object.keys(THEME_CONFIG) as ThemeType[]).map((key) => (
                  <DropdownMenuItem
                    key={key}
                    onClick={() => setTheme(key)}
                    className={cn(theme === key && "bg-accent")}
                  >
                    <div>
                      <p className="font-medium">{THEME_CONFIG[key].name}</p>
                      <p className="text-xs text-muted-foreground">
                        {THEME_CONFIG[key].description}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />

                {/* Interval Setting */}
                <div className="px-2 py-3">
                  <p className="text-sm font-medium mb-2">
                    Thoi gian chuyen ({interval / 1000}s)
                  </p>
                  <Slider
                    value={[interval]}
                    onValueChange={(value: number[]) => setIntervalTime(value[0])}
                    min={3000}
                    max={15000}
                    step={1000}
                    className="w-full"
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Keyboard Hints */}
      <div
        className={cn(
          "absolute bottom-6 left-6 z-30 transition-opacity duration-500",
          showControls ? "opacity-60" : "opacity-0"
        )}
      >
        <div className="hidden md:flex items-center gap-4 text-xs text-white/60">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">Space</kbd>
            Tiep theo
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">P</kbd>
            Play/Pause
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono">F</kbd>
            Toan man hinh
          </span>
        </div>
      </div>
    </div>
  );
}
