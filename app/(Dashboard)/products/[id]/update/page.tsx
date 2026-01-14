"use client"
import SelectFormEle from "@/components/form/select-form-element"
import TextFormEle from "@/components/form/text-form-element"
import { Button } from "@/components/ui/button"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useGetCategoriesQuery } from "@/redux/features/categories/categoriesApi"
import { useGetProductQuery, useUpdateProductMutation } from "@/redux/features/products/productApi"
import { productSchema, productSchemaFields } from "@/schemas/productSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader } from "lucide-react"
import { useRouter, useParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

const Page = () => {
  const params = useParams()
  const productId = params.id as string  
  const { data: categoriesData, isLoading: isCategoriesLoading, isError: isCategoriesError } = useGetCategoriesQuery()
  const { data: productData, isLoading: isProductLoading, isError: isProductError } = useGetProductQuery((productId))
  const router = useRouter()
  const [updateProduct, { data: updateProductData, isLoading: isUpdateLoading, isError: isUpdateError }] = useUpdateProductMutation()
  
  const form = useForm<productSchemaFields>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: { ar: "", en: "", fr: "" },
      description: { ar: "", en: "", fr: "" },
      category: "",
      image: null,
    },
  })

  // Pre-populate form when product data is loaded
  useEffect(() => {
    if (productData?.data?.product) {
      const product = productData.data.product
      form.reset({
        name: product.name,
        description: product.description,
        category: String(product.category._id),
        image: null, // Keep image as null since we can't pre-populate file input
      })
    }
  }, [productData, form])

  const handleSubmit = async (updateProductData: productSchemaFields) => {
    const formData = new FormData()
    formData.append("name", JSON.stringify(updateProductData.name))
    formData.append("description", JSON.stringify(updateProductData.description))
    formData.append("category", updateProductData.category)
    
    // Only append image if a new one is selected
    if (updateProductData.image) {
      formData.append("image", updateProductData.image as File)
    }
    
    await updateProduct({ id: Number(productId), data: formData as any })
    
    if (!isUpdateError) {
      router.push("/products")
    }
  }

  if (isProductLoading || isCategoriesLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size={48} className="animate-spin" />
      </div>
    )
  }

  if (isProductError || isCategoriesError || !productData?.data?.product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">خطأ في تحميل البيانات</h2>
          <Button onClick={() => router.push("/products")} variant="outline">
            العودة إلى المنتجات
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen container mx-auto py-32 px-4">
      <Card className="w-full shadow-lg mb-8">
        <CardContent className="p-6 md:p-8 pb-8">
          <CardTitle className="text-2xl font-bold mb-6 text-center">تحديث المنتج</CardTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Name per language */}
                <TextFormEle label="الاسم عربي" form={form} name="name.ar" placeholder="اسم المنتج بالعربية" className="w-full" />
                <TextFormEle label="الاسم انجليزي" form={form} name="name.en" placeholder="Product Name in English" className="w-full" />
                <TextFormEle label="الاسم فرنساوي" form={form} name="name.fr" placeholder="Nom du produit en Français" className="w-full" />

                {/* Category */}
                <SelectFormEle
                  form={form}
                  name="category"
                  placeholder="اختر الفئة"
                  className="w-full"
                  options={
                    categoriesData?.data?.categories?.map((category) => ({
                      value: String(category._id),
                      label: category.name["ar"],
                    })) || []
                  }
                />
                
                {/* Image Upload */}
                <FormItem className="flex flex-col space-y-1.5">
                  <FormLabel>صورة المنتج (اختياري للتحديث)</FormLabel>
                  <FormControl>
                    <input
                      type="file"
                      accept="image/*"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-primary file:text-primary-foreground file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      onChange={e => {
                        const file = e.target.files?.[0] || null
                        form.setValue("image", file)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {productData?.data?.product?.image && (
                    <div className="text-sm text-muted-foreground">
                      الصورة الحالية: {productData.data.product.image}
                    </div>
                  )}
                </FormItem>
              </div>

              {/* Description per language */}
              <TextFormEle label="الوصف عربي"  form={form} name="description.ar" placeholder="وصف المنتج بالعربية" className="w-full" />
              <TextFormEle label="الوصف انجليزي" form={form} name="description.en" placeholder="Product Description in English" className="w-full" />
              <TextFormEle label="الوصف فرنساوي" form={form} name="description.fr" placeholder="Description du produit en Français" className="w-full" />

              {/* Submit */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/products")}
                  disabled={isUpdateLoading}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="min-w-[200px] bg-primary hover:bg-primary/90 text-white py-2 rounded-md transition-colors"
                  disabled={isUpdateLoading}
                >
                  {isUpdateLoading ? <Loader size={24} className="animate-spin" /> : "تحديث المنتج"}
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

export default Page