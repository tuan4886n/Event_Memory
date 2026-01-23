"use client"

import React from "react"

import { useState } from "react"
import { Camera, X, Upload, ImageIcon } from "lucide-react"
import { cn } from "../lib/utils"
import { Button } from "@/components/ui/button"

export function UploadButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...files])
      
      // Create previews
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviews((prev) => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return
    
    setIsUploading(true)
    // Simulate upload
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsUploading(false)
    setSelectedFiles([])
    setPreviews([])
    setIsOpen(false)
  }

  const resetAndClose = () => {
    setSelectedFiles([])
    setPreviews([])
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40",
          "w-14 h-14 sm:w-16 sm:h-16 rounded-full",
          "flex items-center justify-center",
          "text-primary-foreground",
          "animate-float",
          "hover:scale-110 active:scale-95",
          "transition-transform duration-200"
        )}
        style={{
          background: "var(--fab-bg)",
          boxShadow: "var(--fab-shadow)",
        }}
        aria-label="Upload photo"
      >
        <Camera className="w-6 h-6 sm:w-7 sm:h-7" />
      </button>

      {/* Upload Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          onClick={resetAndClose}
        >
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ background: "var(--overlay-bg)" }}
          />
          
          <div
            className={cn(
              "relative w-full sm:w-auto sm:min-w-[400px] sm:max-w-md mx-0 sm:mx-4",
              "bg-card rounded-t-3xl sm:rounded-2xl",
              "border border-border",
              "shadow-2xl",
              "max-h-[85vh] overflow-hidden",
              "animate-in slide-in-from-bottom sm:slide-in-from-bottom-4 duration-300"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-lg font-serif font-semibold text-foreground">
                Chia sẻ khoảnh khắc
              </h2>
              <button
                onClick={resetAndClose}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Upload Zone */}
              <label
                className={cn(
                  "flex flex-col items-center justify-center",
                  "w-full h-40 sm:h-48",
                  "border-2 border-dashed border-border rounded-xl",
                  "bg-secondary/50 hover:bg-secondary/80",
                  "cursor-pointer transition-colors",
                  "group"
                )}
              >
                <div
                  className="p-3 rounded-full mb-3 transition-transform group-hover:scale-110"
                  style={{ background: "var(--fab-bg)" }}
                >
                  <ImageIcon className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Nhấn để chọn ảnh
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  hoặc kéo thả ảnh vào đây
                </p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Preview Grid */}
              {previews.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="relative aspect-square rounded-lg overflow-hidden group"
                    >
                      <img
                        src={preview || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 p-1 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Button */}
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || isUploading}
                className="w-full h-12 rounded-xl text-base font-medium"
                style={{
                  background: selectedFiles.length > 0 ? "var(--fab-bg)" : undefined,
                }}
              >
                {isUploading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    <span>Đang tải lên...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <span>
                      Tải lên {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                    </span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
