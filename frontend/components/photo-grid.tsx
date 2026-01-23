"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import { Heart, X, ChevronLeft, ChevronRight, User } from "lucide-react"
import { cn } from "../lib/utils"

interface Photo {
  id: string
  url: string
  author: string
  likes: number
  aspectRatio: number // height / width
}

// Sample photos for demo
const samplePhotos: Photo[] = [
  { id: "1", url: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80", author: "Minh Anh", likes: 24, aspectRatio: 1.5 },
  { id: "2", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80", author: "Thanh Hương", likes: 18, aspectRatio: 0.75 },
  { id: "3", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80", author: "Văn Đức", likes: 32, aspectRatio: 1.2 },
  { id: "4", url: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?w=600&q=80", author: "Thu Trang", likes: 15, aspectRatio: 1 },
  { id: "5", url: "https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=600&q=80", author: "Hải Nam", likes: 28, aspectRatio: 1.4 },
  { id: "6", url: "https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=600&q=80", author: "Ngọc Linh", likes: 21, aspectRatio: 0.8 },
  { id: "7", url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80", author: "Quốc Bảo", likes: 19, aspectRatio: 1.3 },
  { id: "8", url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80", author: "Mai Phương", likes: 35, aspectRatio: 0.9 },
  { id: "9", url: "https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80", author: "Đình Khôi", likes: 12, aspectRatio: 1.1 },
  { id: "10", url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?w=600&q=80", author: "Hoàng Yến", likes: 27, aspectRatio: 1.25 },
]

export function PhotoGrid() {
  const [photos, setPhotos] = useState<Photo[]>(samplePhotos)
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [likedPhotos, setLikedPhotos] = useState<Set<string>>(new Set())

  const handleLike = (photoId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId
          ? { ...p, likes: likedPhotos.has(photoId) ? p.likes - 1 : p.likes + 1 }
          : p
      )
    )
    setLikedPhotos((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(photoId)) {
        newSet.delete(photoId)
      } else {
        newSet.add(photoId)
      }
      return newSet
    })
  }

  const navigatePhoto = (direction: "prev" | "next") => {
    if (!selectedPhoto) return
    const currentIndex = photos.findIndex((p) => p.id === selectedPhoto.id)
    const newIndex =
      direction === "prev"
        ? (currentIndex - 1 + photos.length) % photos.length
        : (currentIndex + 1) % photos.length
    setSelectedPhoto(photos[newIndex])
  }

  return (
    <>
      <div className="masonry-grid px-3 sm:px-4 py-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="masonry-item group cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div
              className={cn(
                "relative overflow-hidden rounded-xl sm:rounded-2xl",
                "bg-muted transition-all duration-300",
                "hover:shadow-lg hover:scale-[1.02]"
              )}
              style={{ paddingBottom: `${photo.aspectRatio * 100}%` }}
            >
              <Image
                src={photo.url || "/placeholder.svg"}
                alt={`Photo by ${photo.author}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Info overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <User className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium truncate max-w-[80px] sm:max-w-[100px]">
                      {photo.author}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleLike(photo.id, e)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                  >
                    <Heart
                      className={cn(
                        "w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors",
                        likedPhotos.has(photo.id) && "fill-red-500 text-red-500"
                      )}
                    />
                    <span className="text-xs font-medium">{photo.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "var(--overlay-bg)" }}
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="absolute inset-0 backdrop-blur-xl" />
          
          {/* Close button */}
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>

          {/* Navigation buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigatePhoto("prev")
            }}
            className="absolute left-4 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigatePhoto("next")
            }}
            className="absolute right-4 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm border border-border hover:bg-card transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Photo container */}
          <div
            className="relative max-w-[90vw] max-h-[85vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedPhoto.url || "/placeholder.svg"}
              alt={`Photo by ${selectedPhoto.author}`}
              width={800}
              height={800 * selectedPhoto.aspectRatio}
              className="object-contain rounded-2xl max-h-[75vh] w-auto"
              priority
            />
            
            {/* Photo info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent rounded-b-2xl">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="font-medium">{selectedPhoto.author}</span>
                </div>
                <button
                  onClick={() => handleLike(selectedPhoto.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                >
                  <Heart
                    className={cn(
                      "w-5 h-5 transition-all",
                      likedPhotos.has(selectedPhoto.id) && "fill-red-500 text-red-500 scale-110"
                    )}
                  />
                  <span className="font-medium">{selectedPhoto.likes}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
