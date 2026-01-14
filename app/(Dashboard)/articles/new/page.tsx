"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextFormEle from "@/components/form/text-form-element";
import TipTapFormElement from "@/components/form/tiptap-form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useCreateArticleMutation } from "@/redux/features/articles/articlesApi";
import { useRouter } from "next/navigation";

// Zod schema for article creation
const articleSchema = z.object({
  title: z.object({
    ar: z.string().min(1, "العنوان بالعربية مطلوب"),
    en: z.string().min(1, "Title in English is required"),
    fr: z.string().min(1, "Titre en français requis"),
  }),
  content: z.object({
    ar: z.string().min(1, "المحتوى بالعربية مطلوب"),
    en: z.string().min(1, "Content in English is required"),
    fr: z.string().min(1, "Contenu en français requis"),
  }),
  category:z.object({
    ar: z.string().optional(),
    en: z.string().optional(),
    fr: z.string().optional(),
  }),
  image: z.any().optional(), // Accepts File or undefined
});

type ArticleFormFields = z.infer<typeof articleSchema>;

const Page = () => {
  const router = useRouter()
  const form = useForm<ArticleFormFields>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: { ar: "", en: "", fr: "" },
      content: { ar: "", en: "", fr: "" },
      category:{ ar: "", en: "", fr: "" },
      image: undefined,
    },
  });
  const [createArticle, { isLoading }] = useCreateArticleMutation();

  const handleSubmit = async (data: ArticleFormFields) => {
    // For now, just log the data
    const formData = new FormData();
    formData.append("title", JSON.stringify(data.title));
    formData.append("content", JSON.stringify(data.content));
    formData.append("category" , JSON.stringify(data.category))
    if (data.image && data.image instanceof File) {
      formData.append("image", data.image);
    }
    const res = await createArticle(formData);
    if(res.data){
      router.push('/articles')
    }
    console.log(res);
  };

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-8 px-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextFormEle
                  form={form}
                  name="title.ar"
                  label="العنوان بالعربية"
                  placeholder="أدخل عنوان المقال بالعربية"
                  className="w-full"
                />
                <TextFormEle
                  form={form}
                  name="title.en"
                  label="Title in English"
                  placeholder="Enter article title in English"
                  className="w-full"
                />
                <TextFormEle
                  form={form}
                  name="title.fr"
                  label="Titre en Français"
                  placeholder="Entrez le titre de l'article en français"
                  className="w-full"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TextFormEle
                  form={form}
                  name="category.ar"
                  label="التصنيف بالعربية"
                  placeholder="أدخل التصنيف المقال بالعربية"
                  className="w-full"
                />
                <TextFormEle
                  form={form}
                  name="category.en"
                  label="category in English"
                  placeholder="Enter article category in English"
                  className="w-full"
                />
                <TextFormEle
                  form={form}
                  name="category.fr"
                  label="Titre en Français"
                  placeholder="Entrez le titre de l'article en français"
                  className="w-full"
                />
              </div>
              {/* Content */}
              <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                <TipTapFormElement
                  form={form}
                  name="content.ar"
                  label="المحتوى بالعربية"
                  placeholder="أدخل محتوى المقال بالعربية"
                  className="w-full"
                  minHeight="180px"
                />
                <TipTapFormElement
                  form={form}
                  name="content.en"
                  label="Content in English"
                  placeholder="Enter article content in English"
                  className="w-full"
                  minHeight="180px"
                />
                <TipTapFormElement
                  form={form}
                  name="content.fr"
                  label="Contenu en Français"
                  placeholder="Entrez le contenu de l'article en français"
                  className="w-full"
                  minHeight="180px"
                />
              </div>
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">صورة المقال (اختياري)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    form.setValue("image", file);
                  }}
                  className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
              </div>
              <Button type="submit" className="w-full">إنشاء المقال</Button>
            </form>
          </Form>
    </div>
  );
};

export default Page;