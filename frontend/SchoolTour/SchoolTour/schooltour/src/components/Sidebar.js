import React from "react";
import { Link } from "react-router-dom";
import '../css/Login.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>WELCOME TO PARENT DASHBOARD</h2>
      </div>
      <div className="menu">
       
    
        <Link to="../pages/Student" className="item">
          Student
        </Link>

        <Link to="../pages/Tour" className="item">
          Tour
        </Link>
        <Link to="../pages/Payment" className="item">
          Payment
        </Link>
         <Link to="/" className="item">
          Logout
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;