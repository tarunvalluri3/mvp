import { Navigate } from "react-router-dom";

export default function ProtectedVendorRoute({ children }) {
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login/vendor" replace />;
  }

  if (user?.role !== "VENDOR") {
    return <Navigate to="/" replace />;
  }

  return children;
}