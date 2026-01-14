'use client';
import TextFormEle from "@/components/form/text-form-element"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import { useGetCategoryQuery, useUpdateCategoryMutation } from "@/redux/features/categories/categoriesApi"
import { categorySchema, categorySchemaFields } from "@/schemas/categorySchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

const UpdateCategoryPage = () => {
  const params = useParams()
  const categoryId = params.id as string  
  const { data: categoryData, isLoading: isCategoryLoading, isError: isCategoryError } = useGetCategoryQuery(categoryId)
  const router = useRouter()
  const [updateCategory, { isLoading: isUpdateLoading, isError: isUpdateError }] = useUpdateCategoryMutation()
  
  const form = useForm<categorySchemaFields>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: { ar: "", en: "", fr: "" },
      description: { ar: "", en: "", fr: "" },
    },
  })

  // Pre-populate form when category data is loaded
  useEffect(() => {
    if (categoryData?.data?.category) {
      const category = categoryData.data.category
      form.reset({
        name: category.name,
        description: category.description,
      })
    }
  }, [categoryData, form])

  const handleSubmit = async (updateCategoryData: categorySchemaFields) => {
    
    await updateCategory({id:categoryId , data:updateCategoryData})
    
    if (!isUpdateError) {
      router.push("/categories")
    }
  }

  if (isCategoryLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={48} className="animate-spin" />
      </div>
    )
  }

  if (isCategoryError || !categoryData?.data?.category) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">خطأ في تحميل البيانات</h2>
          <Button onClick={() => router.push("/categories")} variant="outline">
            العودة إلى الفئات
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen container mx-auto py-32 px-4">
      <Card className="w-full shadow-lg mb-8">
        <CardContent className="p-6 md:p-8 pb-8">
          <CardTitle className="text-2xl font-bold mb-6 text-center">تحديث الفئة</CardTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name per language */}
                <TextFormEle label="الاسم عربي" form={form} name="name.ar" placeholder="اسم الفئة بالعربية" className="w-full" />
                <TextFormEle label="الاسم انجليزي" form={form} name="name.en" placeholder="Category Name in English" className="w-full" />
                <TextFormEle label="الاسم فرنساوي" form={form} name="name.fr" placeholder="Nom de catégorie en Français" className="w-full" />
              </div>

              {/* Description per language */}
              <TextFormEle label="الوصف عربي" form={form} name="description.ar" placeholder="وصف الفئة بالعربية" className="w-full" />
              <TextFormEle label="الوصف انجليزي" form={form} name="description.en" placeholder="Category Description in English" className="w-full" />
              <TextFormEle label="الوصف فرنساوي" form={form} name="description.fr" placeholder="Description de catégorie en Français" className="w-full" />

              {/* Submit */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/categories")}
                  disabled={isUpdateLoading}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="min-w-[200px] bg-primary hover:bg-primary/90 text-white py-2 rounded-md transition-colors"
                  disabled={isUpdateLoading}
                >
                  {isUpdateLoading ? <Loader size={24} className="animate-spin" /> : "تحديث الفئة"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <div className="flex-grow py-4"></div>
    </div>
  )
}

export default UpdateCategoryPage