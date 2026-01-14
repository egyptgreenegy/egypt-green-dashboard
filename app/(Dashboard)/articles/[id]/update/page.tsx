"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import TextFormEle from "@/components/form/text-form-element";
import TipTapFormElement from "@/components/form/tiptap-form-element";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useGetArticleQuery, useUpdateArticleMutation } from "@/redux/features/articles/articlesApi";
import { useParams, useRouter } from "next/navigation";

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
  image: z.any().optional(),
});

type ArticleFormFields = z.infer<typeof articleSchema>;

const UpdateArticlePage = () => {
  const params = useParams();
  const router = useRouter();
  const articleId = params.id as string;
  const { data, isLoading, isError } = useGetArticleQuery(articleId);
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const article = data?.data?.article || {}
  const form = useForm<ArticleFormFields>({
    resolver: zodResolver(articleSchema),
  });
  

  // Pre-populate form when article data is loaded
  useEffect(() => {
    if (data?.data.article) {
        console.log(data.data.article.content['ar']);
        
      const article = data.data.article;
      form.reset({
        title: article.title ,
        content: article.content,
        category:article.category,
        image: undefined, // Can't prefill file input
      });
    }
  }, [data, form]);

  const handleSubmit = async (formData: ArticleFormFields) => {
    const submitData = new FormData();
    submitData.append("id", articleId);
    submitData.append("title", JSON.stringify(formData.title));
    submitData.append("content", JSON.stringify(formData.content));
    if (formData.image && formData.image instanceof File) {
      submitData.append("image", formData.image);
    }
    await updateArticle({
        id:articleId,
        data:submitData
    });
    router.push("/articles");
  };

  // Only render the form when article data is loaded
  if (isLoading) {
    return <div className="p-4">جاري تحميل بيانات المقال...</div>;
  }
  if (isError || !data?.data?.article) {
    return <div className="p-4 text-red-600">حدث خطأ أثناء جلب بيانات المقال.</div>;
  }

  return (
    <div className="flex flex-col min-h-screen max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">تعديل المقال</h1>
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
            {article.imageUrl && (
              <div className="mb-4">
                <img
                  src={article.imageUrl.startsWith("http") ? article.imageUrl : `/` + article.imageUrl.replace(/^\/+/, "")}
                  alt="صورة المقال"
                  className="max-w-xs max-h-48 rounded border mb-2"
                />
                <div className="text-xs text-gray-500">الصورة الحالية</div>
              </div>
            )}
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
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.push("/articles")} disabled={isUpdating}>
              إلغاء
            </Button>
            <Button type="submit" className="min-w-[200px] bg-primary hover:bg-primary/90 text-white py-2 rounded-md transition-colors" disabled={isUpdating}>
              {isUpdating ? "جاري التحديث..." : "تحديث المقال"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default UpdateArticlePage; 