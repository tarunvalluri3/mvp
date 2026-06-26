import { Navigate } from "react-router-dom";

export default function ProtectedCustomerRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login/customer" replace />;
  }

  if (user?.role !== "CUSTOMER") {
    return <Navigate to="/" replace />;
  }

  return children;
}