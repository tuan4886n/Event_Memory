"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Search,
  RefreshCw,
  Download,
  AlertCircle,
  AlertTriangle,
  Info,
  Bug,
  ChevronLeft,
  ChevronRight,
  Terminal,
  Clock,
  Filter,
  X,
} from "lucide-react"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

type LogLevel = "INFO" | "WARNING" | "ERROR" | "DEBUG"

interface LogEntry {
  id: string
  timestamp: string
  level: LogLevel
  service: string
  message: string
  details?: string
  traceId?: string
  requestId?: string
  duration?: string
}

const services = [
  "api-gateway",
  "auth-service", 
  "image-service",
  "qr-generator",
  "event-service",
  "log-collector",
]

const generateLogs = (): LogEntry[] => {
  const messages: Record<LogLevel, string[]> = {
    INFO: [
      "Request completed successfully",
      "User authenticated",
      "Image uploaded to storage",
      "QR code generated",
      "Event created",
      "Database connection established",
      "Cache refreshed",
      "Webhook delivered",
    ],
    WARNING: [
      "High memory usage detected",
      "Rate limit approaching",
      "Slow database query",
      "Deprecated API called",
      "Certificate expiring soon",
      "Connection pool near capacity",
    ],
    ERROR: [
      "Failed to connect to database",
      "Authentication failed",
      "Image processing failed",
      "Service unavailable",
      "Timeout exceeded",
      "Invalid request payload",
    ],
    DEBUG: [
      "Processing request payload",
      "Validating JWT token",
      "Executing database query",
      "Compressing image",
      "Generating QR matrix",
    ],
  }

  const levels: LogLevel[] = ["INFO", "INFO", "INFO", "WARNING", "ERROR", "DEBUG"]
  
  return Array.from({ length: 100 }, (_, i) => {
    const level = levels[Math.floor(Math.random() * levels.length)]
    const service = services[Math.floor(Math.random() * services.length)]
    const message = messages[level][Math.floor(Math.random() * messages[level].length)]
    const timestamp = new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
    
    return {
      id: `log-${i + 1}`,
      timestamp: timestamp.toISOString(),
      level,
      service,
      message,
      details: level === "ERROR" ? `Traceback (most recent call last):\n  File "app/${service}/handler.py", line ${Math.floor(Math.random() * 200) + 1}, in process\n    result = await execute(request)\n  File "app/${service}/executor.py", line ${Math.floor(Math.random() * 100) + 1}, in execute\n    raise ${message.includes("database") ? "DatabaseError" : message.includes("auth") ? "AuthenticationError" : "ServiceError"}("${message}")` : undefined,
      traceId: `trace-${Math.random().toString(36).substring(2, 10)}`,
      requestId: `req-${Math.random().toString(36).substring(2, 10)}`,
      duration: `${Math.floor(Math.random() * 500) + 10}ms`,
    }
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

const Loading = () => null

function LogsContent() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [serviceFilter, setServiceFilter] = useState<string>("all")
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLive, setIsLive] = useState(false)
  const logsPerPage = 20

  const searchParams = useSearchParams()

  useEffect(() => {
    setLogs(generateLogs())
  }, [])

  useEffect(() => {
    if (isLive) {
      const interval = setInterval(() => {
        const newLog: LogEntry = {
          id: `log-live-${Date.now()}`,
          timestamp: new Date().toISOString(),
          level: ["INFO", "INFO", "WARNING", "ERROR"][Math.floor(Math.random() * 4)] as LogLevel,
          service: services[Math.floor(Math.random() * services.length)],
          message: "New log entry from live stream",
          traceId: `trace-${Math.random().toString(36).substring(2, 10)}`,
          requestId: `req-${Math.random().toString(36).substring(2, 10)}`,
          duration: `${Math.floor(Math.random() * 100) + 5}ms`,
        }
        setLogs(prev => [newLog, ...prev.slice(0, 99)])
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [isLive])

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          log.traceId?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLevel = levelFilter === "all" || log.level === levelFilter
    const matchesService = serviceFilter === "all" || log.service === serviceFilter
    return matchesSearch && matchesLevel && matchesService
  })

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  )

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case "ERROR": return <AlertCircle className="h-4 w-4" />
      case "WARNING": return <AlertTriangle className="h-4 w-4" />
      case "INFO": return <Info className="h-4 w-4" />
      case "DEBUG": return <Bug className="h-4 w-4" />
    }
  }

  const getLevelStyle = (level: LogLevel) => {
    switch (level) {
      case "ERROR": return "bg-destructive/10 text-destructive border-destructive/20"
      case "WARNING": return "bg-[var(--admin-warning)]/10 text-[var(--admin-warning)] border-[var(--admin-warning)]/20"
      case "INFO": return "bg-[var(--admin-info)]/10 text-[var(--admin-info)] border-[var(--admin-info)]/20"
      case "DEBUG": return "bg-[var(--admin-purple)]/10 text-[var(--admin-purple)] border-[var(--admin-purple)]/20"
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
    })
  }

  const errorCount = logs.filter(l => l.level === "ERROR").length
  const warningCount = logs.filter(l => l.level === "WARNING").length
  const infoCount = logs.filter(l => l.level === "INFO").length

  return (
    <Suspense fallback={<Loading />}>
      <div className="flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">System Logs</h1>
            <p className="text-sm text-muted-foreground">
              Logs tu Python Backend Microservices
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={isLive ? "default" : "outline"}
              size="sm"
              className={`gap-2 ${isLive ? "bg-[var(--admin-success)] hover:bg-[var(--admin-success)]/90" : ""}`}
              onClick={() => setIsLive(!isLive)}
            >
              <span className={`h-2 w-2 rounded-full ${isLive ? "bg-white animate-pulse" : "bg-muted-foreground"}`} />
              {isLive ? "Live" : "Paused"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={() => setLogs(generateLogs())}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-foreground">{logs.length}</p>
                  <p className="text-xs text-muted-foreground">Tong logs (24h)</p>
                </div>
                <Terminal className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-destructive">{errorCount}</p>
                  <p className="text-xs text-muted-foreground">Errors</p>
                </div>
                <AlertCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-[var(--admin-warning)]">{warningCount}</p>
                  <p className="text-xs text-muted-foreground">Warnings</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-[var(--admin-warning)]" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-semibold text-[var(--admin-info)]">{infoCount}</p>
                  <p className="text-xs text-muted-foreground">Info</p>
                </div>
                <Info className="h-8 w-8 text-[var(--admin-info)]" />
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
                  placeholder="Tim kiem message, service, trace ID..."
                  className="pl-10 bg-secondary border-border font-mono text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-36 bg-secondary border-border">
                  <SelectValue placeholder="Level" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="ERROR">Error</SelectItem>
                  <SelectItem value="WARNING">Warning</SelectItem>
                  <SelectItem value="INFO">Info</SelectItem>
                  <SelectItem value="DEBUG">Debug</SelectItem>
                </SelectContent>
              </Select>
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-44 bg-secondary border-border">
                  <SelectValue placeholder="Service" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Services</SelectItem>
                  {services.map(service => (
                    <SelectItem key={service} value={service}>{service}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(levelFilter !== "all" || serviceFilter !== "all" || searchQuery) && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="gap-2"
                  onClick={() => {
                    setLevelFilter("all")
                    setServiceFilter("all")
                    setSearchQuery("")
                  }}
                >
                  <X className="h-4 w-4" />
                  Clear
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Logs Table */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                {filteredLogs.length} logs
              </CardTitle>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                Last 24 hours
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-border bg-secondary/50 hover:bg-secondary/50">
                    <TableHead className="text-muted-foreground w-40">Timestamp</TableHead>
                    <TableHead className="text-muted-foreground w-24">Level</TableHead>
                    <TableHead className="text-muted-foreground w-36">Service</TableHead>
                    <TableHead className="text-muted-foreground">Message</TableHead>
                    <TableHead className="text-muted-foreground w-24">Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedLogs.map((log) => (
                    <TableRow
                      key={log.id}
                      className="border-border cursor-pointer hover:bg-secondary/30"
                      onClick={() => setSelectedLog(log)}
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {formatTimestamp(log.timestamp)}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`gap-1 ${getLevelStyle(log.level)}`}>
                          {getLevelIcon(log.level)}
                          {log.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="rounded bg-secondary px-1.5 py-0.5 text-xs font-mono">
                          {log.service}
                        </code>
                      </TableCell>
                      <TableCell className="max-w-md truncate text-sm">
                        {log.message}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {log.duration}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
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
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage + i - 2
                  if (page > totalPages || page < 1) return null
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
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

        {/* Log Detail Dialog */}
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="bg-card border-border max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Badge variant="outline" className={selectedLog ? getLevelStyle(selectedLog.level) : ""}>
                  {selectedLog && getLevelIcon(selectedLog.level)}
                  {selectedLog?.level}
                </Badge>
                <code className="rounded bg-secondary px-2 py-0.5 text-sm font-mono">
                  {selectedLog?.service}
                </code>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">Timestamp</p>
                  <p className="font-mono">{selectedLog && formatTimestamp(selectedLog.timestamp)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Duration</p>
                  <p className="font-mono">{selectedLog?.duration}</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Trace ID</p>
                  <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{selectedLog?.traceId}</code>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Request ID</p>
                  <code className="text-xs bg-secondary px-1.5 py-0.5 rounded">{selectedLog?.requestId}</code>
                </div>
              </div>

              {/* Message */}
              <div>
                <p className="text-muted-foreground mb-1 text-sm">Message</p>
                <p className="text-foreground">{selectedLog?.message}</p>
              </div>

              {/* Stack Trace (for errors) */}
              {selectedLog?.details && (
                <div>
                  <p className="text-muted-foreground mb-1 text-sm">Stack Trace</p>
                  <pre className="rounded-lg bg-[#0d0d0d] p-4 overflow-x-auto text-xs font-mono text-red-400 whitespace-pre-wrap">
                    {selectedLog.details}
                  </pre>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  )
}


export default function LogsPage() {
    return (
      <Suspense fallback={<div>Đang tải nhật ký hệ thống...</div>}>
        <LogsContent />
      </Suspense>
    )
}