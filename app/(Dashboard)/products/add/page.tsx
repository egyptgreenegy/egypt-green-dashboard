"use client"

import SelectFormEle from "@/components/form/select-form-element"
import TextFormEle from "@/components/form/text-form-element"
import TipTapFormElement from "@/components/form/tiptap-form-element"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApi"
import { useAddProductMutation } from "@/redux/features/products/productApi"
import { productSchema, type productSchemaFields } from "@/schemas/productSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader, FileText, Globe } from "lucide-react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

const Page = () => {
  const { data, isLoading, isError } = useGetCategoriesQuery()
  const router = useRouter()
  const [addProduct, { data: addProductData, isLoading: isAddLoading, isError: isAddError }] = useAddProductMutation()

  const form = useForm<productSchemaFields>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: { ar: "", en: "", fr: "" },
      description: { ar: "", en: "", fr: "" },
      category: "",
      image: null,
    },
  })

  const handleSubmit = async (createProductData: productSchemaFields) => {
    try {
      const formData = new FormData()

      // Convert descriptions to ensure they're properly formatted
      const processedDescriptions = {
        ar: createProductData.description.ar || "",
        en: createProductData.description.en || "",
        fr: createProductData.description.fr || "",
      }

      formData.append("name", JSON.stringify(createProductData.name))
      formData.append("description", JSON.stringify(processedDescriptions))
      formData.append("category", createProductData.category)

      if (createProductData.image) {
        formData.append("image", createProductData.image as File)
      }

      await addProduct(formData)

      if (!isAddError) {
        form.reset()
        router.push("/products")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen max-w-6xl mx-auto py-8 px-4 overflow-y-auto">
      <Card className="w-full shadow-lg mb-8 overflow-y-auto">
        <CardContent className="p-6 md:p-8 overflow-y-auto">
          <CardTitle className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
            <FileText className="h-6 w-6" />
            اضافه منتج جديد
          </CardTitle>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">المعلومات الأساسية</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Product Names */}
                  <TextFormEle form={form} name="name.ar" placeholder="اسم المنتج بالعربية" className="w-full" />
                  <TextFormEle form={form} name="name.en" placeholder="Product Name in English" className="w-full" />
                  <TextFormEle form={form} name="name.fr" placeholder="Nom du produit en Français" className="w-full" />

                  {/* Category Selection */}
                  <SelectFormEle
                    form={form}
                    name="category"
                    placeholder="اختر الفئة"
                    className="w-full"
                    options={
                      data?.data?.categories?.map((category) => ({
                        value: String(category._id),
                        label: category.name["ar"],
                      })) || []
                    }
                  />

                  {/* Image Upload */}
                  <FormItem className="flex flex-col space-y-1.5">
                    <FormLabel className="text-sm font-medium text-gray-700">صورة المنتج</FormLabel>
                    <FormControl>
                      <input
                        type="file"
                        accept="image/*"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-primary file:text-primary-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null
                          form.setValue("image", file)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              </div>

              <Separator />

              {/* Product Descriptions Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold text-gray-900">وصف المنتج</h3>
                  <span className="text-sm text-gray-500">(يمكنك استخدام التنسيق المتقدم)</span>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  {/* Arabic Description */}
                  <TipTapFormElement
                    form={form}
                    name="description.ar"
                    label="الوصف بالعربية"
                    placeholder="اكتب وصفاً مفصلاً للمنتج بالعربية..."
                    className="w-full"
                    minHeight="250px"
                  />

                  {/* English Description */}
                  <TipTapFormElement
                    form={form}
                    name="description.en"
                    label="Description in English"
                    placeholder="Write a detailed product description in English..."
                    className="w-full"
                    minHeight="250px"
                  />

                  {/* French Description */}
                  <TipTapFormElement
                    form={form}
                    name="description.fr"
                    label="Description en Français"
                    placeholder="Écrivez une description détaillée du produit en français..."
                    className="w-full"
                    minHeight="250px"
                  />
                </div>
              </div>

              <Separator />

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  className="min-w-[200px] bg-primary hover:bg-primary/90 text-white py-3 px-6 rounded-md transition-colors font-medium"
                  disabled={isAddLoading}
                >
                  {isAddLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader size={20} className="animate-spin" />
                      جاري الحفظ...
                    </div>
                  ) : (
                    "اضافه منتج"
                  )}
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
