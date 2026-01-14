export interface ICategory {
    _id:string;
    name:{
        ar: string;
        en: string;
        fr: string;
    };
    description: {
        ar: string;
        en: string;
        fr: string;
    }
    createdAt: string
    updatedAt: string
}