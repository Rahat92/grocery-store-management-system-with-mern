import React, { useEffect, useState } from "react";
import { useGetCustomerBikriStaticsQuery } from "../features/bikri/bikriApi";
import { useParams } from "react-router-dom";
import { useGetCustomerQuery } from "../features/customer/customerApi";
import { useGetProductQuery } from "../features/product/productApi";
import style from "./MonthlyStatics.module.css";
const MonthlyStatics = () => {
  const [isSkipped, setIsSkipped] = useState(true);
  const [product, setProduct] = useState();
  const [stats, setStats] = useState([]);
  const { desireProduct, customerId } = useParams();
  const { data: customer } = useGetCustomerQuery(customerId);
  const { data: customerMonthlyStatistics } = useGetCustomerBikriStaticsQuery({
    desireProduct: product ? product : desireProduct,
    customerId,
  });
  console.log(customerMonthlyStatistics);
  const [statArr, setStatArr] = useState([]);
  useEffect(() => {
    if (customerMonthlyStatistics?.customerBikri.length > 0) {
      const dummyArrOfObj = customerMonthlyStatistics.customerBikri.map(
        (el) => {
          let mainArr = [];
          const nameArr = el.name;
          const priceArr = el.price;
          const quantityArr = el.quantityArr;
          nameArr.map((name, i) => {
            const index = mainArr.findIndex(
              (singleName) => singleName.name === name
            );
            if (index === -1) {
              mainArr.push({
                name,
                price: priceArr[i],
                quantity: quantityArr[i],
                totalCost: priceArr[i] * quantityArr[i],
              });
            } else {
              const obj = mainArr[index];
              console.log(obj);
              mainArr[index] = {
                ...obj,
                quantity: quantityArr[i] + obj.quantity,
                totalCost: priceArr[i] * (quantityArr[i] + obj.quantity),
              };
            }
          });
          console.log(mainArr);
          return {
            month: el._id,
            monthlyCost: el.totalAmount,
            stats: mainArr,
          };
          //01834799767
        }
      );
      setStatArr(dummyArrOfObj.sort((a, b) => b.month - a.month));
    }
  }, [customerMonthlyStatistics]);
  console.log(customer ? customer.customer.name : "");
  return (
    <div>
      <div>ক্রেতার নামঃ {customer ? customer.customer.name : ""}</div>
      <table className={style.customerStatTable}>
        <thead>
          <tr>
            <td>Month</td>
            <td>Monthly Total Cost</td>
            <td>Product Name</td>
            <td>Product Price</td>
            <td>Product Quantity</td>
            <td>Product Total Price</td>
          </tr>
        </thead>
        <tbody className={style.customerStatBody}>
          {statArr.map((el) => {
            return (
              <tr>
                <td style={{ width: "5%", minWidth: "100px" }}>
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
                  style={{ width: "15%", minWidth: "120px", fontWeight:'bold', color:'black' }}
                >
                  {el.monthlyCost} টাকা
                </td>
                <td>
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
                <td>
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
                <td>
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
                <td>
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
                              {el.totalCost}
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

export default MonthlyStatics;
