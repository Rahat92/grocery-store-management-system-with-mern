import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useGetCustomerBikrisQuery } from '../features/bikri/bikriApi'
import { readableDate } from '../utils/readableDate'
import style from './CustomerCart.module.css';
const CustomerCart = () => {
    const {customerId} = useParams()
    const {data: customerBikri} = useGetCustomerBikrisQuery(customerId)
    console.log(customerBikri);
    const [myProducts, setMyProducts] = useState([])
    const [dates, setDates] = useState([])
    const [total, setTotal] = useState()
    useEffect(() => {
      if(customerBikri?.length>0){
        const cartAts = customerBikri.map(el => {
            return readableDate(el.cartAt)
        })
        let products = [];
        let totalAmounts = [];
        const objArr = customerBikri.map((bikri, i) => {
           
            products.push(bikri.productName.map((el, i) => {
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
          setMyProducts(products)
          setDates(cartAts);
      }
    },[customerBikri])
    console.log(total);
  return (
    <div style={{position:'relative'}}>      
          
          <table className={style.myTable}>
              <tr><td colSpan={'2'}><p>Your total Cart amount till now from our shop is {total} taka</p></td></tr>
              <tr style={{border:'none'}}>&nbsp;</tr>
              <tr><td style={{ width:'150px', borderRight:'1px solid gray', position:'relative' }}><p style={{position:'absolute', top:'1rem'}}>Date</p></td><td><td style={{width: '150px', display:'inline-block', marginTop:'1rem'}}>Name</td><td style={{width: '150px', display: 'inline-block', marginTop:'1rem'}}>Price</td><td style={{width: '150px', display: 'inline-block', marginTop:'1rem'}}>Quantity</td><td style={{width: '150px', display: 'inline-block',marginTop:'1rem'}}>Total Product Price</td><td style={{ textAlign: 'center', display:'inline-block', width: '150px' }}></td></td><td style={{display:'inline-block', marginTop:'1rem'}}>Total Amount</td></tr>
              
              {customerBikri?.map((el, i) => <tr><td style={{borderRight:'1px solid', width: '225px', paddingLeft:'.5rem'}}>{dates[i]?.day} {dates[i]?.month} {dates[i]?.year} at {dates[i]?.readableTime}</td><td style={{color:'green', padding:'0', margin:'0', width: '620px'}}>{myProducts[i]?.map(product => <tr>{Object.values(product).map(el => <td style={{ display: 'inline-block', width: '150px', padding: '3px' }}>{el}</td>)}</tr>)}</td><tr></tr><div style={{width: '150px',display:'flex', position:'relative', backgroundColor:'red'}}><div style={{position:'absolute', display:'flex', top:'50%', alignItems:'center', borderLeft:'1px solid black'}}>{myProducts[i]?.map(el => el.totalAmount).reduce((f,c) => f+c)} taka</div></div></tr>)}
        </table>
        
    </div>
  )
}

export default CustomerCart