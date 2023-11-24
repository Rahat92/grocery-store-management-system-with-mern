import React from "react";
import { useParams } from "react-router-dom";
import { useGetCategoryQuery } from "../features/bikri/bikriApi";

const CategoryProducts = () => {
  const { id } = useParams();
  const { data } = useGetCategoryQuery(id);
  return (
    <div>
      {data?.category?.products?.map((el) => {
        return <div>{el.name}</div>;
      })}
    </div>
  );
};

export default CategoryProducts;
