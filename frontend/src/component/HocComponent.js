import React, { useState } from 'react'
import withHoc from './withHoc'
import HoverMe from './HoverMe'

const HocComponent = ({ increment, decrement, number }) => {
    return (
      <div>
            <div style = {{display: 'flex', justifyContent:'center'}}>
                {number}
            </div>
            <div style = {{display: 'flex', gap: 5, justifyContent:'center', marginTop:'1rem'}}>
                <button onClick={increment} style = {{border: '1px solid black', padding:'1rem'}}>click me to increase Number</button><br />
                <button onClick={decrement} style = {{border: '1px solid black', padding:'1rem'}}>click me to decrease Number</button>
            </div>
            <HoverMe />
      </div>
    )
}

export default withHoc(HocComponent)