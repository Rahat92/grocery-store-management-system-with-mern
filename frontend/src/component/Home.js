import {
  useGetCustomerQuery,
  useGetCustomersQuery,
} from "../features/customer/customerApi";
import { useGetProductQuery } from "../features/product/productApi";
import style from "../App.module.css";
import HomeStyle from "./Home.module.css";
import { useEffect, useState } from "react";
import {
  useBuyProductMutation,
  useGetCategoriesQuery,
} from "../features/bikri/bikriApi";
import { Link } from "react-router-dom";
const Home = () => {
  const { data: categories } = useGetCategoriesQuery();
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [skipped, setSkipped] = useState(true);
  const [search, setSearch] = useState("");
  const [typing, setTyping] = useState(false);
  console.log(
    !isNaN(search[search.length - 1])
      ? search.slice(0, search.length - 1)
      : search
  );
  const { products, totalPages } = useGetProductQuery(
    {
      category,
      page,
      search: !isNaN(search[search.length - 1])
        ? search.slice(0, search.length - 1)
        : search,
    },
    {
      skip: !skipped,
      selectFromResult: ({ data }) => ({
        totalPages: data?.totalPages,
        products: data?.products,
      }),
    }
  );
  const { data: customers } = useGetCustomersQuery();
  const [buyProduct, { isSuccess, isError, error }] = useBuyProductMutation();
  const [customerId, setCustomerId] = useState();
  const [cartValues, setCartValues] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const [customerName, setCustomerName] = useState();
  const [submitMoney, setSubmitMoney] = useState();
  useEffect(() => {
    setSkipped(true);
    return () => setSkipped(false);
  }, [category, page, search, typing]);
  useEffect(() => {
    setPage(1);
  }, [category, search]);
  useEffect(() => {
    if (isSuccess) {
      const carts = cartProducts.map((el) => {
        return {
          buyPrice: el.buyPrice,
          i: el.i,
          name: el.name,
          price: el.price,
          productCategory: el.productCategory,
          productId: el.productId,
          quantity: "",
          storeQuantity: el.storeQuantity,
          totalAmount: "",
          totalBuyAmount: el.totalBuyAmount,
        };
      });
      setCartProducts(carts);
      setSearch("");
    } else if (isError) {
      console.log(error.data);
    }
  }, [isSuccess, isError]);

  const categoryHandler = (e) => {
    setCategory(e.target.innerText);
  };
  const numberHandler = (e, i, product) => {
    const {
      _id: productId,
      name,
      price,
      quantity,
      buyPrice,
      productCategory,
    } = product;
    const cartProductObj = {
      productId,
      i,
      name,
      productCategory,
      price,
      buyPrice,
      storeQuantity: quantity,
      quantity: e.target.value * 1,
      totalBuyAmount: buyPrice * e.target.value * 1,
      totalAmount: price * e.target.value * 1,
    };
    let copyCartProducts = [...cartProducts];
    const index = copyCartProducts.findIndex((el) => el.name === name);
    if (index !== -1) {
      copyCartProducts[index] = cartProductObj;
    } else {
      copyCartProducts = [...copyCartProducts, cartProductObj];
    }
    console.log(copyCartProducts);
    setCartProducts(copyCartProducts.filter((el) => el.quantity > 0));
  };
  const soldHandler = (e) => {
    let cartObj = {
      customer: customerId?.split(",")[0],
      customerId: customerId?.split(",")[0],
      productName: [],
      productId: [],
      totalBuyAmount: [],
      productBuyPrice: [],
      productPrice: [],
      quantity: [],
      totalAmount: [],
      categories: ["all"],
      payAmount:
        cartProducts
          ?.map((el) => Number(el.totalAmount))
          .reduce((f, c) => f + c, 0) <= submitMoney
          ? cartProducts
              ?.map((el) => Number(el.totalAmount))
              .reduce((f, c) => f + c, 0)
          : submitMoney,
    };
    cartProducts.map((el, i) => {
      el.quantity && cartObj.productName.push(el.name);
      el.quantity && cartObj.productId.push(el.productId);
      el.quantity && cartObj.quantity.push(Number(el.quantity));
      el.quantity && cartObj.totalAmount.push(Number(el.totalAmount));
      el.quantity && cartObj.productBuyPrice.push(Number(el.buyPrice));
      el.quantity && cartObj.productPrice.push(Number(el.price));
      el.quantity && cartObj.totalBuyAmount.push(Number(el.totalBuyAmount));
      const categoryIndex = cartObj.categories.findIndex(
        (item) => item === el.productCategory
      );
      if (categoryIndex === -1) {
        cartObj.categories.push(el.productCategory);
      }
    });
    if (cartObj.quantity?.length > 0) {
      let isNegativeValue = false;
      cartObj.quantity.map((el) => {
        if (el <= 0) {
          isNegativeValue = true;
        }

        cartProducts.map((el, i) => {
          if (el.storeQuantity < el.quantity) {
            isNegativeValue = true;
          }
        });
      });
      if (!isNegativeValue) {
        buyProduct({ ...cartObj, category, page });
      }
    }
  };
  const submitMoneyHandler = (e) => {
    setSubmitMoney(e.target.value);
  };
  const doSearch = (e) => {
    if (e.target.value.length > 0) {
      setCategory("all");
    }
    setSearch(e.target.value);
  };
  console.log(products);
  useEffect(() => {
    if (search && typing && products?.length === 1) {
      let givenQuantity;
      if (isNaN(search[search.length - 1]) === false) {
        givenQuantity = search[search.length - 1] * 1;
      }
      console.log(givenQuantity);
      const product = products[0];
      // const modifiedProduct = { ...product, takeQuantity: 8, totalAmount:product.price*5 }
      // setCartProducts([modifiedProduct])
      const {
        _id: productId,
        name,
        price,
        quantity,
        buyPrice,
        productCategory,
      } = product;
      console.log(product);
      const existQuantity = cartProducts?.find(
        (item) => item.name === name
      )?.quantity;
      const existTotalAmount = cartProducts?.find(
        (item) => item.name === name
      )?.totalAmount;
      console.log(existQuantity);
      const cartProductObj = {
        productId,
        // i,
        name,
        productCategory,
        price,
        buyPrice,
        storeQuantity: quantity,
        quantity: quantity ? givenQuantity || existQuantity : "",
        totalBuyAmount: buyPrice * givenQuantity || buyPrice * existQuantity,
        totalAmount: price * givenQuantity || existTotalAmount,
      };
      console.log(cartProductObj);
      let copyCartProducts = [...cartProducts];
      const index = copyCartProducts.findIndex((el) => el.name === name);
      if (index !== -1) {
        copyCartProducts[index] = cartProductObj;
      } else {
        copyCartProducts = [...copyCartProducts, cartProductObj];
      }
      console.log(copyCartProducts);
      if (index !== -1 && givenQuantity === 0) {
        const obj = copyCartProducts[index];
        copyCartProducts[index] = { ...obj, quantity: "" };
      }
      setCartProducts(copyCartProducts.filter((el) => el.quantity > 0));
    }
  }, [search, products]);

  useEffect(() => {
    if (search) {
      setTyping(true);
    }
    return () => setTyping(false);
  }, [search]);
  return (
    <div className={style.products}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", gap: "2rem" }}>
          <div
            style={{ color: category === "all" ? "red" : "black" }}
            onClick={(e) => setCategory("all")}
          >
            All
          </div>
          {categories?.categories?.map((el) => (
            <div
              style={{ color: category === el.category ? "red" : "black" }}
              onClick={categoryHandler}
            >
              {el.category}
            </div>
          ))}
        </div>
        <div>
          <input type="text" value={search} onChange={doSearch} />
        </div>
      </div>
      <select
        onChange={(e) => {
          setCustomerName({
            name: e.target.value.split(",")[1],
            id: e.target.value.split(",")[0],
          });
          setCartValues([
            ...cartValues.map((el) => {
              return {
                quantity: el.quantity,
                customer: e.target.value.split(",")[0],
              };
            }),
          ]);
          setCustomerId(e.target.value);
        }}
      >
        <option value="" hidden selected>
          Select Customer
        </option>
        {customers?.customers?.length > 0 &&
          customers.customers.map((el) => (
            <option value={el._id + "," + el.name}>{el.name}</option>
          ))}
      </select>
      &nbsp;
      {products?.map((el, i) => {
        return (
          <div key={el._id} className={style.product_box}>
            <h1>
              Name: {el.name}, Price: {el.price}, Quantity: {el.quantity}
            </h1>
            <form>
              <input
                type="number"
                max={el.quantity}
                disabled={el.quantity === 0}
                onChange={(e) => numberHandler(e, i, el)}
                value={
                  cartProducts &&
                  cartProducts.find((product) => product.name === el.name)
                    ?.quantity
                }
                placeholder={
                  el.quantity === 0
                    ? `No ${el.name} found in store`
                    : "Quantity"
                }
              />
              &nbsp;
            </form>
          </div>
        );
      })}
      <div className={style.cartDetail}>
        <h1 className={style.customerName}>
          Customer Name:
          <Link to={`customer/${customerName?.id}`}>{customerName?.name}</Link>
        </h1>
        {cartProducts
          .filter((pro) => pro.quantity > 0)
          .map((el) => {
            console.log(el);
            return (
              <div className={style.cartDetailBox}>
                <p>Name: {el.name}</p>,&nbsp;
                <p>Price: {el.price}</p>,&nbsp;
                <p>Quantity: {el.quantity}</p>,&nbsp;
                <p>Total amount: {el.totalAmount}</p>
              </div>
            );
          })}
        <div className={style.customerName}>&nbsp;</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            In Total:{" "}
            {cartProducts
              ?.map((el) => Number(el.totalAmount))
              .reduce((f, c) => f + c, 0)}
          </div>
          <div>
            <label>মোট প্রদত্ত টাকা</label>&nbsp;
            <input
              type="text"
              value={submitMoney}
              onChange={submitMoneyHandler}
            />
            <div>
              {submitMoney ? (
                <p>
                  ফেরতযোগ্য টাকাঃ{" "}
                  {submitMoney -
                    cartProducts
                      ?.map((el) => Number(el.totalAmount))
                      .reduce((f, c) => f + c, 0)}
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <div>
          <button onClick={soldHandler}>Sold</button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: "1rem",
          color: "white",
          fontSize: "1.2rem",
        }}
      >
        {totalPages > 1 &&
          Array(totalPages)
            .fill()
            .map((el, i) => {
              return (
                <div
                  onClick={(e) => setPage(e.target.innerText * 1)}
                  style={{
                    width: "30px",
                    height: "30px",
                    background: page === i + 1 ? "red" : "",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  {i + 1}
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Home;
/* eslint-enable array-callback-return, no-unused-vars, react-hooks/exhaustive-deps */
