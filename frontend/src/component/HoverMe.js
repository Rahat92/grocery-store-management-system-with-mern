import React from 'react'
import withHoc from './withHoc'
import CounterContext from './numberContext'
const HoverMe = ({increment, number, value}) => {
    
  return (
    <CounterContext.Consumer>
        {({value}) => {
            return (
                <div onMouseOver={increment}>HoverMe {number} haha {value}</div>
            )
        }}
       
    </CounterContext.Consumer>
  )
}

export default withHoc(HoverMe)