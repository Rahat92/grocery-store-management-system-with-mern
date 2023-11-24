import React from 'react'
import CounterContext from './numberContext'
import HoverMe from './HoverMe'
import Any from './Any'
const TestContext = () => {
  return (
    <div>
        <CounterContext.Consumer>
            {({value}) => {
                return (
                    <div>value: {value}</div>
                )
            }}
        </CounterContext.Consumer>
        <CounterContext.Provider value = 'amar sonar bangla'>
            <Any />
        </CounterContext.Provider>
    </div>
  )
}

export default TestContext