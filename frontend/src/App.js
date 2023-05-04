import { useGetCustomerQuery, useGetCustomersQuery } from "./features/customer/customerApi";
import { useGetProductQuery } from "./features/product/productApi"
import style from './App.module.css';
import { useEffect, useState } from "react";
import { useBuyProductMutation } from "./features/bikri/bikriApi";
const App = () => {
  const {data:products} = useGetProductQuery()
  const {data: customers} = useGetCustomersQuery()
  const [buyProduct, {isSuccess}] = useBuyProductMutation()
  const [customerId, setCustomerId] = useState()
  const [cartValues, setCartValues] = useState([])
  const [resultsArr, setResultArr] = useState([])
  const [customerName, setCustomerName] = useState();
  const [productNumbers, setProductNumbers] = useState([])
  useEffect(() => {
    let resultArr;
    let productNumber;
    if(products?.length>0){
      resultArr = products.map(el => {return {productId: el._id, name: el.name, price: el.price, quantity: '', totalAmount: ''}})
      productNumber = products.map(el => {
        return {
          productNumber: Number(el.quantity),
          name: el.name
        }
      })
    }
    console.log(productNumber);
    setProductNumbers(productNumber)
    setResultArr(resultArr)
  },[products?.length])
  console.log(productNumbers);
  useEffect(() => {
    if(isSuccess){
      console.log('productNumbers', productNumbers);
      console.log(resultsArr);
      console.log('products Number', productNumbers);
      resultsArr.map((el,i) => {
        console.log(el.quantity);
        if(el.quantity){
          productNumbers[i].productNumber -= el.quantity;
          setProductNumbers(productNumbers)
        }
      })
      resultsArr.map(el => {
        el.quantity = ''
        el.totalAmount = ''
      })
      console.log(resultsArr);
    }
  },[isSuccess])
  const numberHandler = (e, i) => {

    const copyResultArr = [...resultsArr];
    const resultObj = copyResultArr?.length>0&& copyResultArr[i];
    const myObj = {...resultObj};
    copyResultArr[i] = {...resultObj, quantity: e.target.value, totalAmount: myObj.price*e.target.value }
    setResultArr(copyResultArr)
  }
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
    resultsArr.map((el, i) => {
      el.quantity&&cartObj.productName.push(el.name)
      el.quantity&&cartObj.productId.push(el.productId)
      el.quantity&&cartObj.quantity.push(Number(el.quantity))
      el.quantity&&cartObj.totalAmount.push(Number(el.totalAmount))
      el.quantity&&cartObj.productPrice.push(Number(el.price))
    })
    if(cartObj.quantity?.length>0){
        let isNegativeValue = false;
        console.log(cartObj);
        cartObj.quantity.map((el) =>{
          if(el<=0){
            isNegativeValue = true
          }
          
          resultsArr.map((el,i) =>{
            if(productNumbers[i].productNumber<el.quantity){
              isNegativeValue = true
            }
          })
          console.log('results Arr, ',resultsArr);
        })
        if(!isNegativeValue){
          buyProduct(cartObj)
        }
        console.log(isNegativeValue);
      // }
    }
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
      {products?.map((el, i) => {
        return (
          <div className= {style.product_box}>
            <h1>Name: {el.name}, Price: {el.price}, Quantity: {el.quantity}</h1>
            <form>
              <input type="number" max={el.quantity} disabled = {el.quantity === 0} onChange={(e) => numberHandler(e, i)} value={resultsArr&&resultsArr[i]?.quantity}  placeholder= {el.quantity === 0?`No ${el.name} found in store`:"Quantity"} />&nbsp;
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
        In Total: {resultsArr?.map(el => Number(el.totalAmount)).reduce((f,c) => f+c,0)}
        <div>
          <button onClick={soldHandler}>Sold</button>
        </div>
      </div>
    </div>
  )
}

export default App