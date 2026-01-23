"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  CalendarDays,
  ImageIcon,
  QrCode,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Server,
  Database,
  Cpu,
  HardDrive,
} from "lucide-react"

const stats = [
  {
    name: "Tong Su kien",
    value: "24",
    change: "+12%",
    trend: "up",
    icon: CalendarDays,
  },
  {
    name: "Tong Anh",
    value: "1,847",
    change: "+23%",
    trend: "up",
    icon: ImageIcon,
  },
  {
    name: "QR Code Active",
    value: "156",
    change: "-3%",
    trend: "down",
    icon: QrCode,
  },
  {
    name: "Khach tham du",
    value: "3,291",
    change: "+18%",
    trend: "up",
    icon: Users,
  },
]

const services = [
  { name: "API Gateway", status: "healthy", latency: "12ms", uptime: "99.99%" },
  { name: "Auth Service", status: "healthy", latency: "8ms", uptime: "99.95%" },
  { name: "Image Service", status: "healthy", latency: "45ms", uptime: "99.90%" },
  { name: "QR Generator", status: "healthy", latency: "15ms", uptime: "99.98%" },
  { name: "Event Service", status: "degraded", latency: "120ms", uptime: "98.50%" },
  { name: "Log Collector", status: "healthy", latency: "5ms", uptime: "99.99%" },
]

const recentActivity = [
  { action: "Event created", target: "Wedding - Minh & Linh", time: "2 phut truoc", type: "create" },
  { action: "Photos uploaded", target: "Birthday Party #45", time: "5 phut truoc", type: "upload" },
  { action: "QR Code generated", target: "Corporate Event", time: "12 phut truoc", type: "generate" },
  { action: "Theme changed", target: "Anniversary Event", time: "18 phut truoc", type: "update" },
  { action: "Event deleted", target: "Test Event", time: "1 gio truoc", type: "delete" },
]

const systemMetrics = [
  { name: "CPU Usage", value: 42, icon: Cpu, unit: "%" },
  { name: "Memory", value: 68, icon: Server, unit: "%" },
  { name: "Storage", value: 34, icon: HardDrive, unit: "%" },
  { name: "DB Connections", value: 127, icon: Database, unit: "" },
]

export default function AdminDashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Tong quan</h1>
          <p className="text-sm text-muted-foreground">
            Monitor your event management system
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString("vi-VN")}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.name} className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                  <stat.icon className="h-5 w-5 text-accent" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${
                  stat.trend === "up" ? "text-[var(--admin-success)]" : "text-destructive"
                }`}>
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3" />
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.name}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Services Status */}
        <Card className="lg:col-span-2 bg-card border-border">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">Microservices Status</CardTitle>
              <Badge variant="outline" className="font-mono text-xs">
                6 services
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${
                      service.status === "healthy" 
                        ? "bg-[var(--admin-success)]" 
                        : "bg-[var(--admin-warning)]"
                    }`} />
                    <span className="text-sm font-medium text-foreground">{service.name}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-mono text-xs text-muted-foreground">Latency</p>
                      <p className="font-mono text-sm text-foreground">{service.latency}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-xs text-muted-foreground">Uptime</p>
                      <p className="font-mono text-sm text-foreground">{service.uptime}</p>
                    </div>
                    <Badge 
                      variant={service.status === "healthy" ? "default" : "secondary"}
                      className={`text-xs ${
                        service.status === "healthy" 
                          ? "bg-[var(--admin-success)]/10 text-[var(--admin-success)] border-[var(--admin-success)]/20" 
                          : "bg-[var(--admin-warning)]/10 text-[var(--admin-warning)] border-[var(--admin-warning)]/20"
                      }`}
                    >
                      {service.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">System Metrics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemMetrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <metric.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{metric.name}</span>
                  </div>
                  <span className="font-mono text-foreground">
                    {metric.value}{metric.unit}
                  </span>
                </div>
                {metric.unit === "%" && (
                  <div className="h-1.5 w-full rounded-full bg-secondary">
                    <div 
                      className="h-full rounded-full bg-accent transition-all"
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-medium">Recent Activity</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className={`h-2 w-2 rounded-full ${
                    activity.type === "create" ? "bg-[var(--admin-success)]" :
                    activity.type === "delete" ? "bg-destructive" :
                    activity.type === "upload" ? "bg-[var(--admin-info)]" :
                    "bg-[var(--admin-purple)]"
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.target}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
