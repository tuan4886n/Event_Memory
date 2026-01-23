"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Search,
  Download,
  Trash2,
  MoreHorizontal,
  ImageIcon,
  HardDrive,
  Calendar,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Eye,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

interface Photo {
  id: string
  url: string
  eventName: string
  eventId: string
  uploadedBy: string
  uploadedAt: string
  size: string
  dimensions: string
  status: "approved" | "pending" | "rejected"
}

const generatePhotos = (): Photo[] => {
  const events = [
    { id: "evt-1", name: "Wedding - Minh & Linh" },
    { id: "evt-2", name: "Birthday Party - An" },
    { id: "evt-3", name: "Corporate Gala" },
    { id: "evt-5", name: "Graduation Celebration" },
  ]
  
  const statuses: ("approved" | "pending" | "rejected")[] = ["approved", "pending", "rejected"]
  const names = ["Nguyen Van A", "Tran Thi B", "Le Van C", "Pham Thi D", "Hoang Van E"]
  
  return Array.from({ length: 24 }, (_, i) => {
    const event = events[i % events.length]
    return {
      id: `photo-${i + 1}`,
      url: `https://picsum.photos/seed/${i + 100}/400/300`,
      eventName: event.name,
      eventId: event.id,
      uploadedBy: names[i % names.length],
      uploadedAt: new Date(2024, 1, Math.floor(Math.random() * 28) + 1).toISOString(),
      size: `${(Math.random() * 4 + 0.5).toFixed(1)} MB`,
      dimensions: ["1920x1080", "2560x1440", "3840x2160", "1280x720"][i % 4],
      status: statuses[i % 3],
    }
  })
}

const Loading = () => null;

