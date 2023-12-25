import React, { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import {
  useGetCustomerBikrisQuery,
  useGetSellerBikriStatsMonthlyQuery,
} from "../features/bikri/bikriApi";
import { readableDate } from "../utils/readableDate";
import style from "./CustomerCart.module.css";
import { useGetCustomerPaymentsQuery } from "../features/payments/paymentsApi";
import { useGetProductQuery } from "../features/product/productApi";
import { useGetCustomerQuery } from "../features/customer/customerApi";
const CustomerCart = () => {
  const timeRef = useRef();
  const headerRef = useRef();
  const tableRef = useRef();
  const [totalPages, setTotalPages] = useState();
  const [headerHeight, setHeaderHeight] = useState();
  const [tableScrollXPosition, setTableScrollXPosition] = useState(0);
  const [times, setTimes] = useState([]);
  const [y, setY] = useState(0);
  const [page, setPage] = useState(1);
  const [clickPage, setClickPage] = useState(true);
  const [desireProduct, setDesireProduct] = useState();
  const [isScrolled, setIsScrolled] = useState(false);
  const { customerId } = useParams();
  const { data: customer } = useGetCustomerQuery(customerId);
  const { data: payments } = useGetCustomerPaymentsQuery(customerId);
  const { data: products } = useGetProductQuery();
  const {
    customerBikri,
    pages,
    currentPage,
    totalCartAmount,
    totalBuyAmount,
    totalDue,
    allSubmitMoney,
    isLoading,
  } = useGetCustomerBikrisQuery(
    { customerId, page },
    {
      skip: !clickPage,
      selectFromResult: ({ data }) => ({
        customerBikri: data?.customerBikri,
        pages: data?.pages,
        totalCartAmount: data?.totalCartAmount,
        totalDue: data?.totalDue,
        totalBuyAmount: data?.totalBuyAmount,
        currentPage: data?.currentPage,
        allSubmitMoney: data?.allSubmitMoney,
      }),
    }
  );
  useEffect(() => {
    let pagesArr = [];
    if (pages > 0) {
      for (let i = 1; i <= pages; i++) {
        pagesArr.push(``);
      }
    }
    setTotalPages(pagesArr);
  }, [pages]);
  const [myProducts, setMyProducts] = useState([]);
  const [dates, setDates] = useState([]);
  const [total, setTotal] = useState();
  const pageclickHandler = (page) => {
    setPage(page);
    setClickPage(true);
  };
  useEffect(() => {
    setClickPage(true);
    return () => setClickPage(false);
  }, [page]);
  useEffect(() => {
    if (customerBikri?.length > 0) {
      const cartAts = customerBikri.map((el) => {
        return readableDate(el.cartAt);
      });
      let products = [];
      let totalAmounts = [];
      customerBikri.map((bikri, i) => {
        products.push(
          bikri.productName.map((el, i) => {
            totalAmounts.push(bikri.totalAmount[i]);
            return {
              name: el,
              price: bikri.productPrice[i],
              quantity: bikri.quantity[i],
              totalAmount: bikri.totalAmount[i],
              totalBuyAmount: bikri.totalBuyAmount[i],
            };
          })
        );
      });
      setTotal(totalAmounts.reduce((f, c) => f + c));
      setDates(cartAts);
      const final = cartAts.map((el, i) => {
        return {
          cartAt: el,
          products: products[i],
          isPaid: customerBikri[i].isPaid,
          payAmount: customerBikri[i].payAmount,
        };
      });
      setMyProducts(final);
    }
  }, [customerBikri]);
  const productChange = (e) => {
    setDesireProduct(e.target.value);
  };
  useEffect(() => {
    window.addEventListener("scroll", function () {
      setY(window.pageYOffset);
    });
    return () => setIsScrolled(false);
  }, [window.scrollY, window.pageYOffset]);
  console.log(y);
  useEffect(() => {
    timeRef.current.scrollTo(0, y);
  }, [y]);
  useEffect(() => {
    if (myProducts?.length > 0) {
      const times = myProducts.map((el) => {
        return {
          tdNo: el.products.length,
          time: el.cartAt,
          products: el.products,
        };
      });
      setTimes(times);
    }
  }, [myProducts]);
  useEffect(() => {
    console.log(headerRef.current.clientHeight);
    setHeaderHeight(headerRef.current.clientHeight);
  }, [myProducts?.length]);
  useEffect(() => {}, [window.pageYOffset, window.pageXOffset]);
  useEffect(() => {
    window.addEventListener("resize", function () {
      setHeaderHeight(headerRef.current.clientHeight);
      console.log(window.screen.availWidth);
      console.log(window.innerWidth);
    });
  }, [window.innerWidth]);
  console.log(window.screen.availWidth);
  console.log(window.innerWidth);
  console.log(tableScrollXPosition);
  useEffect(() => {
    headerRef.current.scrollLeft = tableScrollXPosition;
  }, [tableScrollXPosition]);
  return (
    <div>
      <div
        style={{
          width: "390px",
          height: headerHeight,
          // background: "orange",
          position: "fixed",
          top: "0",
          padding: "0",
          background: "blue",
        }}
      >
        <table style={{ width: "100%", padding: "0" }}>
          <tr style={{ borderBottom: "0 solid white", background: "blue" }}>
            <td
              style={{
                width: "280px",
                borderRight: "1px solid black",
                padding: "0 1rem",
              }}
            >
              সময়
            </td>
            <td style={{ padding: "0 1rem" }}>পন্যের নাম</td>
          </tr>
        </table>
      </div>
      <div
        className={style.customerCartHeader}
        ref={headerRef}
        style={{
          position: "fixed",
          top: "0",
          right: "0",
          left: "390px",
          overflowX: "scroll",
          webkitscrollbar: "none",
        }}
      >
        <table
          style={{
            background: "blue",
            width: "900px",
          }}
        >
          {/* <tr style={{ width: "100%" }}>
            <td colSpan={7}>
              <table style={{ width: "100%" }}>
                <tr style={{ width: "100%" }}>
                  <td style={{ padding: "0 1rem" }}>মোট বিক্রিমুল্য</td>
                  <td>মোট ক্রয়মুল্য</td>
                  <td>মোট বাকি</td>
                </tr>
                <tr>
                  <td style={{ padding: "0 1rem" }}>{totalCartAmount}</td>
                  <td>{totalBuyAmount}</td>
                  <td>{totalDue}</td>
                </tr>
              </table>
            </td>
          </tr> */}
          <tr
            style={{
              background: "red",
              color: "black",
              fontFamily: "sans-serif",
              // visibility: "hidden",
            }}
          >
            <td
              style={{
                width: "150px",
                background: "brown",
                borderRight: "2px solid black",
              }}
            >
              মুল্য
            </td>
            <td
              style={{
                width: "150px",
                background: "blue",
                borderRight: "2px solid black",
              }}
            >
              পরিমান
            </td>
            <td
              style={{
                width: "150px",
                background: "green",
                borderRight: "2px solid black",
              }}
            >
              মুল্য
            </td>
            <td
              style={{
                width: "150px",
                background: "pink",
                borderRight: "2px solid black",
              }}
            >
              সর্বমোট মুল্য
            </td>
            <td style={{ width: "150px", background: "red" }}>পরিশোধ</td>
            <td style={{ width: "150px", background: "green" }}>বাকি</td>
          </tr>
        </table>
      </div>
      <div
        ref={tableRef}
        onScroll={() => {
          console.log(tableRef.current.scrollLeft);
          setTableScrollXPosition(tableRef.current.scrollLeft);
        }}
        style={{
          marginLeft: "390px",
          marginTop: headerHeight,
          overflowX: "scroll",
          overflowY: "hidden",
        }}
      >
        <table className={style.customerStatTable} style={{ width: "900px" }}>
          <tbody className={style.customerStatBody}>
            {myProducts.map((el) => {
              return (
                <tr>
                  <td style={{ padding: "0", width: "150px" }}>
                    <table className={style.statTablePrice}>
                      {el.products.map((el) => {
                        return (
                          <tr>
                            <td>
                              <span
                                style={{
                                  display: "inline-block",
                                  // padding: "0 1rem",
                                }}
                              >
                                {el.price}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </table>
                  </td>
                  <td
                    style={{
                      padding: "0",
                      background: "brown",
                      width: "150px",
                    }}
                  >
                    <table className={style.statTableQuantity}>
                      {el.products.map((el) => {
                        return (
                          <tr>
                            <td>
                              <span
                                style={{
                                  display: "inline-block",
                                  // padding: "0 1rem",
                                }}
                              >
                                {el.quantity}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </table>
                  </td>
                  <td style={{ padding: "0", width: "150px" }}>
                    <table className={style.statTableQuantity}>
                      {el.products.map((el) => {
                        return (
                          <tr>
                            <td>
                              <span
                                style={{
                                  display: "inline-block",
                                  // padding: "0 1rem",
                                }}
                              >
                                {el.totalAmount}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </table>
                  </td>
                  <td style={{ padding: "0 0", width: "150px" }}>
                    {el.products
                      .map((el) => el.totalAmount)
                      ?.reduce((f, c) => f + c)}
                  </td>
                  <td style={{ padding: "0 0", width: "150px" }}>
                    {el.payAmount ===
                    el.products
                      .map((el) => el.totalAmount)
                      .reduce((f, c) => f + c, 0)
                      ? "Clear"
                      : el.payAmount}
                  </td>
                  <td style={{ padding: "0 0", width: "150px" }}>
                    {el.products
                      .map((el) => el.totalAmount)
                      .reduce((f, c) => f + c, 0) - el.payAmount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* ............. */}
      <div
        ref={timeRef}
        style={{
          width: "390px",
          position: "fixed",
          top: headerHeight,
          bottom: 0,
          background: "blue",
          overflowY: "scroll",
        }}
      >
        <table style={{ width: "100%" }}>
          {times?.map((el) => {
            return (
              <tr style={{ padding: "0 1rem", border: "2px solid white" }}>
                <td
                  style={{
                    width: "280px",
                    padding: "1px 1rem",
                  }}
                >
                  {el.time.day} {el.time.month} {el.time.year} at{" "}
                  {el.time.readableTime}
                </td>
                <td style={{ padding: "0", borderLeft: "1px solid black" }}>
                  <table className={style.statTableName}>
                    {el.products.map((el) => {
                      return (
                        <tr style={{}}>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "0 1rem",
                              }}
                            >
                              {el.name}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </td>
              </tr>
            );
          })}
        </table>
      </div>
    </div>
  );
};

export default CustomerCart;
