import { baseApi, SuccessResponse } from "@/redux/app/baseApi";
import { ISubscription } from "@/types/subscription/subscription";

export const subscriptionsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getSubscriptions: builder.query<SuccessResponse<{subscriptions:ISubscription[]}> , void>({
            query: () => "/subscriptions",
            providesTags: ["Subscriptions"],
        }),
        addSubscription: builder.mutation({
            query: (newSubscription) => ({
                url: "/subscriptions",
                method: "POST",
                body: newSubscription,
            }),
            invalidatesTags: ["Subscriptions"],
        }),
        deleteSubscription: builder.mutation({
            query: (id) => ({
                url: `/subscriptions/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Subscriptions"],
        }),

        createClientSubscription: builder.mutation({
            query: (newSubscription) => ({
                url: "/client-subscription",
                method: "POST",
                body: newSubscription,
            }),
            invalidatesTags: ["ClientSubscriptions"],
        }),
    })
})
export const { useGetSubscriptionsQuery, useAddSubscriptionMutation, useDeleteSubscriptionMutation , useCreateClientSubscriptionMutation } = subscriptionsApi;