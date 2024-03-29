import React, { useEffect, useState } from "react";
import {
  useCreateProductMutation,
  useGetProductQuery,
} from "../features/product/productApi";
import style from "./Products.module.css";
import { useGetCategoriesQuery } from "../features/bikri/bikriApi";
import { Link } from "react-router-dom";
const Products = () => {
  const [createProduct, { isSuccess, isError, error }] =
    useCreateProductMutation();
  const { data: categories } = useGetCategoriesQuery();
  console.log(categories);
  const [openCreateProductModal, setOpenCreateProductModal] = useState(false);
  const { products, totalPages } = useGetProductQuery(
    { category: "all", page: 1 },
    {
      // skip: !skipped,
      selectFromResult: ({ data }) => ({
        totalPages: data?.totalPages,
        products: data?.products,
      }),
    }
  );
  const openAddProductModal = () => {
    setOpenCreateProductModal(true);
  };
  const [formValue, setFormValue] = useState({
    name: "",
    photo: "",
    buyPrice: "",
    price: "",
    quantity: "",
    category: "",
    productCategory: "",
  });
  useEffect(() => {
    if (isSuccess) {
      setOpenCreateProductModal(false);
    }
  }, [isSuccess]);
  console.log(formValue);
  const addProductHandler = (e) => {
    e.preventDefault();
    const formValue = new FormData();
    formValue.append("name", e.target.name.value);
    formValue.append("photo", e.target.photo.files[0]);
    formValue.append("buyPrice", e.target.buyPrice.value);
    formValue.append("price", e.target.price.value);
    formValue.append("quantity", e.target.quantity.value);
    formValue.append("category", e.target.category.value.split("-")[0]);
    formValue.append("productCategory", e.target.category.value.split("-")[1]);
    console.log(formValue, e.target.name.value);
    createProduct(formValue);
  };
  console.log(formValue)
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      {openCreateProductModal ? (
        <>
          <div
            onClick={() => setOpenCreateProductModal(false)}
            style={{
              position: "absolute",
              width: "100%",
              height: "100vh",
              top: "0",
              bottom: "0",
              right: "0",
              background: "red",
              opacity: ".8",
            }}
          ></div>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <form onSubmit={addProductHandler}>
              <div>
                <label>Product Name</label>
              </div>
              <input
                type="text"
                name="name"
                value={formValue.name}
                onChange={(e) => {
                  setFormValue({ ...formValue, name: e.target.value });
                }}
              />
              <div>
                <label>Buying Price</label>
              </div>
              <input
                name="buyPrice"
                type="Number"
                onChange={(e) => {
                  setFormValue({ ...formValue, buyPrice: e.target.value * 1 });
                }}
              />
              <div>
                <label>Product Price</label>
              </div>
              <input
                name="price"
                type="Number"
                onChange={(e) => {
                  setFormValue({ ...formValue, price: e.target.value * 1 });
                }}
              />
              <div>
                <label>Product Quantity</label>
              </div>
              <input
                name="quantity"
                type="Number"
                onChange={(e) => {
                  setFormValue({ ...formValue, quantity: e.target.value * 1 });
                }}
              />
              <div>
                <select
                  name="category"
                  onChange={(e) => {
                    setFormValue({
                      ...formValue,
                      category: e.target.value.split("-")[0],
                      productCategory: e.target.value.split("-")[1],
                    });
                  }}
                  style={{ color: "black" }}
                >
                  <option value="default" hidden>
                    Select A Category
                  </option>
                  {categories?.categories?.map((el) => {
                    return (
                      <option value={el._id + "-" + el.category}>
                        {el.category}
                      </option>
                    );
                  })}
                </select>
              </div>
              <input
                name="photo"
                type="file"
                onChange={(e) =>
                  setFormValue({ ...formValue, photo: e.target.files[0] })
                }
              />
              <div>
                <button type="submit">Add Product</button>
              </div>
            </form>
          </div>
        </>
      ) : (
        ""
      )}
      <div style={{ display: "flex", gap: "1rem" }}>
        {categories?.categories?.map((el) => {
          return (
            <div
              style={{
                padding: "0 .5rem",
                background: "blue",
                borderRadius: "8px",
              }}
            >
              <Link to={`categories/${el._id}`}>{el.category}</Link>
            </div>
          );
        })}
      </div>
      <table className={style.table}>
        <thead>
          <tr>
            <td>Photo</td>
            <td>Name</td>
            <td>Price</td>
            <td>Quantity</td>
            <td>Action</td>
          </tr>
        </thead>
        <tbody>
          {products?.map((el, i) => {
            return (
              <tr>
                <td>
                  <img
                    src={`http://localhost:5000/public/img/product/${el.photo}`}
                    width="100px"
                    height="100px"
                  />
                </td>
                <td>{el.name}</td>
                <td>{el.price}</td>
                <td>{el.quantity}</td>
                <td>Edit Delete</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <button onClick={openAddProductModal} className={style.addBtn}>
        Add Product
      </button>
    </div>
  );
};

export default Products;
