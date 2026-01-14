import { z } from "zod";

export const categorySchema = z.object({
    name: z.object({
        ar: z.string().min(1, "الاسم بالعربية مطلوب"),
        en: z.string().min(1, "Name in English is required"),
        fr: z.string().min(1, "Nom en français est requis"),
    }),
    description: z.object({
        ar: z.string().min(1, "الوصف بالعربية مطلوب"),
        en: z.string().min(1, "Description in English is required"),
        fr: z.string().min(1, "Description en français est requis"),
    }),
});

export type categorySchemaFields = z.infer<typeof categorySchema>;