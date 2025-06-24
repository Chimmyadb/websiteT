import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import StaffSidebar from "./components/StaffSidebar";
import Student from "./pages/Student";
import Parent from "./pages/Parent";
import Tour from "./pages/Tour";
import Payment from "./pages/Payment";
import StaffUsers from "./pages/StaffUsers";
import StaffTour from "./pages/StaffTour";
import StaffPayment from "./pages/StaffPayment"; // ✅ Import StaffPayment
import DashboardStats from "./pages/DashboardStats";

// Parent Dashboard Layout
const DashboardLayout = ({ children }) => (
  <div style={{ display: "flex" }}>
    <Sidebar />
    <div style={{ flex: 1, padding: "20px" }}>{children}</div>
  </div>
);

// Staff Dashboard Layout
const StaffDashboardLayout = ({ children }) => (
  <div style={{ display: "flex" }}>
    <StaffSidebar />
    <div style={{ flex: 1, padding: "20px" }}>{children}</div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Parent Dashboard Routes */}
        <Route
          path="/student"
          element={
            <DashboardLayout>
              <Student />
            </DashboardLayout>
          }
        />
        <Route
          path="/parent"
          element={
            <DashboardLayout>
              <Parent />
            </DashboardLayout>
          }
        />
        <Route
          path="/tour"
          element={
            <DashboardLayout>
              <Tour />
            </DashboardLayout>
          }
        />
        <Route
          path="/payment"
          element={
            <DashboardLayout>
              <Payment />
            </DashboardLayout>
          }
        />

        {/* Staff Dashboard Routes */}
         <Route
          path="/staff"
          element={
            <StaffDashboardLayout>
              <DashboardStats />
            </StaffDashboardLayout>
          }
        />
        <Route
          path="/staff/users"
          element={
            <StaffDashboardLayout>
              <StaffUsers />
            </StaffDashboardLayout>
          }
        />
        <Route
          path="/staff/tours"
          element={
            <StaffDashboardLayout>
              <StaffTour />
            </StaffDashboardLayout>
          }
        />
        <Route
          path="/staff/payments"
          element={
            <StaffDashboardLayout>
              <StaffPayment />
            </StaffDashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
