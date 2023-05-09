import { apiSlice } from "../apis/apiSlice";

const paymentsApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCustomerPayments: builder.query({
            query: (customerId) => `customers/${customerId}/customer_payments`
        })
    })
})

export const {useGetCustomerPaymentsQuery} = paymentsApi