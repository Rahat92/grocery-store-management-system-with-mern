import { apiSlice } from "../apis/apiSlice";

const bikriApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    buyProduct: builder.mutation({
      query: (cartObj) => ({
        url: `/bikri`,
        method: "POST",
        body: cartObj,
      }),
      invalidatesTags: (result, err, args) => {
        const categories = args.categories;
        return categories.map((el) => {
          return {
            type: "getProducts",
            category: el,
          };
        });
      },
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data: newCart } = await queryFulfilled;
          console.log(newCart);
          console.log(args);
          args.productId.map((el, i) => {
            dispatch(
              apiSlice.util.updateQueryData(
                "getProduct",
                args.category,
                (products) => {
                  console.log("hello world");
                  const product = products.find((product) => product._id == el);
                  product.quantity =
                    product.quantity - newCart.newBikri.quantity[i];
                }
              )
            );
          });
        } catch (err) {
          //do nothing
        }
      },
    }),
    createCategory: builder.mutation({
      query: () => ({
        url: `/category`,
        method: "post",
        body: {
          category: "Fruit",
        },
      }),
    }),
    getCategories: builder.query({
      query: () => `/category`,
    }),
    getCategory: builder.query({
      query: (id) => `/category/${id}`,
    }),
    getCustomerSellYear: builder.query({
      query: () => `/bikri/customers-sell/2023`,
    }),
    getCustomerBikris: builder.query({
      query: ({ customerId, page }) =>
        `/bikri/customer/${customerId}?page=${page}&limit=10`,
      transformResponse: (response) => {
        console.log(response);
        const customerBikri = response.customerBikri.sort((a, b) => {
          if (a.cartAt > b.cartAt) {
            return -1;
          }
          if (b.cartAt > a.cartAt) {
            return 1;
          }
          return 0;
        });
        const pages = response.pages;
        const totalCartAmount = response.totalCart;
        const totalBuyAmount = response.totalBuyAmount;
        const totalDue = response.totalDue;
        const currentPage = response.currentPage;
        const allSubmitMoney = response.allSubmitMoney;
        return {
          customerBikri,
          totalBuyAmount,
          totalDue,
          pages,
          totalCartAmount,
          currentPage,
          allSubmitMoney,
        };
      },
    }),
    getCustomerBikriStatics: builder.query({
      //   query: () => `/bikri/customer/${customerId}/${productName}/stats/2023`,
      query: ({ desireProduct, customerId }) =>
        `/bikri/customer/${customerId}/stats/2023`,
    }),
    getSellerBikriStatsMonthly: builder.query({
      query: () => `/bikri/stats/2023`,
    }),
  }),
});
export const {
  useBuyProductMutation,
  useGetCustomerBikrisQuery,
  useGetCustomerBikriStaticsQuery,
  useGetSellerBikriStatsMonthlyQuery,

  useCreateCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useGetCustomerSellYearQuery
} = bikriApi;
