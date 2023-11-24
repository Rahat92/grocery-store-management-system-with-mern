import React, { useEffect, useState } from "react";
import { useGetCustomerSellYearQuery } from "../features/bikri/bikriApi";
import { useGetCustomerQuery } from "../features/customer/customerApi";

const YearlyCustomersSell = () => {
  const { data: info } = useGetCustomerSellYearQuery();
  const [infos, setInfors] = useState([]);
  const [finalArr, setFinalArr] = useState([]);
  console.log(info);
  useEffect(() => {
    if (info?.customerBikri?.length > 0) {
      const netArr = info.customerBikri.map((el, i) => {
        return {
          totalAmount: el.totalAmount.reduce((f, c) => f + c, 0),
          name: info.customers[i].name,
        };
      });
      setInfors(netArr.sort((a, b) => b.totalAmount - a.totalAmount));
    }
  }, [info?.customerBikri]);
  useEffect(() => {
    if (infos.length > 0) {
      let i = 0;
      const latestArr = infos.map((el, index) => {
        console.log(i);
        i =
          infos[index]?.totalAmount === infos[index - 1]?.totalAmount
            ? i
            : i + 1;
        return {
          rank: i,
          name: el.name,
          totalAmount: el.totalAmount,
        };
      });
      setFinalArr(latestArr);
    }
  }, [infos]);
  console.log(infos);
  return (
    <div>
      {finalArr.map((el) => {
        return (
          <div>
            {el.rank} {el.name} {el.totalAmount}
          </div>
        );
      })}
    </div>
  );
};

export default YearlyCustomersSell;
