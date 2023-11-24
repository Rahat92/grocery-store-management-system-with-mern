import { apiSlice } from "../apis/apiSlice";

const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProduct: builder.query({
      query: (category) => {
        const rootUrl = `/products?limit=4`;
        return {
          url:
            category !== "all"
              ? `/products?productCategory=${category}&limit=4`
              : rootUrl,
        };
      },
      providesTags: (result, err, args) => [
        { type: "getProducts", category: args },
      ],
      transformResponse: (response) => {
        return response.products.sort((a, b) => {
          if (a.name > b.name) {
            return -1;
          }
          if (b.name > a.name) {
            return 1;
          }
          return 0;
        });
      },
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data: newProduct } = await queryFulfilled;
          console.log(newProduct);
          dispatch(
            apiSlice.util.updateQueryData(
              "getProduct",
              undefined,
              (products) => {
                console.log(newProduct);
                // console.log(JSON.stringify(products))
                products?.push(newProduct.product);
              }
            )
          );
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});
export const { useGetProductQuery, useCreateProductMutation } = productApi;
