import { apiSlice } from "../apis/apiSlice"

const customerApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCustomer: builder.query({
            query: (customerId) => `/customers/${customerId}`
        }),
        getCustomers: builder.query({
            query: () => `/customers`
        }),
        createCustomer: builder.mutation({
            query: (body) => ({
                url: `/customers`,
                method: 'POST',
                body:body
            })
        })
    })
})
export const {useGetCustomerQuery, useGetCustomersQuery, useCreateCustomerMutation} = customerApi