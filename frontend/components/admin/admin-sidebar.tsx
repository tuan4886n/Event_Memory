"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  CalendarDays,
  QrCode,
  ImageIcon,
  ScrollText,
  Settings,
  ChevronRight,
  Boxes,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  {
    name: "Tong quan",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Quan ly Su kien",
    href: "/admin/events",
    icon: CalendarDays,
  },
  {
    name: "Quan ly QR Code",
    href: "/admin/qr-codes",
    icon: QrCode,
  },
  {
    name: "Thu vien Anh",
    href: "/admin/photos",
    icon: ImageIcon,
  },
  {
    name: "System Logs",
    href: "/admin/logs",
    icon: ScrollText,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-[var(--admin-sidebar-bg)] sticky top-0">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Boxes className="h-4 w-4 text-accent-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">Event Admin</span>
          <span className="text-xs text-muted-foreground">Microservices</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        <div className="mb-2 px-3">
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Menu
          </span>
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn(
                "h-4 w-4 shrink-0",
                isActive ? "text-accent" : "text-muted-foreground group-hover:text-foreground"
              )} />
              <span className="flex-1">{item.name}</span>
              {isActive && (
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <Link
          href="/admin/settings"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground"
        >
          <Settings className="h-4 w-4" />
          <span>Cai dat</span>
        </Link>
        <div className="mt-4 rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-[var(--admin-success)] animate-pulse" />
            <span className="text-xs text-muted-foreground">All services running</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Uptime</span>
            <span className="font-mono text-foreground">99.9%</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
