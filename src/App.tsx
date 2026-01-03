import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/routes/ProtectedRoute";
import Login from "./pages/Login";
import ChangePassword from "./pages/ChangePassword";
import HRDashboard from "./pages/HRDashboard";
import HRProfile from "./pages/HRProfile";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeProfile from "./pages/EmployeeProfile";
import Attendance from "./pages/Attendance";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route
              path="/change-password"
              element={
                <ProtectedRoute>
                  <ChangePassword />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/hr/dashboard"
              element={
                <ProtectedRoute allowedRoles={['HR']}>
                  <HRDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/hr/profile"
              element={
                <ProtectedRoute allowedRoles={['HR']}>
                  <HRProfile />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/hr/attendance"
              element={
                <ProtectedRoute allowedRoles={['HR']}>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/employee/dashboard"
              element={
                <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                  <EmployeeDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/employee/attendance"
              element={
                <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                  <Attendance />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/employee/profile"
              element={
                <ProtectedRoute allowedRoles={['EMPLOYEE']}>
                  <EmployeeProfile />
                </ProtectedRoute>
              }
            />
            
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
