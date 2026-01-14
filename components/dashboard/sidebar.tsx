"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Blocks,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  FileText,
  HandCoins,
  Home,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Users,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  className?: string
}

interface RouteItem {
  title: string
  icon: React.ElementType
  href: string
  isActive: boolean
  subItems?: {
    title: string
    href: string
    isActive: boolean
  }[]
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})
  const pathname = usePathname()

  // إغلاق الشريط الجانبي للجوال عند تغيير المسار
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // إغلاق الشريط الجانبي للجوال عند تغيير حجم الشاشة إلى سطح المكتب
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const routes: RouteItem[] = [
    {
      title: "لوحة التحكم",
      icon: LayoutDashboard,
      href: "/",
      isActive: pathname === "/",
    },
    {
      title: "التحليلات",
      icon: BarChart3,
      href: "/analytics",
      isActive: pathname === "/analytics",
    },
    {
      title: "العملاء",
      icon: Users,
      href: "/customers",
      isActive: pathname.startsWith("/customers"),
      subItems: [
        {
          title: "قائمة العملاء",
          href: "/customers",
          isActive: pathname === "/customers",
        },
        {
          title: "إضافة عميل",
          href: "/customers/add",
          isActive: pathname === "/customers/add",
        },
      ],
    },
    {
      title: "المنتجات",
      icon: Package,
      href: "/products",
      isActive: pathname.startsWith("/products"),
      subItems: [
        {
          title: "قائمة المنتجات",
          href: "/products",
          isActive: pathname === "/products",
        },
        {
          title: "إضافة منتج",
          href: "/products/add",
          isActive: pathname === "/products/add",
        },
      ],
    },
    {
      title: "التصنيفات",
      icon: Blocks,
      href: "/categories",
      isActive: pathname === "/categories",
    },
    {
      title: "المقالات",
      icon: FileText,
      href: "/articles",
      subItems: [
        {
          title: "قائمة المقالات",
          href: "/articles",
          isActive: pathname === "/articles",
        },
        {
          title: "إضافة مقال",
          href: "/articles/new",
          isActive: pathname === "/articles/new",
        },
      ],
      isActive: pathname.startsWith("/articles"),
    },
    {
      title: "الإعدادات",
      icon: Settings,
      href: "/settings",
      isActive: pathname === "/settings",
    },
  ]

  // تبديل الشريط الجانبي للجوال
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen)
  }

  // تبديل طي الشريط الجانبي لسطح المكتب
  const toggleCollapse = () => {
    setCollapsed(!collapsed)
  }

  // تبديل حالة القائمة المنسدلة
  const toggleDropdown = (title: string) => {
    if (collapsed) return // لا تفتح القوائم المنسدلة في الوضع المطوي

    setOpenDropdowns((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  // التحقق مما إذا كانت القائمة المنسدلة مفتوحة
  const isDropdownOpen = (title: string) => {
    return !!openDropdowns[title]
  }

  return (
    <>
      {/* زر تبديل الشريط الجانبي للجوال */}
      <Button variant="ghost" size="icon" className="lg:hidden fixed top-4 right-4 z-50" onClick={toggleMobileSidebar}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">تبديل الشريط الجانبي</span>
      </Button>

      {/* طبقة التغطية للشريط الجانبي للجوال */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* الشريط الجانبي */}
      <aside
        className={cn(
          "fixed top-0 right-0 z-40 h-full bg-background border-l transition-all duration-300 ease-in-out",
          collapsed ? "w-16" : "w-64",
          mobileOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0",
          className,
        )}
      >
        {/* رأس الشريط الجانبي */}
        <div className="flex h-14 items-center justify-between px-4 border-b">
          <div className="flex items-center">
            {/* زر إغلاق للجوال */}
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setMobileOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">إغلاق الشريط الجانبي</span>
            </Button>

            {/* زر طي لسطح المكتب */}
            <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={toggleCollapse}>
              {collapsed ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
              <span className="sr-only">{collapsed ? "توسيع الشريط الجانبي" : "طي الشريط الجانبي"}</span>
            </Button>
          </div>

          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            {!collapsed && <span>لوحة التحكم</span>}
            <Home className="h-6 w-6" />
          </Link>
        </div>

        {/* محتوى الشريط الجانبي */}
        <div className="flex flex-col h-[calc(100%-3.5rem)] overflow-y-auto">
          {/* التنقل الرئيسي */}
          <nav className="flex-1 px-2 py-4">
            <ul className="space-y-1">
              {routes.map((route) => (
                <li key={route.href} className={route.subItems ? "mb-1" : ""}>
                  {route.subItems ? (
                    <div>
                      <button
                        onClick={() => toggleDropdown(route.title)}
                        className={cn(
                          "flex items-center w-full font-semibold text-black/80 gap-3 px-3 py-2 rounded-md transition-colors",
                          route.isActive || isDropdownOpen(route.title) ? "bg-primary/10" : "hover:bg-muted",
                          collapsed ? "justify-center" : "justify-start",
                        )}
                        title={collapsed ? route.title : undefined}
                      >
                        <route.icon className="h-5 w-5 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-right">{route.title}</span>
                            {isDropdownOpen(route.title) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </>
                        )}
                      </button>

                      {/* القائمة المنسدلة */}
                      {!collapsed && isDropdownOpen(route.title) && (
                        <ul className="mt-1 mr-4 pr-2 border-r">
                          {route.subItems.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className={cn(
                                  "flex items-center text-black/80 gap-2 px-3 py-2 rounded-md transition-colors text-sm",
                                  subItem.isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                                )}
                              >
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                <span>{subItem.title}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : (
                    <Link
                      href={route.href}
                      className={cn(
                        "flex items-center font-semibold text-black/80 gap-3 px-3 py-2 rounded-md transition-colors",
                        route.isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                        collapsed ? "justify-center" : "justify-start",
                      )}
                      title={collapsed ? route.title : undefined}
                    >
                      <route.icon className="h-5 w-5 flex-shrink-0" />
                      {!collapsed && <span>{route.title}</span>}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* تذييل */}
          <div className="mt-auto px-2 py-4 border-t">
            <ul className="space-y-1">
              <li>
                <Link
                  href="/dashboard/help"
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors hover:bg-muted",
                    pathname === "/dashboard/help" && "bg-muted",
                    collapsed ? "justify-center" : "justify-end",
                  )}
                  title={collapsed ? "المساعدة والدعم" : undefined}
                >
                  <div className="">
                    <h3 className="text-md font-bold text-muted-foreground/90">
                      <span className="font-extrabold bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                        ZED
                      </span>
                    </h3>
                  </div>
                  {!collapsed && <span>المساعدة والدعم</span>}
                  <LifeBuoy className="h-5 w-5 flex-shrink-0" />
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
    </>
  )
}
