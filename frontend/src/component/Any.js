import React from 'react'
import CounterContext from './numberContext'
const Any = () => {
  return (
    <div>
        <CounterContext.Consumer>
            {(value) => {
                return <div> my value is {value}</div>
            }}
        </CounterContext.Consumer>
    </div>
  )
}

export default Any