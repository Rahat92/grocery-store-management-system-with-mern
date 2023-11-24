import CustomerCart from "./component/CustomerCart";
import Home from "./component/Home";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MonthlyStatics from "./component/MonthlyStatics";
import Customers from "./component/Customers";
import Products from "./component/Products";
import SellStats from "./component/SellStats";
import CategoryProducts from "./component/CategoryProducts";
import YearlyCustomersSell from "./component/YearlyCustomerSells";
const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/products" element={<Products />} />
          <Route
            path="/products/categories/:id"
            element={<CategoryProducts />}
          />
          <Route path="/customer/:customerId" element={<CustomerCart />} />
          <Route
            path="/customers-sell/:year"
            element={<YearlyCustomersSell />}
          />
          <Route
            path="/customer/:customerId/statistics"
            element={<MonthlyStatics />}
          />
          <Route path="/sell-stats-monthly" element={<SellStats />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
