"use client"
import TextFormEle from "@/components/form/text-form-element"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ClientSchema, ClientSchemaFields } from "@/schemas/clientSchema"
import { useCreateClientMutation } from "@/redux/features/client/clientApi"
import { useRouter } from "next/navigation"
import LoadingProvider from "@/providers/loading-provider"
const Page = () => {
    const router = useRouter();
    const [createClient ,{isError , isLoading ,data:resData }] = useCreateClientMutation()
    const form = useForm<ClientSchemaFields>({
        resolver: zodResolver(ClientSchema),
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            address: '',
            nationality: '',
        }
    })
    const handleSubmit = async (data: ClientSchemaFields) => {
        console.log(data)
        await createClient(data);
        form.reset()
        router.push('/customers')
    }
    return (
        <div className="flex flex-col min-h-screen container mx-auto py-32 px-4">
        <Card className="w-full shadow-lg mb-8">
          <CardContent className="p-6 md:p-8 pb-8">
            <CardTitle className="text-2xl font-bold mb-6 text-center">إضافة عميل جديد</CardTitle>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <TextFormEle 
                    form={form} 
                    name="name" 
                    label="اسم العميل"
                    placeholder="أدخل اسم العميل" 
                    className="w-full" 
                  />
                  <TextFormEle 
                    form={form} 
                    name="email" 
                    label="البريد الإلكتروني"
                    placeholder="أدخل البريد الإلكتروني" 
                    type="email"
                    className="w-full" 
                  />
                  <TextFormEle 
                    form={form} 
                    name="phone" 
                    label="رقم الهاتف"
                    placeholder="أدخل رقم الهاتف" 
                    className="w-full" 
                  />
                  <TextFormEle 
                    form={form} 
                    name="address" 
                    label="العنوان"
                    placeholder="أدخل العنوان" 
                    className="w-full" 
                  />
                  <TextFormEle 
                    form={form} 
                    name="nationality" 
                    label="الجنسيه"
                    placeholder="أدخل العنوان" 
                    className="w-full" 
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="min-w-[200px] bg-primary hover:bg-primary/90 text-white py-2 rounded-md transition-colors"
                  >
                    {isLoading ? <Loader size={24} className="animate-spin" /> : "إضافة عميل"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    )
}

export default Page
