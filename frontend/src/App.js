import CustomerCart from "./component/CustomerCart"
import Home from "./component/Home"
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element = {<Home />}/>
        <Route path="/customer/:customerId" element = {<CustomerCart />}/>
      </Routes>
    </Router>
    </>
  )  
}

export default App