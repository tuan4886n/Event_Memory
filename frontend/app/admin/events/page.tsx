"use client"
export const dynamic = 'force-dynamic'

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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Palette,
  Calendar,
  Users,
  ImageIcon,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

type Theme = "elegant" | "vibrant" | "moody"

interface Event {
  id: string
  name: string
  date: string
  type: string
  theme: Theme
  guests: number
  photos: number
  status: "active" | "upcoming" | "completed"
}

const initialEvents: Event[] = [
  { id: "1", name: "Wedding - Minh & Linh", date: "2024-02-14", type: "Wedding", theme: "elegant", guests: 150, photos: 342, status: "active" },
  { id: "2", name: "Birthday Party - An", date: "2024-02-20", type: "Birthday", theme: "vibrant", guests: 45, photos: 128, status: "upcoming" },
  { id: "3", name: "Corporate Gala", date: "2024-01-28", type: "Corporate", theme: "moody", guests: 200, photos: 567, status: "completed" },
  { id: "4", name: "Anniversary - 10 Years", date: "2024-03-01", type: "Anniversary", theme: "elegant", guests: 80, photos: 0, status: "upcoming" },
  { id: "5", name: "Graduation Celebration", date: "2024-02-15", type: "Graduation", theme: "vibrant", guests: 60, photos: 89, status: "active" },
]

const themeConfig = {
  elegant: {
    label: "Elegant",
    description: "Trang nha - Trang & Vang Gold",
    colors: ["#fdfcfa", "#c9a961", "#d4b872"],
  },
  vibrant: {
    label: "Vibrant", 
    description: "Ruc ro - Gradient sinh nhat",
    colors: ["#f97316", "#ec4899", "#8b5cf6"],
  },
  moody: {
    label: "Moody",
    description: "Tram lang - Tong toi",
    colors: ["#0f0f0f", "#6366f1", "#a78bfa"],
  },
}

const Loading = () => null;

function EventsContent() {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false)
  const searchParams = useSearchParams();

  const filteredEvents = events.filter(event => 
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleThemeChange = (eventId: string, newTheme: Theme) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId ? { ...event, theme: newTheme } : event
    ))
    setIsThemeDialogOpen(false)
    setSelectedEvent(null)
  }

  const handleDelete = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId))
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-[var(--admin-success)]/10 text-[var(--admin-success)] border-[var(--admin-success)]/20",
      upcoming: "bg-[var(--admin-info)]/10 text-[var(--admin-info)] border-[var(--admin-info)]/20",
      completed: "bg-muted text-muted-foreground border-border",
    }
    return styles[status as keyof typeof styles] || styles.upcoming
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Quan ly Su kien</h1>
            <p className="text-sm text-muted-foreground">
              Quan ly va cau hinh cac su kien cua ban
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Tao Su kien
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Tao Su kien Moi</DialogTitle>
                <DialogDescription>
                  Dien thong tin de tao su kien moi
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Ten su kien</Label>
                  <Input id="name" placeholder="VD: Wedding - Minh & Linh" className="bg-secondary border-border" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="date">Ngay</Label>
                    <Input id="date" type="date" className="bg-secondary border-border" />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="type">Loai</Label>
                    <Select>
                      <SelectTrigger className="bg-secondary border-border">
                        <SelectValue placeholder="Chon loai" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="wedding">Wedding</SelectItem>
                        <SelectItem value="birthday">Birthday</SelectItem>
                        <SelectItem value="corporate">Corporate</SelectItem>
                        <SelectItem value="anniversary">Anniversary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.entries(themeConfig) as [Theme, typeof themeConfig.elegant][]).map(([key, theme]) => (
                      <button
                        key={key}
                        type="button"
                        className="flex flex-col items-center gap-2 rounded-lg border border-border p-3 hover:border-accent transition-colors"
                      >
                        <div className="flex gap-1">
                          {theme.colors.map((color, i) => (
                            <div
                              key={i}
                              className="h-4 w-4 rounded-full border border-border"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium">{theme.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Huy
                </Button>
                <Button onClick={() => setIsCreateOpen(false)}>
                  Tao Su kien
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Tim kiem su kien..." 
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
                  <SelectItem value="active">Dang dien ra</SelectItem>
                  <SelectItem value="upcoming">Sap toi</SelectItem>
                  <SelectItem value="completed">Hoan thanh</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-40 bg-secondary border-border">
                  <SelectValue placeholder="Theme" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Tat ca</SelectItem>
                  <SelectItem value="elegant">Elegant</SelectItem>
                  <SelectItem value="vibrant">Vibrant</SelectItem>
                  <SelectItem value="moody">Moody</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">
              Danh sach Su kien ({filteredEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground">Ten Su kien</TableHead>
                  <TableHead className="text-muted-foreground">Ngay</TableHead>
                  <TableHead className="text-muted-foreground">Theme</TableHead>
                  <TableHead className="text-muted-foreground text-center">Khach</TableHead>
                  <TableHead className="text-muted-foreground text-center">Anh</TableHead>
                  <TableHead className="text-muted-foreground">Trang thai</TableHead>
                  <TableHead className="text-muted-foreground w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id} className="border-border">
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">{event.name}</p>
                        <p className="text-xs text-muted-foreground">{event.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString("vi-VN")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedEvent(event)
                          setIsThemeDialogOpen(true)
                        }}
                        className="flex items-center gap-2 rounded-md border border-border px-2 py-1 hover:border-accent transition-colors"
                      >
                        <div className="flex gap-0.5">
                          {themeConfig[event.theme].colors.map((color, i) => (
                            <div
                              key={i}
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium">{themeConfig[event.theme].label}</span>
                        <Palette className="h-3 w-3 text-muted-foreground" />
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {event.guests}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                        <ImageIcon className="h-4 w-4" />
                        {event.photos}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(event.status)}>
                        {event.status === "active" ? "Dang dien ra" : 
                         event.status === "upcoming" ? "Sap toi" : "Hoan thanh"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem className="gap-2">
                            <Eye className="h-4 w-4" />
                            Xem chi tiet
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Pencil className="h-4 w-4" />
                            Chinh sua
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="gap-2 text-destructive focus:text-destructive"
                            onClick={() => handleDelete(event.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Xoa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Theme Selection Dialog */}
        <Dialog open={isThemeDialogOpen} onOpenChange={setIsThemeDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle>Chon Theme cho Su kien</DialogTitle>
              <DialogDescription>
                {selectedEvent?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3 py-4">
              {(Object.entries(themeConfig) as [Theme, typeof themeConfig.elegant][]).map(([key, theme]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectedEvent && handleThemeChange(selectedEvent.id, key)}
                  className={`flex items-center gap-4 rounded-lg border p-4 text-left transition-colors ${
                    selectedEvent?.theme === key 
                      ? "border-accent bg-accent/10" 
                      : "border-border hover:border-accent/50"
                  }`}
                >
                  <div className="flex gap-1">
                    {theme.colors.map((color, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-lg border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{theme.label}</p>
                    <p className="text-sm text-muted-foreground">{theme.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  )
}

export default function EventsPage() {
    return (
      <Suspense fallback={<div>Đang tải danh sách sự kiện...</div>}>
        <EventsContent />
      </Suspense>
    )
  }