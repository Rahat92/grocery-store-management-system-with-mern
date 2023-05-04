import { apiSlice } from "../apis/apiSlice"

const productApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProduct: builder.query({
            query: () => `/products`,
            providesTags:['getProducts'],
            transformResponse: (response) => {
                
                return response
            }
        }),
        
    })
})
export const {useGetProductQuery} = productApi