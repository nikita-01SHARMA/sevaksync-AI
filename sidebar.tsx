"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  MapPin,
  BarChart3,
  Heart,
  Menu,
  X,
  Sun,
  Moon,
  Sparkles,
  User,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { useState } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/needs", label: "Community Needs", icon: Heart },
  { href: "/dashboard/volunteers", label: "Volunteers", icon: Users },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/map", label: "Map View", icon: MapPin },
  { href: "/dashboard/profile", label: "My Profile", icon: User },
]

export function Sidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sidebar-primary">
              <Sparkles className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold">SevakSync</span>
              <span className="text-xs text-sidebar-foreground/70">AI Platform</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Theme Toggle & Footer */}
          <div className="border-t border-sidebar-border p-4 space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="h-5 w-5" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="h-5 w-5" />
                  Dark Mode
                </>
              )}
            </Button>
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:bg-red-500/10 hover:text-red-500"
              >
                <LogOut className="h-5 w-5" />
                Logout
              </Button>
            </Link>
            <p className="mt-4 text-xs text-sidebar-foreground/50 text-center">
              © 2024 SevakSync AI
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
