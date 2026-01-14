import { baseApi } from "@/redux/app/baseApi";
const articlesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createArticle: builder.mutation<any , any>({
      query: (article) => ({
        url: "/article",
        method: "POST",
        body: article,
      }),
    }),
    getArticles: builder.query({
      query: () => ({
        url: "/article",
        method: "GET",
      }),
    }),
    getArticle : builder.query<any , string>({
      query:(id)=>`/article/${id}`
    }),
    updateArticle:builder.mutation<any,any>({
      query:(article)=>({
        url:`/article/${article.id}`,
        method:'PATCH',
        body:article.data
      })
    }),
    deleteArticle:builder.mutation<any,string>({
      query:(id)=>({
        url:`article/${id}`,
        method:'DELETE'
      })
    })
  }),
});

export const { useGetArticlesQuery , useCreateArticleMutation , useGetArticleQuery , useUpdateArticleMutation, useDeleteArticleMutation } = articlesApi;