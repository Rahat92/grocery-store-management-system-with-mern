import React, { useEffect, useState } from "react";
import { useGetCustomerSellYearQuery } from "../features/bikri/bikriApi";
import { useGetCustomerQuery } from "../features/customer/customerApi";

const YearlyCustomersSell = () => {
  const { data: info } = useGetCustomerSellYearQuery();
  const [finalArr, setFinalArr] = useState([]);
  console.log(info);
  useEffect(() => {
    if (info?.customerBikri?.length > 0) {
      let monthsArr = [];
      let amounts = [];
      const baseArr = info.customerBikri.map((el, i) => {
        monthsArr.push({
          name: info.customers[i].name,
          month: [],
          monthlyTotalAmount: [],
        });
        const months = el.month;
        el.month.map((element, itemIndex) => {
          const index = monthsArr[i].month.findIndex(
            (item) => item === element
          );
          if (index !== -1) {
            const item = monthsArr[i].monthlyTotalAmount[index];
            monthsArr[i].monthlyTotalAmount[index] =
              item + el.totalAmount[itemIndex];
          } else {
            monthsArr[i].month.push(element);
            monthsArr[i].monthlyTotalAmount.push(el.totalAmount[itemIndex]);
          }
        });
      });
      console.log(monthsArr);
      monthsArr = monthsArr
        .map((el) => {
          return {
            name: el.name,
            month: el.month,
            monthlyTotalAmount: el.monthlyTotalAmount,
            totalAmount: el.monthlyTotalAmount.reduce((f, c) => f + c, 0),
          };
        })
        .sort((a, b) => b.totalAmount - a.totalAmount);
      let index = 0;
      monthsArr = monthsArr.map((el, i) => {
        index =
          monthsArr[i]?.totalAmount !== monthsArr[i - 1]?.totalAmount
            ? index + 1
            : index;
        return {
          rank: index,
          name: el.name,
          month: el.month,
          monthlyTotalAmount: el.monthlyTotalAmount,
          totalAmount: el.monthlyTotalAmount.reduce((f, c) => f + c, 0),
        };
      });
      setFinalArr(monthsArr);
    }
  }, [info?.customerBikri]);
  console.log(finalArr);
  const foundIndex = (monthArr, month, monthlyAmount) => {
    const index = monthArr.findIndex((item) => item === month);
    if (index !== -1) {
      return monthlyAmount[index];
    }
    return 0;
  };
  return (
    <div>
      <table style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>January</th>
            <th>February</th>
            <th>Merch</th>
            <th>April</th>
            <th>May</th>
            <th>June</th>
            <th>July</th>
            <th>August</th>
            <th>September</th>
            <th>Octobar</th>
            <th>November</th>
            <th>December</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>
          {finalArr.map((el) => {
            return (
              <tr>
                <td style={{ textAlign: "center" }}>{el.rank}</td>
                <td style={{ textAlign: "center" }}>{el.name}</td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 1, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 2, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 3, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 4, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 5, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 6, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 7, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 8, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 9, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 10, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 11, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {foundIndex(el.month, 12, el.monthlyTotalAmount)}
                </td>
                <td style={{ textAlign: "center" }}>{el.totalAmount}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default YearlyCustomersSell;
