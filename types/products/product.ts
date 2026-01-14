import { ICategory } from "../category/category";

export interface IProduct {
    category:ICategory,
    _id: string
    name: {
        ar: string
        en: string
        fr: string
    }
    description: {
        ar: string
        en: string
        fr: string
    }
    image:string
}