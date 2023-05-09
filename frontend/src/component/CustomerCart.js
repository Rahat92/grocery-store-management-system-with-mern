import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetCustomerBikrisQuery } from '../features/bikri/bikriApi'
import { readableDate } from '../utils/readableDate'
import style from './CustomerCart.module.css';
import { useGetCustomerPaymentsQuery } from '../features/payments/paymentsApi';
const CustomerCart = () => {
  const [totalPages, setTotalPages] = useState()
  const [page, setPage] = useState(1)
  const [clickPage, setClickPage] = useState(true)
  const {customerId} = useParams()
  const {data:payments} = useGetCustomerPaymentsQuery(customerId)
  const { customerBikri, pages, currentPage, totalCartAmount } = useGetCustomerBikrisQuery({ customerId, page }, {
      skip: !clickPage,
      selectFromResult: ({data}) => ({
        customerBikri: data?.customerBikri,
        pages: data?.pages,
        totalCartAmount: data?.totalCartAmount,
        currentPage: data?.currentPage
      })
    })
    console.log(currentPage);
    console.log(payments);
    useEffect(() => {
      let pagesArr = []
      if (pages > 0) {
        for (let i = 1; i <= pages; i++){
          pagesArr.push(``)
        }
      }
      setTotalPages(pagesArr)
    }, [pages])
    
    const [myProducts, setMyProducts] = useState([])
    const [dates, setDates] = useState([])
    const [total, setTotal] = useState()
    const pageclickHandler = (page) => {
      setPage(page)
      setClickPage(true)
    }
    useEffect(() => {
      setClickPage(true)
      return () => setClickPage(false)
    },[page])
    useEffect(() => {
      if(customerBikri?.length>0){
        const cartAts = customerBikri.map(el => {
            return readableDate(el.cartAt)
        })
        let products = [];
        let totalAmounts = [];
        const objArr = customerBikri.map((bikri, i) => {
            products.push(bikri.productName.map((el, i) => {
              console.log(bikri);
                totalAmounts.push(bikri.totalAmount[i])
              return {
                    name: el,
                    price: bikri.productPrice[i],
                    quantity: bikri.quantity[i],
                    totalAmount: bikri.totalAmount[i]
                }
            }))
        })
          console.log(products);
          setTotal(totalAmounts.reduce((f,c) => f+c))
          setDates(cartAts);
          const final = cartAts.map((el,i) => {
            return {
              cartAt: el,
              products: products[i]
            }
          })
          console.log(final);
          setMyProducts(final)
      }
    },[customerBikri])
    console.log(myProducts);
  return (
    <div style={{position:'relative'}}>      
        <div style={{border:'5px solid green', padding:'1rem', color:'black'}}>
          <p style = {{color:'red'}}>কাস্টমারের নামঃ {payments?.customerName}</p>
          <p style = {{color:'red'}}>মোট বিক্রিঃ {totalCartAmount || 0} টাকা</p>
          <p style = {{color:'red'}}>মোট জমাঃ {payments?.totalPayments} টাকা</p>
        {totalCartAmount > payments?.totalPayments && <p style = {{color:'red'}}>বাকিঃ {totalCartAmount-payments?.totalPayments} টাকা</p>}
          <div style = {{display: 'flex', gap:'5rem', justifyContent:'space-between', padding:'1rem',}}>
            <div style = {{flex: '0 0 20%'}}>Date</div>
            <div style = {{flex: '0 0 10%'}}>Name</div>
            <div style = {{flex: '0 0 10%'}}>Price</div>
            <div style = {{flex: '0 0 10%'}}>Quantity</div>
            <div style = {{flex: '0 0 10%'}}>Amount</div>
            <div style = {{flex: '0 0 10%'}}>Total</div>
          </div>
          {myProducts.map((el,i) => {
          return <div style={{display:'flex', gap:'5rem', alignItems:'center', padding:'1rem', justifyContent:'space-between', flex:'1', marginBottom:'1rem', border:'1px solid black'}}><div style = {{flex: '0 0 20%'}}>{el.cartAt.day} {el.cartAt.month} {el.cartAt.year} at {el.cartAt.readableTime}</div><div style = {{flex: '0 0 10%'}}>{el.products.map(el => <div style = {{width: '100px'}}>{el.name}</div>)}</div><div style = {{flex: '0 0 10%'}}>{el.products.map(el => <div>{el.price}</div>)}</div><div style = {{flex: '0 0 10%'}}>{el.products.map(el => <div>{el.quantity}</div>)}</div><div style = {{flex: '0 0 10%'}}>{el.products.map(el => <div>{el.totalAmount}</div>)}</div><div style = {{flex: '0 0 10%'}}>{el.products.map(el => el.totalAmount)?.reduce((f,c) => f+c)} টাকা</div></div>
        })}
          <div style={{display:'flex', justifyContent:'flex-end'}}>Page: {pages}</div>
          <div style={{display:'flex', gap:'1rem', justifyContent:'center', position: 'fixed', bottom:'2rem', left:'50%', transform:'translateX(-50%)'}}>{totalPages?.map((el,i) => <button style={{background:'gray', display:'flex', backgroundColor: currentPage===i+1?'red':'', width:'25px', height:'25px', justifyContent:'center', borderRadius:'50%', alignItems:'center'}} onClick={() => pageclickHandler(i+1)}>{i+1}</button>)}</div>
        </div>
    </div>
  )
}

export default CustomerCart