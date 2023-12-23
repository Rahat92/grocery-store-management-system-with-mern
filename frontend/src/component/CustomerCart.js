import React, { useEffect, useState } from "react";
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
  const [totalPages, setTotalPages] = useState();
  const [y, setY] = useState(0);
  const [page, setPage] = useState(1);
  const [clickPage, setClickPage] = useState(true);
  const [desireProduct, setDesireProduct] = useState();
  const [isScrolled, setIsScrolled] = useState(false);
  console.log(isScrolled);
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
  console.log(isLoading);
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
        console.log(bikri);
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
  console.log(myProducts);
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
  return (
    <div>
      <div>
        <table
          style={{
            width: "100%",
            position: isScrolled ? "fixed" : "absolute",
            top: "0",
            background: "blue",
          }}
        >
          <tr style={{ width: "100%" }}>
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
          </tr>
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
                width: "25%",
                minWidth: "300px",
                padding: "1rem",
              }}
            >
              বিক্রির সময়
            </td>
            <td
              style={{
                width: "15%",
                minWidth: "120px",
                padding: "1rem",
              }}
            >
              পন্যের নাম
            </td>
            <td
              style={{
                width: "15%",
                minWidth: "120px",
                padding: "1rem",
              }}
            >
              পন্যের মুল্য
            </td>
            <td style={{ width: "15%", minWidth: "120px", padding: "1rem" }}>
              পন্যের পরিমান
            </td>
            <td style={{ width: "15%", minWidth: "120px", padding: "1rem" }}>
              দাম
            </td>
            <td style={{ width: "15%", minWidth: "120px", padding: "1rem" }}>
              সর্বমোট মুল্য
            </td>
            <td style={{ width: "15%", minWidth: "120px", padding: "1rem" }}>
              পরিশোধ
            </td>
            <td style={{ width: "15%", minWidth: "120px", padding: "1rem" }}>
              বাকি
            </td>
          </tr>
        </table>
      </div>
      <table className={style.customerStatTable}>
        <thead style={{ visibility: "hidden" }}>
          <tr>
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
          </tr>
          <tr
            style={{
              background: "red",
              color: "black",
              fontFamily: "sans-serif",
            }}
          >
            <td
              style={{
                width: "25%",
                minWidth: "300px",
                padding: "1rem",
              }}
            >
              বিক্রির সময়
            </td>
            <td
              style={{
                width: "15%",
                minWidth: "120px",
                padding: "1rem",
              }}
            >
              পন্যের নাম
            </td>
            <td
              style={{
                width: "15%",
                minWidth: "120px",
                padding: "1rem",
              }}
            >
              পন্যের মুল্য
            </td>
            <td style={{ width: "15%", minWidth: "120px", padding: "1rem" }}>
              পন্যের পরিমান
            </td>
            <td style={{ width: "15%", minWidth: "120px", padding: "1rem" }}>
              দাম
            </td>
            <td style={{ width: "15%", minWidth: "120px", padding: "1rem" }}>
              সর্বমোট মুল্য
            </td>
            <td style={{ width: "15%", minWidth: "120px", padding: "1rem" }}>
              পরিশোধ
            </td>
            <td style={{ width: "15%", minWidth: "120px", padding: "1rem" }}>
              বাকি
            </td>
          </tr>
        </thead>
        <tbody className={style.customerStatBody}>
          {myProducts.map((el) => {
            return (
              <tr>
                <td style={{ width: "25%", minWidth: "120px" }}>
                  {el.cartAt.day} {el.cartAt.month} {el.cartAt.year} at{" "}
                  {el.cartAt.readableTime}
                </td>
                
                <td style={{ padding: "0" }}>
                  <table className={style.statTableName}>
                    {el.products.map((el) => {
                      return (
                        <tr>
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
                <td style={{ padding: "0" }}>
                  <table className={style.statTablePrice}>
                    {el.products.map((el) => {
                      return (
                        <tr>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "0 1rem",
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
                <td style={{ padding: "0" }}>
                  <table className={style.statTableQuantity}>
                    {el.products.map((el) => {
                      return (
                        <tr>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "0 1rem",
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
                <td style={{ padding: "0" }}>
                  <table className={style.statTableQuantity}>
                    {el.products.map((el) => {
                      return (
                        <tr>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: "0 1rem",
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
                <td style={{ padding: "0 1rem" }}>
                  {el.products
                    .map((el) => el.totalAmount)
                    ?.reduce((f, c) => f + c)}
                </td>
                <td style={{ padding: "0 1rem" }}>
                  {el.payAmount ===
                  el.products
                    .map((el) => el.totalAmount)
                    .reduce((f, c) => f + c, 0)
                    ? "Clear"
                    : el.payAmount}
                </td>
                <td style={{ padding: "0 1rem" }}>
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
  );
};

export default CustomerCart;
