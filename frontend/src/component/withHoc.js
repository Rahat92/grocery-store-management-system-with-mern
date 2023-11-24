import { useState } from "react"
import CounterContext from "./numberContext"
const withHoc = (Component) => {
    return () => {
        const [number, setNumber] = useState(0)
        const increment = () => {
            setNumber(prev => prev+1)
        }
        const decrement = () => {
            setNumber(prev => prev-1)
        }
        return (
            <div>
                <Component increment={increment} decrement={decrement} number = {number} />
            </div>
        )
    }
}
export default withHoc