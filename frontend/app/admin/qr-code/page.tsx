"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Plus,
  Search,
  Download,
  Copy,
  ExternalLink,
  QrCode,
  Eye,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

interface QRCodeItem {
  id: string
  eventName: string
  eventId: string
  url: string
  scans: number
  createdAt: string
  status: "active" | "expired" | "disabled"
}

const initialQRCodes: QRCodeItem[] = [
  { id: "qr-1", eventName: "Wedding - Minh & Linh", eventId: "evt-1", url: "https://event.app/w/minh-linh", scans: 234, createdAt: "2024-02-01", status: "active" },
  { id: "qr-2", eventName: "Birthday Party - An", eventId: "evt-2", url: "https://event.app/b/an-25", scans: 89, createdAt: "2024-02-10", status: "active" },
  { id: "qr-3", eventName: "Corporate Gala", eventId: "evt-3", url: "https://event.app/c/gala-2024", scans: 456, createdAt: "2024-01-15", status: "expired" },
  { id: "qr-4", eventName: "Anniversary - 10 Years", eventId: "evt-4", url: "https://event.app/a/10years", scans: 12, createdAt: "2024-02-18", status: "active" },
  { id: "qr-5", eventName: "Graduation Celebration", eventId: "evt-5", url: "https://event.app/g/grad-2024", scans: 178, createdAt: "2024-02-05", status: "disabled" },
]

// Simple QR Code SVG generator
function QRCodeSVG({ value, size = 200 }: { value: string; size?: number }) {
  // This is a simplified representation - in production, use a proper QR library
  const cells = 21
  const cellSize = size / cells
  
  // Generate a deterministic pattern based on the URL
  const generatePattern = (url: string) => {
    const pattern: boolean[][] = []
    let hash = 0
    for (let i = 0; i < url.length; i++) {
      hash = ((hash << 5) - hash) + url.charCodeAt(i)
      hash = hash & hash
    }
    
    for (let row = 0; row < cells; row++) {
      pattern[row] = []
      for (let col = 0; col < cells; col++) {
        // Always draw position patterns (corners)
        const isPositionPattern = 
          (row < 7 && col < 7) || 
          (row < 7 && col >= cells - 7) || 
          (row >= cells - 7 && col < 7)
        
        if (isPositionPattern) {
          const inOuter = row < 7 && col < 7 ? 
            (row === 0 || row === 6 || col === 0 || col === 6) :
            row < 7 && col >= cells - 7 ?
            (row === 0 || row === 6 || col === cells - 7 || col === cells - 1) :
            (row === cells - 7 || row === cells - 1 || col === 0 || col === 6)
          const inInner = row < 7 && col < 7 ?
            (row >= 2 && row <= 4 && col >= 2 && col <= 4) :
            row < 7 && col >= cells - 7 ?
            (row >= 2 && row <= 4 && col >= cells - 5 && col <= cells - 3) :
            (row >= cells - 5 && row <= cells - 3 && col >= 2 && col <= 4)
          pattern[row][col] = inOuter || inInner
        } else {
          // Random data based on hash
          pattern[row][col] = ((hash * (row + 1) * (col + 1)) % 100) < 45
        }
      }
    }
    return pattern
  }
  
  const pattern = generatePattern(value)
  
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {pattern.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          cell ? (
            <rect
              key={`${rowIndex}-${colIndex}`}
              x={colIndex * cellSize}
              y={rowIndex * cellSize}
              width={cellSize}
              height={cellSize}
              fill="black"
            />
          ) : null
        )
      )}
    </svg>
  )
}

function Loading() {
  return null
}

