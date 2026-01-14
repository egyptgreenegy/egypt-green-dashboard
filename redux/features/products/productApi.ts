import { baseApi, SuccessResponse } from "@/redux/app/baseApi";
import { productSchemaFields } from "@/schemas/productSchema";
import { IProduct } from "@/types/products/product";

const productApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query<SuccessResponse<{products:IProduct[]}> , void>({
            query: () => '/product',
            providesTags: ['Products']
        }),
        getProduct: builder.query<SuccessResponse<{product:IProduct}> , string>({
            query: (id) => `/product/${id}`,
        }),
        addProduct:builder.mutation<SuccessResponse<{product:IProduct}> , any>({
            query: (data) => ({
                url: `/product`,
                method: 'POST',
                body:data
            }),
            invalidatesTags: ['Products']
        }),
        updateProduct: builder.mutation<SuccessResponse<{product:IProduct}> , {id:number , data:productSchemaFields}>({
            query: ({ id, data }) => ({
                url: `/product/${id}`,
                method: 'PATCH',
                body:data
            }),
            invalidatesTags: ['Products']
        }),
        deleteProduct: builder.mutation<SuccessResponse<{product:IProduct}> , string>({
            query: (id) => ({
                url: `/product/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Products']
        }),
    })
})
export const { useGetProductsQuery, useGetProductQuery, useAddProductMutation, useUpdateProductMutation , useDeleteProductMutation } = productApi