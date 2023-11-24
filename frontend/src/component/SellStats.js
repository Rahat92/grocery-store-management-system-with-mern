import React, { useEffect, useState } from "react";
import {
  useCreateCategoryMutation,
  useGetSellerBikriStatsMonthlyQuery,
} from "../features/bikri/bikriApi";
import style from "./SellStats.module.css";
const SellStats = () => {
  const { data: sellerStats } = useGetSellerBikriStatsMonthlyQuery();
  const [createCategory, { data: category, isSuccess }] =
    useCreateCategoryMutation();
  const [finalStats, setFinalStats] = useState([]);
  const [stats, setStats] = useState([]);

  // useEffect(() => {
  //   createCategory()
  // }, [])

  useEffect(() => {
    if (sellerStats?.customerBikri?.length > 0) {
      const arr = sellerStats?.customerBikri?.map((el) => {
        return { month: el._id, stats: [] };
      });
      setFinalStats(arr);
      const finalstats = sellerStats.customerBikri.map((el, i) => {
        console.log(el);
        const month = el._id;
        const totalAmount = el.totalAmount;
        const totalBuyAmount = el.totalBuyAmount;
        const names = el.name;
        const buyPrices = el.buyPrice;
        const prices = el.price;
        const quantities = el.quantityArr;
        let stats = [];
        const customArr = names.map((el, i) => {
          return {
            name: el,
            buyPrice: buyPrices[i],
            price: prices[i],
            quantity: quantities[i],
            profit: prices[i] * quantities[i] - buyPrices[i] * quantities[i],
          };
        });
        customArr.map((el, i) => {
          const index = stats.findIndex((element) => el.name === element.name);
          if (index === -1) {
            stats.push(el);
          } else {
            const obj = stats[index];
            stats[index] = {
              ...obj,
              quantity: obj.quantity + el.quantity,
              profit: obj.profit + el.profit,
            };
          }
        });
        return {
          month,
          totalBuyAmount,
          totalAmount,
          stats: stats.sort((a, b) => b.quantity - a.quantity),
        };
      });
      setStats(finalstats.sort((a, b) => b.month - a.month));
    }
  }, [sellerStats?.customerBikri]);
  return (
    <div>
      <div>
        <table style={{ width: "100%", position: "fixed", top: "0" }}>
          <tr
            style={{
              background: "red",
              color: "black",
              fontFamily: "sans-serif",
            }}
          >
            <td
              style={{
                width: "10%",
                minWidth: "120px",
                padding: "1rem",
              }}
            >
              Month
            </td>
            <td
              style={{
                width: "15%",
                minWidth: "120px",
                padding: "1rem",
              }}
            >
              Monthly Total Sell
            </td>
            <td
              style={{
                width: "15%",
                minWidth: "120px",
                padding: "1rem",
              }}
            >
              Monthly Total Profit
            </td>
            <td>Product Name</td>
            <td>Product Price</td>
            <td>Product Quantity</td>
            <td>Profit</td>
          </tr>
        </table>
      </div>
      <table className={style.customerStatTable}>
        <thead style={{ visibility: "hidden" }}>
          <tr>
            <td
              style={{
                width: "10%",
                minWidth: "120px",
                padding: "1rem",
              }}
            >
              Month
            </td>
            <td
              style={{
                width: "15%",
                minWidth: "120px",
                padding: "1rem",
              }}
            >
              Monthly Total Sell
            </td>
            <td
              style={{
                width: "15%",
                minWidth: "120px",
                padding: "1rem",
              }}
            >
              Monthly Total Profit
            </td>
            <td>Product Name</td>
            <td>Product Price</td>
            <td>Product Quantity</td>
            <td>Profit</td>
          </tr>
        </thead>
        <tbody className={style.customerStatBody}>
          {stats.map((el) => {
            return (
              <tr>
                <td style={{ width: "10%", minWidth: "120px" }}>
                  {el.month === 1
                    ? "January"
                    : el.month === 2
                    ? "February"
                    : el.month === 3
                    ? "March"
                    : el.month === 4
                    ? "April"
                    : el.month === 5
                    ? "May"
                    : el.month === 6
                    ? "June"
                    : el.month === 7
                    ? "July"
                    : el.month === 8
                    ? "August"
                    : el.month === 9
                    ? "September"
                    : el.month === 10
                    ? "Octobor"
                    : el.month === 11
                    ? "November"
                    : el.month === 12
                    ? "December"
                    : ""}
                </td>
                <td
                  style={{
                    width: "15%",
                    minWidth: "120px",
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  {el.totalAmount} টাকা
                </td>
                <td
                  style={{
                    width: "15%",
                    minWidth: "120px",
                    fontWeight: "bold",
                    color: "black",
                    borderRight: "2px solid black",
                    padding: "1rem",
                  }}
                >
                  {el.totalAmount - el.totalBuyAmount} টাকা
                </td>
                <td style={{ padding: "0" }}>
                  <table className={style.statTableName}>
                    {el.stats.map((el) => {
                      return (
                        <tr>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: ".4rem",
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
                  <table
                    className={style.statTablePrice}
                    style={{ width: "100%" }}
                  >
                    {el.stats.map((el) => {
                      return (
                        <tr>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: ".4rem",
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
                    {el.stats.map((el) => {
                      return (
                        <tr>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: ".4rem",
                              }}
                            >
                              {el.quantity} টি
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                </td>
                <td style={{ padding: "0" }}>
                  <table className={style.statTableTotalCost}>
                    {el.stats.map((el) => {
                      return (
                        <tr>
                          <td>
                            <span
                              style={{
                                display: "inline-block",
                                padding: ".4rem",
                              }}
                            >
                              {el.profit}
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
        </tbody>
      </table>
    </div>
  );
};

export default SellStats;
