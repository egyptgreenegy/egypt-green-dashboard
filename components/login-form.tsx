"use client"
import type React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema, loginSchemaFields } from "@/schemas/loginSchema"
import TextFormEle from "./form/text-form-element"
import { useLoginMutation } from "@/redux/features/auth/authApi"
import { LoginDto } from "@/types/auth/auth"
import { handleReqWithToaster } from "@/lib/handle-req-with-toaster"

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<loginSchemaFields>({
    resolver: zodResolver(loginSchema),
    defaultValues:{
      email: "",
      password: ""
    }
  })
  const [login, { data: resData, isLoading , isError }] = useLoginMutation();
  const handleSubmit = async (data:loginSchemaFields) => {
      handleReqWithToaster('جاري تسجيل الدخول', async () => {
      const res = await login(data).unwrap();
      router.push("/")
    })
  }

  return (
  <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني</Label>
            <TextFormEle
              form={form}
              name="email"
              type="email"
              placeholder="ادخل بريدك الالكتروني"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">كلمة المرور</Label>
              <Button variant="link" className="px-0 font-normal h-auto" type="button">
                نسيت كلمة المرور؟
              </Button>
            </div>
            <TextFormEle type="password" form={form} name="password" placeholder="ادخل كلمه المرور" />
          </div>
          <Button type="submit" className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </Button>
        </form>
      </Form>
  </div>
  )
}
