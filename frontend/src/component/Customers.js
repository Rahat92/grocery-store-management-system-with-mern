import React from "react";
import { useGetCustomersQuery } from "../features/customer/customerApi";
import { Link } from "react-router-dom";
import { useGetCustomerBikrisQuery } from "../features/bikri/bikriApi";

const Customers = () => {
  const { data: customers } = useGetCustomersQuery();

  console.log(customers);
  return (
    <div>
      <table style={{ border: "1px solid black", width: "100%" }}>
        <thead>
          <tr>
            <td>Name</td>
            <td>Phone No</td>
          </tr>
        </thead>
        <tbody>
          {customers?.customers?.map((el) => {
            return (
              <tr>
                <td>
                  <Link to={`/customer/${el._id}`}>{el.name}</Link>
                </td>
                <td>{el.phoneNo}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Customers;
