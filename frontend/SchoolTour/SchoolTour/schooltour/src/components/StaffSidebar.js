import React from "react";
import { Link } from "react-router-dom";
import '../css/Login.css';

const StaffSidebar = () => {
  return (
    <div className="sidebars">
      <div className="sidebar-headers">
        <h2>WELCOME TO STAFF DASHBOARD</h2>
      </div>
      <div className="menu">
        {/* <Link to="/staff/student" className="item">
          Students
        </Link>
        <Link to="/staff/parent" className="item">
          Parents
        </Link> */}
         <Link to="/staff/dashboard" className="item">
          Dashboard Home
        </Link>
        {/* <Link to="/staff/users" className="item">
          Staff Users
        </Link> */}
        <Link to="/staff/tour" className="item">
          Tours
        </Link>
          { <Link to="/staff/booking" className="item">
          Bookings
        </Link> }
        <Link to="/staff/payment" className="item">
          Payments
        </Link>
       
        <Link to="/" className="item">
          Logout
        </Link>
       
      </div>
    </div>
  );
};

export default StaffSidebar;
