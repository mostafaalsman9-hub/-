import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Droplets, LogOut, Menu, UserCircle, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const navItems = user ? (
    user.role === "admin" ? [
      { href: "/admin", label: "لوحة التحكم" },
      { href: "/admin/users", label: "المستخدمين" },
      { href: "/admin/courses", label: "الدورات" },
      { href: "/admin/announcements", label: "الإعلانات" },
      { href: "/admin/videos", label: "الفيديوهات" },
      { href: "/admin/pdfs", label: "الملفات" },
      { href: "/admin/settings", label: "الإعدادات" },
      { href: "/admin/contact", label: "تواصل معنا (تعديل)" },
    ] : [
      { href: "/dashboard", label: "لوحة الطالب" },
      { href: "/contact", label: "تواصل معنا" },
    ]
  ) : [
    { href: "/", label: "الرئيسية" },
    { href: "/contact", label: "تواصل معنا" },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between mx-auto px-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold font-heading">د. علي سعد</span>
            </Link>
            <nav className="hidden md:flex gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location === item.href ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.fullName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4 ml-2" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex gap-2">
                <Link href="/login" className="text-sm font-medium hover:text-primary pt-2">
                  تسجيل الدخول
                </Link>
                <Link href="/register">
                  <Button size="sm">حساب جديد</Button>
                </Link>
              </div>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">قائمة</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 py-6">
                  <Link href="/" className="flex items-center gap-2">
                    <Droplets className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold">د. علي سعد</span>
                  </Link>
                  <nav className="flex flex-col gap-4">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-sm font-medium transition-colors hover:text-primary ${
                          location === item.href ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    {!user && (
                      <>
                        <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
                          تسجيل الدخول
                        </Link>
                        <Link href="/register" className="text-sm font-medium text-primary">
                          إنشاء حساب
                        </Link>
                      </>
                    )}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-16 md:flex-row mx-auto px-4">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            جميع الحقوق محفوظة © 2026 #ابوالسمان
          </p>
        </div>
      </footer>
    </div>
  );
}
