import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";

import CustomerLogin from "./pages/auth/CustomerLogin";
import CustomerRegister from "./pages/auth/CustomerRegister";

import VendorLogin from "./pages/auth/VendorLogin";
import VendorRegister from "./pages/auth/VendorRegister";

import AdminLogin from "./pages/auth/AdminLogin";

import Home from "./pages/customer/Home";
import Services from "./pages/customer/Services";
import ServiceDetails from "./pages/customer/ServiceDetails";
import MyBookings from "./pages/customer/MyBookings";
import Profile from "./pages/customer/Profile";

import VendorDashboard from "./pages/vendor/Dashboard";
import VendorProfile from "./pages/vendor/Profile";
import VendorServices from "./pages/vendor/Services";
import VendorBookings from "./pages/vendor/Bookings";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminVendors from "./pages/admin/Vendors";
import AdminCategories from "./pages/admin/Categories";

import ProtectedCustomerRoute from "./routes/ProtectedCustomerRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}

        <Route path="/" element={<LandingPage />} />

        <Route path="/login/customer" element={<CustomerLogin />} />

        <Route path="/register/customer" element={<CustomerRegister />} />

        <Route path="/login/vendor" element={<VendorLogin />} />

        <Route path="/register/vendor" element={<VendorRegister />} />

        <Route path="/admin" element={<AdminLogin />} />

        {/* Customer */}

        <Route
          path="/customer/home"
          element={
            <ProtectedCustomerRoute>
              <Home />
            </ProtectedCustomerRoute>
          }
        />

        <Route
          path="/customer/services"
          element={
            <ProtectedCustomerRoute>
              <Services />
            </ProtectedCustomerRoute>
          }
        />

        <Route
          path="/customer/services/:id"
          element={
            <ProtectedCustomerRoute>
              <ServiceDetails />
            </ProtectedCustomerRoute>
          }
        />

        <Route
          path="/customer/my-bookings"
          element={
            <ProtectedCustomerRoute>
              <MyBookings />
            </ProtectedCustomerRoute>
          }
        />

        <Route
          path="/customer/profile"
          element={
            <ProtectedCustomerRoute>
              <Profile />
            </ProtectedCustomerRoute>
          }
        />

        {/* Vendor */}

        <Route path="/vendor/dashboard" element={<VendorDashboard />} />

        <Route path="/vendor/profile" element={<VendorProfile />} />

        <Route path="/vendor/services" element={<VendorServices />} />

        <Route path="/vendor/bookings" element={<VendorBookings />} />

        {/* Admin */}

        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        <Route path="/admin/vendors" element={<AdminVendors />} />

        <Route path="/admin/categories" element={<AdminCategories />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
