import { RootState } from './store';
import { BASE_URL } from "@/constants/constants";
import { createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { toast } from 'sonner';

interface ErrorResponse {
    message: string;
    status: boolean;
}

  // Define success response type with a dynamic DT
export interface SuccessResponse<DataType = any> {
    data: DataType;
    message: string;
    status: boolean;
}

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL ,
    prepareHeaders:(headers , {getState})=>{
        const token = (getState() as RootState).auth.access_token;
        if(token) headers.set('authorization', `Bearer ${token}`)
        return headers;
    }
})


const baseQueryWithInterceptor: typeof baseQuery = async (
    args,
    api,
    extraOptions
) => {
    const result = await baseQuery(args, api, extraOptions);
    const method = typeof args === "string" ? "GET" : args.method || "GET";
    // console.log(method, result);
    if (!!result.error)
    toast.error((result.error?.data as ErrorResponse).message);
    if (!!result.data && method != "GET")
    toast.success((result.data as SuccessResponse<any>).message);
    return result;
};

export const baseApi = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithInterceptor,
    tagTypes: ["Client" , "Products" , "Categories" , 'Subscriptions' , 'ClientSubscriptions'],
    endpoints: () => ({}),
});