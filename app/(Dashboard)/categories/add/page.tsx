"use client";
import TextFormEle from "@/components/form/text-form-element";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { useAddCategoryMutation } from "@/redux/features/categories/categoriesApi";
import { categorySchema, categorySchemaFields } from "@/schemas/categorySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

const Page = () => {
  const router = useRouter();
  const [addCategory, { isLoading: isAddLoading, isError: isAddError }] = useAddCategoryMutation();
  
  const form = useForm<categorySchemaFields>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: { ar: "", en: "", fr: "" },
      description: { ar: "", en: "", fr: "" },
    },
  });

  const handleSubmit = async (createCategoryData: categorySchemaFields) => {
    try {
        console.log(createCategoryData);
        // Create the request data
        // Send the request to create a new category
        await addCategory(createCategoryData);
        if(!isAddError){
            form.reset();
            router.push("/categories");
        }
        } catch (error) {
        console.error("Error adding category:", error);
        }
  };

  return (
    <div className="flex flex-col min-h-screen container mx-auto py-32 px-4">
      <Card className="w-full shadow-lg mb-8">
        <CardContent className="p-6 md:p-8 pb-8">
          <CardTitle className="text-2xl font-bold mb-6 text-center">اضافة تصنيف جديد</CardTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Name per language */}
                <TextFormEle 
                  form={form} 
                  name="name.ar" 
                  label="الاسم بالعربية"
                  placeholder="اسم التصنيف بالعربية" 
                  className="w-full" 
                />
                <TextFormEle 
                  form={form} 
                  name="name.en" 
                  label="Name in English"
                  placeholder="Category Name in English" 
                  className="w-full" 
                />
                <TextFormEle 
                  form={form} 
                  name="name.fr" 
                  label="Nom en Français"
                  placeholder="Nom de catégorie en Français" 
                  className="w-full" 
                />
              </div>

              {/* Description per language */}
              <div className="grid grid-cols-1 gap-4">
                <TextFormEle 
                  form={form} 
                  name="description.ar" 
                  label="الوصف بالعربية"
                  placeholder="وصف التصنيف بالعربية" 
                  className="w-full" 
                />
                <TextFormEle 
                  form={form} 
                  name="description.en" 
                  label="Description in English"
                  placeholder="Category Description in English" 
                  className="w-full" 
                />
                <TextFormEle 
                  form={form} 
                  name="description.fr" 
                  label="Description en Français"
                  placeholder="Description de catégorie en Français" 
                  className="w-full" 
                />
              </div>

              {/* Submit and Cancel Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/categories")}
                  disabled={isAddLoading}
                >
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  className="min-w-[200px] bg-primary hover:bg-primary/90 text-white py-2 rounded-md transition-colors"
                  disabled={isAddLoading}
                >
                  {isAddLoading ? <Loader size={24} className="animate-spin" /> : "اضافة تصنيف"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;