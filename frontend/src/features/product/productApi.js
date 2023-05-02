import { apiSlice } from "../apis/apiSlice"

const productApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProduct: builder.query({
            query: () => `/products`,
            providesTags:['getProducts']
        })
    })
})
export const {useGetProductQuery} = productApi