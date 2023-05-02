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
                    console.log(newCart)
                    console.log(newCart.productId);
                    console.log(args.productId);
                    args.productId.map((el, i) => {
                        dispatch(
                            apiSlice.util.updateQueryData('getProduct', undefined, (products) => {
                                const product = products?.products.find(product=>product._id == el)
                                product.quantity = product.quantity - newCart.newBikri.quantity[i]
                            })
                        )
                    })
                }catch(err){
                    //do nothing
                }
            }
        }),
    })
})
export const {useBuyProductMutation} = bikriApi;