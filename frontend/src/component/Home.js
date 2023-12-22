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
import { readableDate } from "../utils/readableDate";
const Home = () => {
  const { data: categories } = useGetCategoriesQuery();
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [skipped, setSkipped] = useState(true);
  const [skippedGetCustomer, setSkippedGetCustomer] = useState(false);
  const [search, setSearch] = useState("");
  const [typing, setTyping] = useState(false);
  const [clickOnQuantity, setClickOnQuantity] = useState(false);
  const [cartProductId, setCartProductId] = useState(null);
  const [quantityMessage, setQuantityMessage] = useState([]);
  const [isChecked, setIsChecked] = useState('off')
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
  const [customerName, setCustomerName] = useState({
    name: 'default',
    id:null
  });
  console.log(cartValues)
  const [submitMoney, setSubmitMoney] = useState();
  const { data: customer } = useGetCustomerQuery(customerName.id, {
    skip: !skippedGetCustomer,
  });
  console.log(customer);
  useEffect(() => {
    if (customerName.id) {
      setSkippedGetCustomer(true);
    }
    return () => setSkippedGetCustomer(false);
  }, [customerName.id]);
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

  useEffect(() => {
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
      // let isNegativeValue = false;
      cartObj.quantity.map((el) => {
        // if (el <= 0) {
        //   isNegativeValue = true;
        // }
        let messages = [];
        cartProducts.map((el, i) => {
          console.log(el);
          if (el.quantity && el.storeQuantity < el.quantity) {
            // isNegativeValue = true;
            const message = {
              id: el.productId,
              message: "To many " + el.name,
            };
            messages.push(message);
          }
        });
        setQuantityMessage(messages);
      });
    }
    if (cartProducts.length === 0) {
      setQuantityMessage([]);
    }
  }, [cartProducts, cartProducts.length]);
  console.log(cartProducts);
  console.log(quantityMessage);
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
            cartProducts[i].quantity = el.storeQuantity;
            setCartProducts([...cartProducts]);
            // setMessage({
            //   cartArrElement: {
            //     id: el.productId,
            //     message:'Quantity is more than storage.'
            //   }
            // })
          }
        });
      });
      console.log(customerName)
      
      if (isChecked === 'off' && customerName.name==='default') {
        alert('No Customer selected, Please Select a customer')
        return
      }
      console.log(isChecked)
      if (!isNegativeValue) {
        console.log(cartObj)
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
        quantity: quantity > 0 ? givenQuantity || existQuantity : "",
        totalBuyAmount: buyPrice * givenQuantity || buyPrice * existQuantity,
        totalAmount: price * givenQuantity || existTotalAmount,
      };
      console.log(cartProductObj);
      let copyCartProducts = [...cartProducts];
      const index = copyCartProducts.findIndex((el) => el.name === name);
      if (index !== -1) {
        copyCartProducts[index] = cartProductObj;
      } else {
        if (cartProductObj.quantity > 0) {
          copyCartProducts = [...copyCartProducts, cartProductObj];
        }
      }
      // if (index !== -1 && givenQuantity === 0) {
      //   copyCartProducts.splice(index, 1);
      //   // alert("hi");
      // }
      if (index !== -1 && givenQuantity === 0) {
        const obj = copyCartProducts[index];
        console.log(obj);
        copyCartProducts[index] = {
          ...obj,
          quantity: "",
          totalAmount: 0,
          totalBuyAmount: 0,
        };
      }
      setCartProducts(copyCartProducts);
    }
  }, [search, products]);
  useEffect(() => {
    if (search) {
      setTyping(true);
    }
    return () => setTyping(false);
  }, [search]);

  const removeCartItem = (name) => {
    const index = cartProducts.findIndex((item) => item.name === name);
    const obj = cartProducts[index];
    cartProducts[index] = {
      ...obj,
      quantity: "",
      totalAmount: 0,
      totalBuyAmount: 0,
    };
    setCartProducts([...cartProducts]);
  };
  const quantityHandler = (id) => {
    setCartProductId(id);
    setClickOnQuantity(true);
  };
  const updateCartQuantityHandler = (e, name) => {
    const index = cartProducts.findIndex((item) => item.name === name);
    const obj = cartProducts[index];
    cartProducts[index] = {
      ...obj,
      quantity: e.target.value * 1 === 0 ? "" : e.target.value * 1,
      totalAmount: obj.price * e.target.value * 1,
    };
    setCartProducts([...cartProducts]);
  };

  const checkboxHandler = (e) => {
    setIsChecked(prev => {
      if (prev === 'off') {
        return 'on'
      } else {
        return 'off'
      }
    })
  }
  console.log(isChecked)


  // test month array//
  let monthLength = 0;
  let month = new Date().getMonth()
  console.log(month)
  switch (month) {
    case 0:
      monthLength = 31;
    case 1:
      monthLength = 29
    case 2:
      monthLength = 31
    case 3: 
      monthLength = 30
    case 4:
      monthLength = 31
    case 5:
      monthLength = 30
    case 6:
      monthLength = 31 //july
    case 7:
      monthLength = 31 //august
    case 8:
      monthLength = 30
    case 9:
      monthLength = 31 //octobar
    case 10:
      monthLength = 30
    case 11:
      monthLength = 31
      break;
    default:
      monthLength = 0
  }
  const [dates, setDates] = useState([])
  useEffect(() => {
    let days = []
    for (let i = 1; i <= monthLength; i++){
      const time = readableDate(new Date(2023, month, i))
      console.log(time)
      const readableYear = time.year;
      const readableMonth = time.month;
      const readableDay = time.day
      days.push({
        date:`${readableDay} ${readableMonth} ${readableYear}`
      })
    }
    console.log(days)
  }, [])
  
  return (
    <div>
      <div className={style.products}>
        {/* <select
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
            <Link to={`customer/${customerName?.id}`}>
              {customerName?.name}
            </Link>
          </h1>
          {cartProducts
            .filter((pro) => pro.quantity > 0)
            .map((el, i) => {
              console.log(el);
              return (
                <div key={el.name} className={style.cartDetailBox}>
                  <p>Name: {el.name}</p>,&nbsp;
                  <p>Price: {el.price}</p>,&nbsp;
                  {clickOnQuantity && cartProductId === el.productId ? (
                    <>
                      Quantity:
                      <input
                        onChange={(e) => updateCartQuantityHandler(e, el.name)}
                        style={{ width: "50px", textAlign: "center" }}
                        value={el.quantity}
                        type={"number"}
                      />
                    </>
                  ) : (
                    <p onClick={() => quantityHandler(el.productId)}>
                      Quantity: {el.quantity}
                    </p>
                  )}
                  ,&nbsp;
                  <p>Total amount: {el.totalAmount}</p>
                  <p onClick={() => removeCartItem(el.name)}>Cancel</p>
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
        </div> */}
      </div>

      {/* updated design */}
      <div style={{ width: "90%", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
          }}
        >
          <div style={{ display: "flex", gap: "2rem" }}>
            <div
              style={{
                color: category === "all" ? "red" : "black",
                cursor: "pointer",
              }}
              onClick={(e) => setCategory("all")}
            >
              All
            </div>
            {categories?.categories?.map((el) => (
              <div
                style={{
                  color: category === el.category ? "red" : "black",
                  cursor: "pointer",
                }}
                onClick={categoryHandler}
              >
                {el.category}
              </div>
            ))}
          </div>
          <div>
            <input
              type="text"
              value={search}
              onChange={doSearch}
              placeholder="Search"
            />
          </div>
        </div>
        {console.log(customerName)}
        <div style={{ display: "flex" }}>
          <div style={{ flex: "0 0 20%", height: "300px" }}>
            <select
              style={{ width: "100%", color: "black" }}
              onChange={(e) => {
                setIsChecked('off')
                setCustomerName({
                  name:
                    e.target.value !== "default"
                      ? e.target.value.split(",")[1]
                      : "default",
                  id: e.target.value!=='default'?e.target.value.split(",")[0]:null,
                });
                // setCartValues([
                //   ...cartValues.map((el) => {
                //     return {
                //       quantity: el.quantity,
                //       customer: e.target.value.split(",")[0],
                //     };
                //   }),
                // ]);
                setCustomerId(e.target.value!=='default'?e.target.value.split(",")[0]:null);
              }}
            >
              <option value="default" selected>
                Select Customer
              </option>
              {customers?.customers?.length > 0 &&
                customers.customers.map((el) => (
                  <option value={el._id + "," + el.name}>{el.name}</option>
                ))}
            </select>
            <div>
              {customerName.name !== "default" && customer?.customer?.name ? (
                <div>
                  <Link to={`/customer/${customer.customer._id}`}>
                    <figcaption>
                      <img
                        src={`http://localhost:5000/public/img/customer/${customer.customer.photo}`}
                      />
                      <caption>{customer.customer.name}</caption>
                    </figcaption>
                  </Link>
                </div>
              ) : (
                <div>
                  <h1>No Name Selected</h1>
                  <input type="checkbox" onChange={checkboxHandler} id="check" />{" "}
                  <label htmlFor="check">Cart Without Customer</label>
                </div>
              )}
            </div>
          </div>

          {/* render products */}
          <div style={{ flex: "0 0 50%", padding: "0 2rem" }}>
            <h1>Our Products</h1>
            {!products ? (
              <h1>Products is loading</h1>
            ) : (
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Image</th>
                    <th style={{ textAlign: "left" }}>Name</th>
                    <th style={{ textAlign: "left" }}>Price</th>
                    <th style={{ textAlign: "left" }}>Quantity</th>
                    <th style={{ textAlign: "left" }}>Sell Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {products?.map((el, i) => {
                    return (
                      <tr key={el._id} style={{ border: "1rem solid white" }}>
                        <td>
                          <img
                            src={`http://localhost:5000/public/img/product/${el.photo}`}
                            width="50px"
                            height="50px"
                          />
                        </td>
                        <td>{el.name}</td>
                        <td>{el.price}</td>
                        <td>{el.quantity}</td>
                        <td style={{ width: "80px" }}>
                          <input
                            style={{
                              width: "80px",
                              textAlign: "center",
                            }}
                            type="number"
                            max={el.quantity}
                            disabled={el.quantity === 0}
                            onChange={(e) => numberHandler(e, i, el)}
                            value={
                              cartProducts &&
                              cartProducts.find(
                                (product) => product.name === el.name
                              )?.quantity
                            }
                            placeholder={
                              el.quantity === 0 ? `Empty` : "Quantity"
                            }
                          />
                          {quantityMessage.find((item) => item.id === el.id)
                            ? quantityMessage.find((item) => item.id === el.id)
                                .message
                            : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          <div style={{ flex: "0 0 30%" }}>
            <h1>Selected Products</h1>
            {cartProducts.filter((el) => el.quantity > 0).length === 0 && (
              <div>
                <p>No product is selected Yet</p>
              </div>
            )}
            {cartProducts.filter((el) => el.quantity > 0).length > 0 && (
              <table style={{ width: "100%" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left" }}>Name</th>
                    <th style={{ textAlign: "left" }}></th>
                    <th style={{ textAlign: "center" }}>Quantity</th>
                    <th style={{ textAlign: "right" }}>TotalAmount</th>
                  </tr>
                </thead>
                {console.log(cartProductId)}
                <tbody>
                  {cartProducts
                    .filter((pro) => pro.quantity > 0)
                    .map((el, i) => {
                      return (
                        <tr
                          onMouseOut={() => setCartProductId("")}
                          onMouseOver={() => setCartProductId(el.productId)}
                        >
                          <td>{el.name}</td>
                          <td
                            onClick={() => removeCartItem(el.name)}
                            style={{
                              opacity:
                                cartProductId === el.productId ? "1" : "0",
                              cursor: "pointer",
                            }}
                          >
                            X
                          </td>
                          <td
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            {/* {clickOnQuantity && cartProductId === el.productId ? (
                            <>
                              <input
                                onChange={(e) =>
                                  updateCartQuantityHandler(e, el.name)
                                }
                                style={{ width: "50px", textAlign: "center" }}
                                value={el.quantity}
                                type={"number"}
                              />
                            </>
                          ) : (
                            <p onClick={() => quantityHandler(el.productId)}>
                              {el.quantity}
                            </p>
                          )} */}
                            <input
                              onChange={(e) =>
                                updateCartQuantityHandler(e, el.name)
                              }
                              style={{
                                color: "white",
                                width: "60px",
                                outline: "none",
                                border: "none",
                                background: "none",
                                textAlign: "center",
                              }}
                              type="number"
                              value={el.quantity}
                            />
                          </td>
                          <td style={{ textAlign: "right" }}>
                            {el.totalAmount}
                          </td>
                        </tr>
                      );
                    })}
                  {cartProducts.filter((el) => el.quantity > 0).length > 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center" }}>
                        <button
                          onClick={soldHandler}
                          style={{ background: "red", width: "100%" }}
                        >
                          Sell{" "}
                          {cartProducts
                            ?.map((el) => Number(el.totalAmount))
                            .reduce((f, c) => f + c, 0)}{" "}
                          টাকা
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
            {/* {cartProducts
              .filter((pro) => pro.quantity > 0)
              .map((el, i) => {
                console.log(el);
                return (
                  <div key={el.name} className={style.cartDetailBox}>
                    <p>Name: {el.name}</p>,&nbsp;
                    <p>Price: {el.price}</p>,&nbsp;
                    {clickOnQuantity && cartProductId === el.productId ? (
                      <>
                        Quantity:
                        <input
                          onChange={(e) =>
                            updateCartQuantityHandler(e, el.name)
                          }
                          style={{ width: "50px", textAlign: "center" }}
                          value={el.quantity}
                          type={"number"}
                        />
                      </>
                    ) : (
                      <p onClick={() => quantityHandler(el.productId)}>
                        Quantity: {el.quantity}
                      </p>
                    )}
                    ,&nbsp;
                    <p>Total amount: {el.totalAmount}</p>
                    <p onClick={() => removeCartItem(el.name)}>Cancel</p>
                  </div>
                );
              })} */}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "2rem",
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
    </div>
  );
};

export default Home;
