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
        <Link to="/parent" className="item">
          Parent
        </Link>
        <Link to="/student" className="item">
          Student
        </Link>
        
        <Link to="/tour" className="item">
          Tour
        </Link>
        <Link to="/payment" className="item">
          Payment
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;