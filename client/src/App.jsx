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
import BookService from "./pages/customer/BookService";

import VendorDashboard from "./pages/vendor/Dashboard";
import VendorProfile from "./pages/vendor/Profile";
import VendorServices from "./pages/vendor/Services";
import VendorBookings from "./pages/vendor/Bookings";
import CreateService from "./pages/vendor/CreateService";

import AdminDashboard from "./pages/admin/Dashboard";
import AdminVendors from "./pages/admin/Vendors";
import AdminCategories from "./pages/admin/Categories";
import AdminCustomers from "./pages/admin/Customers";
import CustomerDetails from "./pages/admin/CustomerDetails";
import VendorDetails from "./pages/admin/VendorDetails";

import ProtectedCustomerRoute from "./routes/ProtectedCustomerRoute";
import ProtectedAdminRoute from "./routes/ProtectedAdminRoute";
import ProtectedVendorRoute from "./routes/ProtectedVendorRoute";

import TestMap from "./pages/TestMap";
import TestAutocomplete from "./pages/TestAutocomplete";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test-map" element={<TestMap />} />
        <Route path="/test-autocomplete" element={<TestAutocomplete />} />
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

        {/* <Route
          path="/customer/services/:id"
          element={
            <ProtectedCustomerRoute>
              <ServiceDetails />
            </ProtectedCustomerRoute>
          }
        /> */}

        <Route
          path="/services/:serviceId"
          element={
            <ProtectedCustomerRoute>
              <ServiceDetails />
            </ProtectedCustomerRoute>
          }
        />

        <Route
          path="/customer/book-service/:serviceId"
          element={
            <ProtectedCustomerRoute>
              <BookService />
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

        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedVendorRoute>
              <VendorDashboard />
            </ProtectedVendorRoute>
          }
        />

        <Route
          path="/vendor/profile"
          element={
            <ProtectedVendorRoute>
              <VendorProfile />
            </ProtectedVendorRoute>
          }
        />

        <Route
          path="/vendor/services"
          element={
            <ProtectedVendorRoute>
              <VendorServices />
            </ProtectedVendorRoute>
          }
        />

        <Route
          path="/vendor/services/new"
          element={
            <ProtectedVendorRoute>
              <CreateService />
            </ProtectedVendorRoute>
          }
        />

        <Route
          path="/vendor/services/:serviceId/edit"
          element={
            <ProtectedVendorRoute>
              <CreateService />
            </ProtectedVendorRoute>
          }
        />

        <Route
          path="/vendor/bookings"
          element={
            <ProtectedVendorRoute>
              <VendorBookings />
            </ProtectedVendorRoute>
          }
        />

        {/* Admin */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/vendors"
          element={
            <ProtectedAdminRoute>
              <AdminVendors />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/vendors/:vendorId"
          element={
            <ProtectedAdminRoute>
              <VendorDetails />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/customers"
          element={
            <ProtectedAdminRoute>
              <AdminCustomers />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/customers/:customerId"
          element={
            <ProtectedAdminRoute>
              <CustomerDetails />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedAdminRoute>
              <AdminCategories />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
