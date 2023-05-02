import { useCartProductMutation } from "./features/cart/cartApi";
import { useGetCustomerQuery, useGetCustomersQuery } from "./features/customer/customerApi";
import { useGetProductQuery } from "./features/product/productApi"
import style from './App.module.css';
import { useEffect, useState } from "react";
import { useBuyProductMutation } from "./features/bikri/bikriApi";
const App = () => {
  const {data:products} = useGetProductQuery()
  const {data: customer} = useGetCustomerQuery('644a5222a96d3996de069975')
  const {data: customers} = useGetCustomersQuery()
  const [cartProduct] = useCartProductMutation();
  const [buyProduct] = useBuyProductMutation()
  const [customerId, setCustomerId] = useState()
  const [cartValues, setCartValues] = useState([])
  const [resultsArr, setResultArr] = useState([])
  const [customerName, setCustomerName] = useState()
  const submitCart = (e, i, productId) => {
    e.preventDefault()
    cartProduct({...cartValues[i], productId})
  }
  useEffect(() => {
    let productsArr;
    let resultArr;
    if(products?.products&&products.products.length>0){
      productsArr = products.products.map(el => {return {quantity:'', customer: customerId}})
      resultArr = products.products.map(el => {return {productId: el._id, name: el.name, price: el.price, quantity: '', totalAmount: ''}})
    }
    setCartValues(productsArr)
    setResultArr(resultArr)
  },[products?.products.length])

  
  const numberHandler = (e, i) => {
    const copyProductArr = [...cartValues]
    const productObj = copyProductArr[i]
    copyProductArr[i] = {...productObj, quantity: e.target.value}
    setCartValues(copyProductArr)

    const copyResultArr = [...resultsArr];
    const resultObj = copyResultArr?.length>0&& copyResultArr[i];
    const myObj = {...resultObj};
    console.log(myObj.price);
    copyResultArr[i] = {...resultObj, quantity: e.target.value, totalAmount: myObj.price*e.target.value }
    setResultArr(copyResultArr)
  }
  console.log(resultsArr);
  const soldHandler = (e) => {
    let cartObj = {
      customer: customerId?.split(',')[0],
      customerId: customerId?.split(',')[0],
      productName: [],
      productId: [],
      productPrice: [],
      quantity: [],
      totalAmount:[]
    }
    resultsArr.map(el => {
      console.log(el);
      el.quantity&&cartObj.productName.push(el.name)
      el.quantity&&cartObj.productId.push(el.productId)
      el.quantity&&cartObj.quantity.push(Number(el.quantity))
      el.quantity&&cartObj.totalAmount.push(Number(el.totalAmount))
      el.quantity&&cartObj.productPrice.push(Number(el.price))
    })
    buyProduct(cartObj)
    const newArr = resultsArr.map(el => {return {quantity: el.quantity, customer: customerId?.split(',')[0], productId: el.productId }})
    console.log(newArr);
    newArr?.length>0&&newArr.map(el => {
        // cartProduct(el)
    })
    console.log(newArr);
  }
  return (
    <div className= {style.products}>
      <select onChange={(e) =>{ setCustomerName(e.target.value.split(',')[1]); setCartValues([...cartValues.map(el => {
        return {
          quantity: el.quantity,
          customer: e.target.value.split(',')[0]
        }
      })])
      setCustomerId(e.target.value)
      }}>
        <option value= '' hidden selected>Select Customer</option>
        {customers?.customers?.length>0&&customers.customers.map(el => <option value={el._id+","+el.name}>{el.name}</option>)}
      </select>&nbsp;
      {products?.products?.map((el, i) => {
        return (
          <div className= {style.product_box}>
            <h1>Name: {el.name}, Price: {el.price}, Quantity: {el.quantity}</h1>
            <form onSubmit={(e) =>submitCart(e, i, el._id)}>
              <input type="number" max={el.quantity} onChange={(e) => numberHandler(e, i)} value={cartValues&&cartValues[i]?.quantity}  placeholder="Quantity" />&nbsp;
              <button type="submit" name="" value="" >Cart</button>
            </form>
          </div>
        )
      })}
      <div className= {style.cartDetail}>
        <h1 className= {style.customerName}>Customer Name: {customerName}</h1>
        {resultsArr?.map(el => {
          return(
            <div className= {style.cartDetailBox}>
              <p>Name: {el.name}</p>,&nbsp; 
              <p>Price: {el.price}</p>,&nbsp;
              <p>Quantity: {el.quantity}</p>,&nbsp;
              <p>Total amount: {el.totalAmount}</p>
            </div>
          )
        })}
        <div className= { style.customerName}>&nbsp;</div>
        In Total: {resultsArr?.map(el => el.totalAmount).reduce((f,c) => f+c,0)}
        <div>
          <button onClick={soldHandler}>Sold</button>
        </div>
      </div>
    </div>
  )
}

export default App