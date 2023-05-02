import { apiSlice } from "../apis/apiSlice"

const cartApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        cartProduct: builder.mutation({
            query: ({quantity, customer, productId}) => ({
                url: `/cart/${productId}`,
                method: 'POST',
                body: {quantity, customer}
            }),
            // invalidatesTags:['getProducts'],
            async onQueryStarted(args, {dispatch, queryFulfilled}) {

                try{
                    console.log(args);
                    const { data: newCart} = await queryFulfilled;
                    console.log(newCart)
                    dispatch(
                        apiSlice.util.updateQueryData('getProduct', undefined, (products) => {
                            console.log('hello world')
                            const product = products?.products.find(product=>product._id == args.productId)
                            product.quantity = product.quantity - newCart.cart.quantity
                        })
                    )
                }catch(err){
                    //do nothing
                }
            }
        }),
        getCustomers: builder.query({
            query: () => `/customers`
        }),
    })
})
export const {useCartProductMutation} = cartApi;