function PhotosContent() {
  const [photos] = useState<Photo[]>(generatePhotos)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const photosPerPage = 12

  const filteredPhotos = photos.filter(photo =>
    photo.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    photo.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredPhotos.length / photosPerPage)
  const paginatedPhotos = filteredPhotos.slice(
    (currentPage - 1) * photosPerPage,
    currentPage * photosPerPage
  )

  const handleSelectPhoto = (photoId: string) => {
    setSelectedPhotos(prev =>
      prev.includes(photoId)
        ? prev.filter(id => id !== photoId)
        : [...prev, photoId]
    )
  }

  const handleSelectAll = () => {
    if (selectedPhotos.length === paginatedPhotos.length) {
      setSelectedPhotos([])
    } else {
      setSelectedPhotos(paginatedPhotos.map(p => p.id))
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      approved: "bg-[var(--admin-success)]/10 text-[var(--admin-success)] border-[var(--admin-success)]/20",
      pending: "bg-[var(--admin-warning)]/10 text-[var(--admin-warning)] border-[var(--admin-warning)]/20",
      rejected: "bg-destructive/10 text-destructive border-destructive/20",
    }
    return styles[status as keyof typeof styles] || styles.pending
  }

  const totalSize = photos.reduce((sum, p) => sum + Number.parseFloat(p.size), 0)
  const approvedCount = photos.filter(p => p.status === "approved").length
  const pendingCount = photos.filter(p => p.status === "pending").length

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Thu vien Anh</h1>
            <p className="text-sm text-muted-foreground">
              Quan ly tat ca anh tu cac su kien
            </p>
          </div>
          {selectedPhotos.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {selectedPhotos.length} anh da chon
              </span>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Tai xuong
              </Button>
              <Button variant="outline" size="sm" className="gap-2 text-destructive hover:text-destructive bg-transparent">
                <Trash2 className="h-4 w-4" />
                Xoa
              </Button>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <ImageIcon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-foreground">{photos.length}</p>
                  <p className="text-xs text-muted-foreground">Tong anh</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--admin-success)]/10">
                  <Eye className="h-5 w-5 text-[var(--admin-success)]" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-foreground">{approvedCount}</p>
                  <p className="text-xs text-muted-foreground">Da duyet</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--admin-warning)]/10">
                  <Calendar className="h-5 w-5 text-[var(--admin-warning)]" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-foreground">{pendingCount}</p>
                  <p className="text-xs text-muted-foreground">Cho duyet</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--admin-purple)]/10">
                  <HardDrive className="h-5 w-5 text-[var(--admin-purple)]" />
                </div>
                <div>
                  <p className="text-xl font-semibold text-foreground">{totalSize.toFixed(1)} MB</p>
                  <p className="text-xs text-muted-foreground">Dung luong</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tim kiem theo su kien hoac nguoi tai len..."
                  className="pl-10 bg-secondary border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select>
                <SelectTrigger className="w-48 bg-secondary border-border">
                  <SelectValue placeholder="Su kien" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Tat ca su kien</SelectItem>
                  <SelectItem value="evt-1">Wedding - Minh & Linh</SelectItem>
                  <SelectItem value="evt-2">Birthday Party - An</SelectItem>
                  <SelectItem value="evt-3">Corporate Gala</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-36 bg-secondary border-border">
                  <SelectValue placeholder="Trang thai" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Tat ca</SelectItem>
                  <SelectItem value="approved">Da duyet</SelectItem>
                  <SelectItem value="pending">Cho duyet</SelectItem>
                  <SelectItem value="rejected">Tu choi</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1 rounded-lg border border-border p-1">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Grid/List */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedPhotos.length === paginatedPhotos.length && paginatedPhotos.length > 0}
                  onCheckedChange={handleSelectAll}
                />
                <CardTitle className="text-base font-medium">
                  Hien thi {paginatedPhotos.length} / {filteredPhotos.length} anh
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {viewMode === "grid" ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {paginatedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`group relative overflow-hidden rounded-lg border transition-all ${
                      selectedPhotos.includes(photo.id)
                        ? "border-accent ring-2 ring-accent/20"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <div className="aspect-[4/3] relative">
                      <Image
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.eventName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                      
                      {/* Checkbox */}
                      <div className="absolute left-2 top-2">
                        <Checkbox
                          checked={selectedPhotos.includes(photo.id)}
                          onCheckedChange={() => handleSelectPhoto(photo.id)}
                          className="bg-background/80"
                        />
                      </div>

                      {/* Status Badge */}
                      <div className="absolute right-2 top-2">
                        <Badge variant="outline" className={`${getStatusBadge(photo.status)} text-[10px]`}>
                          {photo.status === "approved" ? "Da duyet" :
                           photo.status === "pending" ? "Cho duyet" : "Tu choi"}
                        </Badge>
                      </div>

                      {/* Hover Actions */}
                      <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-9 w-9"
                          onClick={() => setSelectedPhoto(photo)}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="secondary" className="h-9 w-9">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-card border-border">
                            <DropdownMenuItem className="gap-2">
                              <Download className="h-4 w-4" />
                              Tai xuong
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                              <Trash2 className="h-4 w-4" />
                              Xoa
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="text-xs font-medium text-foreground truncate">{photo.eventName}</p>
                      <p className="text-[10px] text-muted-foreground">{photo.uploadedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {paginatedPhotos.map((photo) => (
                  <div
                    key={photo.id}
                    className={`flex items-center gap-4 rounded-lg border p-3 transition-all ${
                      selectedPhotos.includes(photo.id)
                        ? "border-accent bg-accent/5"
                        : "border-border hover:border-accent/50"
                    }`}
                  >
                    <Checkbox
                      checked={selectedPhotos.includes(photo.id)}
                      onCheckedChange={() => handleSelectPhoto(photo.id)}
                    />
                    <div className="h-16 w-24 relative rounded overflow-hidden shrink-0">
                      <Image
                        src={photo.url || "/placeholder.svg"}
                        alt={photo.eventName}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{photo.eventName}</p>
                      <p className="text-xs text-muted-foreground">
                        {photo.uploadedBy} - {new Date(photo.uploadedAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-foreground font-mono">{photo.dimensions}</p>
                      <p className="text-xs text-muted-foreground">{photo.size}</p>
                    </div>
                    <Badge variant="outline" className={getStatusBadge(photo.status)}>
                      {photo.status === "approved" ? "Da duyet" :
                       photo.status === "pending" ? "Cho duyet" : "Tu choi"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem className="gap-2" onClick={() => setSelectedPhoto(photo)}>
                          <ZoomIn className="h-4 w-4" />
                          Xem
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Download className="h-4 w-4" />
                          Tai xuong
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Xoa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Trang {currentPage} / {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Photo Detail Dialog */}
        <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
          <DialogContent className="bg-card border-border max-w-4xl">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <div>
                  <DialogTitle>{selectedPhoto?.eventName}</DialogTitle>
                  <DialogDescription>
                    Tai len boi {selectedPhoto?.uploadedBy} - {selectedPhoto && new Date(selectedPhoto.uploadedAt).toLocaleDateString("vi-VN")}
                  </DialogDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setSelectedPhoto(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogHeader>
            <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
              {selectedPhoto && (
                <Image
                  src={selectedPhoto.url || "/placeholder.svg"}
                  alt={selectedPhoto.eventName}
                  fill
                  className="object-contain"
                  unoptimized
                />
              )}
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  Kich thuoc: <span className="text-foreground font-mono">{selectedPhoto?.dimensions}</span>
                </span>
                <span className="text-muted-foreground">
                  Dung luong: <span className="text-foreground font-mono">{selectedPhoto?.size}</span>
                </span>
                <Badge variant="outline" className={selectedPhoto ? getStatusBadge(selectedPhoto.status) : ""}>
                  {selectedPhoto?.status === "approved" ? "Da duyet" :
                   selectedPhoto?.status === "pending" ? "Cho duyet" : "Tu choi"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Tai xuong
                </Button>
                {selectedPhoto?.status === "pending" && (
                  <>
                    <Button className="bg-[var(--admin-success)] hover:bg-[var(--admin-success)]/90 text-white">
                      Duyet
                    </Button>
                    <Button variant="destructive">
                      Tu choi
                    </Button>
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  )
}

export default function PhotosPage() {
    return (
      <Suspense fallback={<div>Đang tải thư viện ảnh...</div>}>
        <PhotosContent />
      </Suspense>
    )
  }