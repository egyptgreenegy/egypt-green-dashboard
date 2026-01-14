import { IClient } from '@/types/clients/client';
import { ClientSchema, ClientSchemaFields } from './../../../schemas/clientSchema';
import { baseApi, SuccessResponse } from "@/redux/app/baseApi";

const clientApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createClient: builder.mutation<SuccessResponse<IClient> ,ClientSchemaFields >({
            query: (data) => {
                return {
                    url: '/client',
                    method: 'POST',
                    body: data,
                }
            },
            invalidatesTags: ['Client'],
        }),
        getClients: builder.query<SuccessResponse<{clients:IClient[]}>, void>({
            query: () => '/client',
            providesTags: ['Client'],
        })
    })
})
export const { useCreateClientMutation, useGetClientsQuery } = clientApi;