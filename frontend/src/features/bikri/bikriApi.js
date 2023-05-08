import { apiSlice } from "../apis/apiSlice"

const bikriApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        buyProduct: builder.mutation({
            query: (cartObj) => ({
                url: `/bikri`,
                method: 'POST',
                body: cartObj
            }),
            // invalidatesTags:['getProducts'],
            async onQueryStarted(args, {dispatch, queryFulfilled}) {
                try{
                    console.log(args);
                    const { data: newCart} = await queryFulfilled;
                    args.productId.map((el, i) => {
                        dispatch(
                            apiSlice.util.updateQueryData('getProduct', undefined, (products) => {
                                const product = products.find(product=>product._id == el)
                                product.quantity = product.quantity - newCart.newBikri.quantity[i]
                            })
                        )
                    })
                }catch(err){
                    //do nothing
                }
            }
        }),
        getCustomerBikris: builder.query({
            query: ({customerId, page}) => `/bikri/customer/${customerId}?page=${page}`,
            transformResponse: (response) => {
                const customerBikri = response.customerBikri.sort((a, b) => {
                    if (a.cartAt > b.cartAt) {
                        return -1;
                    }
                    if (b.cartAt > a.cartAt) {
                        return 1;
                    }
                    return 0;
                })
                const pages = response.pages
                return {
                    customerBikri,
                    pages
                }
            }
        })
    })
})
export const {useBuyProductMutation, useGetCustomerBikrisQuery} = bikriApi;