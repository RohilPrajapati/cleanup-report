import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login.jsx";
import CleanUpReportList from "../pages/report/CleanReportList.jsx"
import AuthLayout from "../layouts/AuthLayout.jsx";
import NotFound from "../pages/NotFound.jsx";

function AppRoutes() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes Wrapper */}
      <Route element={<AuthLayout />}>
        <Route path="/cleanup/report" element={<CleanUpReportList />} />      
      </Route>
      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>

    
  );
}

export default AppRoutes;