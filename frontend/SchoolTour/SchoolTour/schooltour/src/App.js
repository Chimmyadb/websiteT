import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Pages & Components
import Login from "./pages/Login";
import Sidebar from "./components/Sidebar";
import StaffSidebar from "./components/StaffSidebar";
import Student from "./pages/Student";
import Parent from "./pages/Parent";
import Tour from "./pages/Tour";
import StaffBooking from "./pages/StaffBooking";
import Payment from "./pages/Payment";
import StaffUsers from "./pages/StaffUsers";
import Report from "./pages/Report";
import StaffTour from "./pages/StaffTour";
import StaffPayment from "./pages/StaffPayment";
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
          path="/pages/parent"
          element={
            <DashboardLayout>
              <Parent />
            </DashboardLayout>
          }
        />
        <Route
          path="/pages/student"
          element={
            <DashboardLayout>
              <Student />
            </DashboardLayout>
          }
        />
        <Route
          path="/pages/tour"
          element={
            <DashboardLayout>
              <Tour />
            </DashboardLayout>
          }
        />
        <Route
          path="/pages/payment"
          element={
            <DashboardLayout>
              <Payment />
            </DashboardLayout>
          }
        />

        {/* Staff Dashboard Routes */}
        <Route
          path="/staff/dashboard"
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
          path="/staff/tour"
          element={
            <StaffDashboardLayout>
              <StaffTour />
            </StaffDashboardLayout>
          }
        />
        <Route
          path="/staff/payment"
          element={
            <StaffDashboardLayout>
              <StaffPayment />
            </StaffDashboardLayout>
          }
        />
        <Route
          path="/staff/report"
          element={
            <StaffDashboardLayout>
              <Report />
            </StaffDashboardLayout>
          }
        />
        <Route
          path="/staff/booking"
          element={
            <StaffDashboardLayout>
              <StaffBooking />
            </StaffDashboardLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
