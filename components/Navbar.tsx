"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { Menu, X, Sun, Moon, User, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userRole, setUserRole] = useState<"user" | "provider" | "admin">("user")
  const [userName, setUserName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    // Check for dark mode preference
    const isDarkMode = document.documentElement.classList.contains("dark")
    setIsDark(isDarkMode)

    const loadUser = async () => {
      try {
        const response = await fetch("/api/auth/me")
        if (!response.ok) {
          setIsLoggedIn(false)
          return
        }
        const data = (await response.json()) as {
          user: { role: "user" | "provider" | "admin"; name: string } | null
        }
        if (!data.user) {
          setIsLoggedIn(false)
          return
        }
        setIsLoggedIn(true)
        setUserRole(data.user.role)
        setUserName(data.user.name)

        const profileResponse = await fetch("/api/me/profile")
        if (profileResponse.ok) {
          const profile = (await profileResponse.json()) as { avatar_url?: string }
          setAvatarUrl(profile.avatar_url || "")
        }
      } catch {
        setIsLoggedIn(false)
      }
    }

    loadUser()
  }, [])

  const toggleDarkMode = () => {
    const html = document.documentElement
    if (isDark) {
      html.classList.remove("dark")
      localStorage.setItem("theme", "light")
    } else {
      html.classList.add("dark")
      localStorage.setItem("theme", "dark")
    }
    setIsDark(!isDark)
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setIsLoggedIn(false)
    window.location.href = "/"
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/categories", label: "Categories" },
    { href: "/search", label: "Find Services" },
    ...(isLoggedIn && (userRole === "provider" || userRole === "admin")
      ? [{ href: "/add-listing", label: "List Your Service" }]
      : []),
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="FindIt Namibia"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-primary">
              FindIt <span className="text-foreground">Namibia</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 md:flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-auto gap-3 rounded-full px-2 py-1">
                    <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                      {avatarUrl ? (
                        <img src={avatarUrl} alt={userName} className="h-full w-full object-cover" />
                      ) : (
                        <span className="font-semibold text-primary">{(userName || "U").charAt(0)}</span>
                      )}
                    </div>
                    <div className="hidden text-left sm:block">
                      <p className="max-w-28 truncate text-sm font-semibold text-foreground">{userName || "Account"}</p>
                      <p className="text-xs text-primary capitalize">{userRole}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/account" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  {userRole === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border pt-4">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/account"
                      className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    {userRole === "admin" && (
                      <Link
                        href="/admin"
                        className="block py-2 text-sm font-medium text-muted-foreground hover:text-primary"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="block py-2 text-sm font-medium text-destructive"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