function QRContent() {
  const searchParams = useSearchParams()
  const [qrCodes, setQRCodes] = useState<QRCodeItem[]>(initialQRCodes)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedQR, setSelectedQR] = useState<QRCodeItem | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredQRCodes = qrCodes.filter(qr =>
    qr.eventName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCopyUrl = (qr: QRCodeItem) => {
    navigator.clipboard.writeText(qr.url)
    setCopiedId(qr.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDelete = (id: string) => {
    setQRCodes(prev => prev.filter(qr => qr.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setQRCodes(prev => prev.map(qr => 
      qr.id === id 
        ? { ...qr, status: qr.status === "active" ? "disabled" : "active" as const }
        : qr
    ))
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-[var(--admin-success)]/10 text-[var(--admin-success)] border-[var(--admin-success)]/20",
      expired: "bg-[var(--admin-warning)]/10 text-[var(--admin-warning)] border-[var(--admin-warning)]/20",
      disabled: "bg-muted text-muted-foreground border-border",
    }
    return styles[status as keyof typeof styles] || styles.active
  }

  const totalScans = qrCodes.reduce((sum, qr) => sum + qr.scans, 0)
  const activeQRs = qrCodes.filter(qr => qr.status === "active").length

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Quan ly QR Code</h1>
            <p className="text-sm text-muted-foreground">
              Tao va quan ly QR codes cho cac su kien
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tao QR Code
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Tao QR Code Moi</DialogTitle>
                <DialogDescription>
                  Chon su kien de tao QR code
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="event">Su kien</Label>
                  <Select>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Chon su kien" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="evt-1">Wedding - Minh & Linh</SelectItem>
                      <SelectItem value="evt-2">Birthday Party - An</SelectItem>
                      <SelectItem value="evt-4">Anniversary - 10 Years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="customUrl">Custom URL Path (optional)</Label>
                  <Input 
                    id="customUrl" 
                    placeholder="vd: my-event" 
                    className="bg-secondary border-border font-mono"
                  />
                  <p className="text-xs text-muted-foreground">
                    URL: https://event.app/<span className="text-accent">my-event</span>
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Huy
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>
                  Tao QR Code
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary">
                  <QrCode className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{qrCodes.length}</p>
                  <p className="text-sm text-muted-foreground">Tong QR Codes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--admin-success)]/10">
                  <Eye className="h-6 w-6 text-[var(--admin-success)]" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{totalScans.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Tong luot quet</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--admin-info)]/10">
                  <RefreshCw className="h-6 w-6 text-[var(--admin-info)]" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">{activeQRs}</p>
                  <p className="text-sm text-muted-foreground">Dang hoat dong</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tim kiem QR code..."
                  className="pl-10 bg-secondary border-border"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select>
                <SelectTrigger className="w-40 bg-secondary border-border">
                  <SelectValue placeholder="Trang thai" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Tat ca</SelectItem>
                  <SelectItem value="active">Dang hoat dong</SelectItem>
                  <SelectItem value="expired">Het han</SelectItem>
                  <SelectItem value="disabled">Vo hieu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* QR Code Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredQRCodes.map((qr) => (
            <Card key={qr.id} className="bg-card border-border overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-sm font-medium">{qr.eventName}</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tao ngay: {new Date(qr.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <Badge variant="outline" className={getStatusBadge(qr.status)}>
                    {qr.status === "active" ? "Hoat dong" : 
                     qr.status === "expired" ? "Het han" : "Vo hieu"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Code Preview */}
                <div 
                  className="flex items-center justify-center rounded-lg bg-white p-4 cursor-pointer"
                  onClick={() => setSelectedQR(qr)}
                >
                  <QRCodeSVG value={qr.url} size={150} />
                </div>

                {/* URL */}
                <div className="flex items-center gap-2 rounded-lg bg-secondary p-2">
                  <code className="flex-1 truncate text-xs font-mono text-muted-foreground">
                    {qr.url}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    onClick={() => handleCopyUrl(qr)}
                  >
                    <Copy className={`h-3 w-3 ${copiedId === qr.id ? "text-[var(--admin-success)]" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 shrink-0"
                    asChild
                  >
                    <a href={qr.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </Button>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Luot quet</span>
                  <span className="font-mono font-medium text-foreground">{qr.scans}</span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                    <Download className="h-3 w-3" />
                    Tai xuong
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(qr.id)}
                  >
                    {qr.status === "active" ? "Vo hieu" : "Kich hoat"}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDelete(qr.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* QR Code Detail Dialog */}
        <Dialog open={!!selectedQR} onOpenChange={() => setSelectedQR(null)}>
          <DialogContent className="bg-card border-border max-w-md">
            <DialogHeader>
              <DialogTitle>{selectedQR?.eventName}</DialogTitle>
              <DialogDescription>
                {selectedQR?.url}
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="rounded-lg bg-white p-6">
                {selectedQR && <QRCodeSVG value={selectedQR.url} size={250} />}
              </div>
              <div className="flex gap-2">
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Tai PNG
                </Button>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Download className="h-4 w-4" />
                  Tai SVG
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  )
}

export default function QRCodesPage() {
  return (
    <Suspense fallback={<div>Đang tải trình quản lý QR...</div>}>
      <QRContent />
    </Suspense>
  )
}