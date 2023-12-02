import { apiSlice } from "../apis/apiSlice";

const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProduct: builder.query({
      query: ({ category, page, search }) => {
        const limit = 2;
        const rootUrl = `/products?page=${page}&limit=${limit}&keyword=${
          search ? search : ""
        }${category !== "all" ? `&productCategory=${category}` : ""}`;
        console.log(rootUrl);
        return {
          url: rootUrl,
        };
      },

      providesTags: (result, err, args) => [
        { type: "getProducts", category: args },
      ],
      transformResponse: (response) => {
        console.log(response);
        const products = response.products.sort((a, b) => {
          if (a.name > b.name) {
            return -1;
          }
          if (b.name > a.name) {
            return 1;
          }
          return 0;
        });
        return {
          totalPages: response.pages,
          products,
        };
      },
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        console.log(args);
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
