import React, { useState } from "react";
import {
  useCreateCustomerMutation,
  useGetCustomersQuery,
} from "../features/customer/customerApi";
import { Link } from "react-router-dom";
import { useGetCustomerBikrisQuery } from "../features/bikri/bikriApi";

const Customers = () => {
  const { data: customers } = useGetCustomersQuery();
  console.log(customers)
  const [createCustomer, {}] = useCreateCustomerMutation();
  const [addCustomerButtonClick, setAddCustomerButtonClick] = useState(false);
  const [formValue, setFormValue] = useState({
    name: "",
    photo: "",
    phoneNo: "",
  });
  console.log(customers);
  const addCustomerButtonClickHandler = (e) => {
    setAddCustomerButtonClick(true);
  };

  const addCustomerHandler = (e) => {
    e.preventDefault();
    console.log(e.target.photo.files[0]);
    const formValues = new FormData();
    formValues.append("name", e.target.name.value);
    formValues.append("photo", e.target.photo.files[0]);
    formValues.append("phoneNo", e.target.phone.value);
    createCustomer(formValues);
  };
  console.log(formValue);
  return (
    <div>
      <div
        style={{
          position: "absolute",
          top: "0",
          bottom: "0",
          width: "100%",
          background: "orange",
          opacity: ".6",
        }}
      ></div>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          style={{ background: "green", padding: "2rem", borderRadius: "10px" }}
        >
          <form onSubmit={addCustomerHandler}>
            <div>
              <label>Name</label>
              <div>
                <input
                  onChange={(e) =>
                    setFormValue({ ...formValue, name: e.target.value })
                  }
                  value={formValue.name}
                  type="text"
                  name="name"
                />
              </div>
            </div>
            <div>
              <label>Photo</label>
              <div>
                <input
                  name="photo"
                  type="file"
                  onChange={(e) =>
                    setFormValue({ ...formValue, photo: e.target.files[0] })
                  }
                />
              </div>
            </div>
            <div>
              <label>Phone No</label>
              <div>
                <input
                  onChange={(e) =>
                    setFormValue({ ...formValue, phoneNo: e.target.value })
                  }
                  value={formValue.phoneNo}
                  type="number"
                  name="phone"
                />
              </div>
            </div>
            <button type="submit">Add Customer</button>
          </form>
        </div>
      </div>
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
      <button onClick={addCustomerButtonClickHandler}>Add Customer</button>
    </div>
  );
};

export default Customers;
