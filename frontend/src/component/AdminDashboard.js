import React from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div>
      <ul>
        <li>
          <Link to="/customers-sell/2023">Yearly customer total sell</Link>
        </li>
        <li>
          <Link to="/sell-stats-monthly">Monthly Sell Statistics</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard;
