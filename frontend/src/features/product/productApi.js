import { apiSlice } from "../apis/apiSlice"

const productApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProduct: builder.query({
            query: () => `/products`,
            providesTags:['getProducts'],
            transformResponse: (response) => {
                console.log(response);
                return response.products.sort((a,b) => {
                    if (a.name > b.name) {
                        return -1;
                    }
                    if (b.name > a.name) {
                        return 1;
                    }
                    return 0;
                })
            }
        }),
        
    })
})
export const {useGetProductQuery} = productApi