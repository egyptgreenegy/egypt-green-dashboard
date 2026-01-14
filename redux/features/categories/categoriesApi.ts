import { baseApi, SuccessResponse } from "@/redux/app/baseApi";
import { ICategory } from "@/types/category/category";

export const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<SuccessResponse<{categories:ICategory[]}> , void>({
        query: () => '/category',
        providesTags: ["Categories"],
        }),
        getCategory: builder.query<SuccessResponse<{category:ICategory}> , string >({
        query: (id) =>`/category/${id}`,
        }),
        addCategory: builder.mutation({
        query: (data: any) => ({
            url: `/category`,
            method: "POST",
            body: data,
        }),
        invalidatesTags: ["Categories"],
        }),
        updateCategory: builder.mutation({
        query: ({id, data}: {id: string, data: any}) => ({
            url: `/category/${id}`,
            method: "PUT",
            body: data,
        }),
        invalidatesTags:['Categories']
        }),
        deleteCategory: builder.mutation({
        query: (id: string) => ({
            url: `/category/${id}`,
            method: "DELETE",
        }),
        invalidatesTags: ['Categories']
        }),
    }),
})

export const {useAddCategoryMutation , useGetCategoriesQuery , useGetCategoryQuery , useUpdateCategoryMutation , useDeleteCategoryMutation} = categoriesApi