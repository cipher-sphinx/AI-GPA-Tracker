import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import StaffLogin from "./components/StaffLogin";
import AdminLogin from "./components/AdminLogin";
import Profile from "./components/Profile";
import ProtectedRoute from "./utils/useAuth";
import StaffProfile from "./components/Profile/StaffProfile";
import AdminProfile from "./components/Profile/AdminProfile";
import StaffDashboard from "./components/Dashboard/StaffDashboard";
import AdminDashboard from "./components/Dashboard/AdminDashboard";
import StudentDashboard from "./components/Dashboard/StudentDashboard";
import "./global.css";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          <ProtectedRoute>
            <Login />
          </ProtectedRoute>} />
        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/dashboard/:studentId?" element={
          <ProtectedRoute>
            <StudentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/staff/:staffId?" element={
          <ProtectedRoute>
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard/admin/:adminId?" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/profile/:studentId" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/staff/:staffId" element={
          <ProtectedRoute>
            <StaffProfile />
          </ProtectedRoute>
        } />
        <Route path="/profile/admin/:adminId" element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}


export default App;
