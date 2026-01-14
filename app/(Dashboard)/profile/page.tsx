"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"

interface User {
  name: string
  email: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // محاكاة استدعاء API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // تحديث التخزين المحلي
      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
      }

      toast({
        title: "تم تحديث الملف الشخصي",
        description: "تم تحديث ملفك الشخصي بنجاح.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "فشل التحديث",
        description: "حدث خطأ أثناء تحديث ملفك الشخصي.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent\"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">الملف الشخصي</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>المعلومات الشخصية</CardTitle>
                <CardDescription>قم بتحديث معلوماتك الشخصية هنا.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">الاسم</Label>
                  <Input id="name" value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">البريد الإلكتروني</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
                </Button>
              </CardFooter>
            </form>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>الحساب</CardTitle>
              <CardDescription>إدارة إعدادات حسابك.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-sm font-medium">تغيير كلمة المرور</h3>
                <Button variant="outline" className="w-full">
                  تغيير كلمة المرور
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium">المصادقة الثنائية</h3>
                <Button variant="outline" className="w-full">
                  تفعيل المصادقة الثنائية
                </Button>
              </div>
              <Separator />
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-red-600">منطقة الخطر</h3>
                <Button variant="destructive" className="w-full">
                  حذف الحساب
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
