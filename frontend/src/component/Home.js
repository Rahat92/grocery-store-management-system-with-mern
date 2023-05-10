import { useGetCustomerQuery, useGetCustomersQuery } from "../features/customer/customerApi";
import { useGetProductQuery } from "../features/product/productApi"
import style from '../App.module.css';
import { useEffect, useState } from "react";
import { useBuyProductMutation } from "../features/bikri/bikriApi";
import { Link } from "react-router-dom";
const Home = () => {
  const {data:products} = useGetProductQuery()
  const {data: customers} = useGetCustomersQuery()
  const [buyProduct, {isSuccess}] = useBuyProductMutation()
  const [customerId, setCustomerId] = useState()
  const [cartValues, setCartValues] = useState([])
  const [resultsArr, setResultArr] = useState([])
  const [cartProducts, setCartProducts] = useState([])
  const [customerName, setCustomerName] = useState();
  const [productNumbers, setProductNumbers] = useState([])
  useEffect(() => {
    // let resultArr;
    let productNumber;
    if(products?.length>0){
      // resultArr = products.map(el => {return {productId: el._id, name: el.name, price: el.price, quantity: '', totalAmount: ''}})
      productNumber = products.map(el => {
        return {
          productNumber: Number(el.quantity),
          name: el.name
        }
      })
    }
    console.log(productNumber);
    setProductNumbers(productNumber)
    // setResultArr(resultArr)
  },[products?.length])
  console.log(productNumbers);
  useEffect(() => {
    if(isSuccess){
      cartProducts.map((el) => {
        if(el.quantity){
          productNumbers[el.i].productNumber -= el.quantity;
          setProductNumbers(productNumbers)
        }
      })
      cartProducts.map(el => {
        el.quantity = ''
        el.totalAmount = ''
      })
    }
  }, [isSuccess])
  const numberHandler = (e, i, product) => {
    const { _id: productId, name, price, quantity } = product;
    const cartProductObj = {
      productId, i ,name, price,storeQuantity:quantity,  quantity: e.target.value*1, totalAmount: price* e.target.value*1
    }
    let copyCartProducts = [...cartProducts];
    const index = copyCartProducts.findIndex(el => el.name === name)
    if (index !== -1) {
      copyCartProducts[index] = cartProductObj;
    } else {
      copyCartProducts = [...copyCartProducts, cartProductObj]
    }
    setCartProducts(copyCartProducts.filter(el => el.quantity>0))
    // const copyResultArr = [...resultsArr];
    // const resultObj = copyResultArr?.length>0&& copyResultArr[i];
    // const myObj = {...resultObj};
    // copyResultArr[i] = {...resultObj, quantity: e.target.value, totalAmount: myObj.price*e.target.value }
    // setResultArr(copyResultArr)
  }
  console.log(cartProducts);
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
    cartProducts.map((el, i) => {
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
          
          cartProducts.map((el,i) =>{
            if(el.storeQuantity<el.quantity){
              isNegativeValue = true
            }
          })
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
      <select onChange={(e) =>{ setCustomerName({name:e.target.value.split(',')[1], id: e.target.value.split(',')[0]}); setCartValues([...cartValues.map(el => {
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
              <input type="number" max={el.quantity} disabled = {el.quantity === 0} onChange={(e) => numberHandler(e, i, el)} value={cartProducts&&cartProducts.find(product => product.name === el.name)?.quantity}  placeholder= {el.quantity === 0?`No ${el.name} found in store`:"Quantity"} />&nbsp;
            </form>
          </div>
        )
      })}
      <div className= {style.cartDetail}>
        <h1 className= {style.customerName}>Customer Name:<Link to = {`customer/${customerName?.id}`}>{customerName?.name}</Link></h1>
        {cartProducts.filter(pro => pro.quantity>0).map(el => {
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
        In Total: {cartProducts?.map(el => Number(el.totalAmount)).reduce((f,c) => f+c,0)}
        <div>
          <button onClick={soldHandler}>Sold</button>
        </div>
      </div>
    </div>
  )
}

export default Home