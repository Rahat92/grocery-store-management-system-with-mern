import { apiSlice } from "../apis/apiSlice"

const customerApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCustomer: builder.query({
            query: (customerId) => `/customers/${customerId}`
        }),
        getCustomers: builder.query({
            query: () => `/customers`
        }),
    })
})
export const {useGetCustomerQuery, useGetCustomersQuery} = customerApi