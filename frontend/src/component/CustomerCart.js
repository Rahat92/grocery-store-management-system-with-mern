import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetCustomerBikrisQuery } from '../features/bikri/bikriApi'
import { readableDate } from '../utils/readableDate'
import style from './CustomerCart.module.css';
const CustomerCart = () => {
  const [totalPages, setTotalPages] = useState()
  const [page, setPage] = useState(1)
  const [clickPage, setClickPage] = useState(true)
    const {customerId} = useParams()
  const { customerBikri, pages } = useGetCustomerBikrisQuery({ customerId, page }, {
      skip: !clickPage,
      selectFromResult: ({data}) => ({
        customerBikri: data?.customerBikri,
        pages: data?.pages
      })
    })
    console.log(pages);
    console.log(customerBikri);
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
            // prices.push(el.productPrice)
            // quantitys.push(el.quantity)
            // totalAmounts.push(el.quantity)
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
          
          {/* <table className={style.myTable}>
              <tr><td colSpan={'2'}><p>Your total Cart amount till now from our shop is {total} taka</p></td></tr>
              <tr style={{border:'none'}}>&nbsp;</tr>
              <tr><td style={{ width:'150px', borderRight:'1px solid gray', position:'relative' }}><p style={{position:'absolute', top:'1rem'}}>Date</p></td><td><td style={{width: '150px', display:'inline-block', marginTop:'1rem'}}>Name</td><td style={{width: '150px', display: 'inline-block', marginTop:'1rem'}}>Price</td><td style={{width: '150px', display: 'inline-block', marginTop:'1rem'}}>Quantity</td><td style={{width: '150px', display: 'inline-block',marginTop:'1rem'}}>Total Product Price</td><td style={{ textAlign: 'center', display:'inline-block', width: '150px' }}></td></td><td style={{display:'inline-block', marginTop:'1rem'}}>Total Amount</td></tr>
              
              {customerBikri?.map((el, i) => <tr><td style={{borderRight:'1px solid', width: '225px', paddingLeft:'.5rem'}}>{dates[i]?.day} {dates[i]?.month} {dates[i]?.year} at {dates[i]?.readableTime}</td><td style={{color:'green', padding:'0', margin:'0', width: '620px'}}>{myProducts[i]?.map(product => <tr>{Object.values(product).map(el => <td style={{ display: 'inline-block', width: '150px', padding: '3px' }}>{el}</td>)}</tr>)}</td><tr></tr><div style={{width: '150px',display:'flex', position:'relative', backgroundColor:'red'}}><div style={{position:'absolute', display:'flex', top:'50%', alignItems:'center', borderLeft:'1px solid black'}}>{myProducts[i]?.map(el => el.totalAmount).reduce((f,c) => f+c)} taka</div></div></tr>)}
        </table> */}
    {console.log(myProducts)}
        <div style={{border:'5px solid green', padding:'1rem', color:'black'}}>
          <div style = {{display: 'flex', gap:'5rem', justifyContent:'space-between', padding:'2rem',}}>
            <div style = {{flex: '0 0 20%'}}>Date</div>
            <div style = {{flex: '0 0 10%'}}>Name</div>
            <div style = {{flex: '0 0 10%'}}>Price</div>
            <div style = {{flex: '0 0 10%'}}>Quantity</div>
            <div style = {{flex: '0 0 10%'}}>Amount</div>
            <div style = {{flex: '0 0 10%'}}>Total</div>
          </div>
          {myProducts.map((el,i) => {
          return <div style={{display:'flex', gap:'5rem', alignItems:'center', padding:'2rem', justifyContent:'space-between', flex:'1', marginBottom:'1rem', border:'1px solid black'}}><div style = {{flex: '0 0 20%'}}>{el.cartAt.day} {el.cartAt.month} {el.cartAt.year} at {el.cartAt.readableTime}</div><div style = {{flex: '0 0 10%'}}>{el.products.map(el => <div style = {{width: '100px'}}>{el.name}</div>)}</div><div style = {{flex: '0 0 10%'}}>{el.products.map(el => <div>{el.price}</div>)}</div><div style = {{flex: '0 0 10%'}}>{el.products.map(el => <div>{el.quantity}</div>)}</div><div style = {{flex: '0 0 10%'}}>{el.products.map(el => <div>{el.totalAmount}</div>)}</div><div style = {{flex: '0 0 10%'}}>{el.products.map(el => el.totalAmount)?.reduce((f,c) => f+c)} টাকা</div></div>
        })}
        <div style={{display:'flex', justifyContent:'flex-end'}}>Page: {pages}</div>
        <div style={{display:'flex', gap:'1rem', justifyContent:'center'}}>{totalPages?.map((el,i) => <div style={{background:'gray', display:'flex', width:'25px', height:'25px', justifyContent:'center', borderRadius:'50%', alignItems:'center'}} onClick={() => pageclickHandler(i+1)}><button>{i+1}</button></div>)}</div>
        </div>
    </div>
  )
}

export default CustomerCart