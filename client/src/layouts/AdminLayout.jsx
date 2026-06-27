import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  HiOutlineSquares2X2,
  HiOutlineUsers,
  HiOutlineTag,
  HiOutlineUserGroup,
  HiOutlineArrowLeftOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
} from "react-icons/hi2";
import "./AdminLayout.css";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/admin");
  };

  return (
    <div className="admin-layout">
      {/* Mobile Header */}
      <header className="mobile-header">
        <h2>Servora</h2>

        <button className="mobile-menu-btn" onClick={() => setMenuOpen(true)}>
          <HiOutlineBars3 />
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`admin-sidebar ${menuOpen ? "open" : ""}`}>
        <button className="close-menu-btn" onClick={() => setMenuOpen(false)}>
          <HiOutlineXMark />
        </button>

        <div className="admin-logo">
          <h2>Servora</h2>
          <p>Marketplace Admin</p>
        </div>

        <nav className="admin-nav">
          <Link
            to="/admin/dashboard"
            onClick={() => setMenuOpen(false)}
            className={location.pathname === "/admin/dashboard" ? "active" : ""}
          >
            <HiOutlineSquares2X2 />
            Dashboard
          </Link>

          <Link
            to="/admin/customers"
            onClick={() => setMenuOpen(false)}
            className={
              location.pathname.startsWith("/admin/customers") ? "active" : ""
            }
          >
            <HiOutlineUserGroup />
            Customers
          </Link>

          <Link
            to="/admin/vendors"
            onClick={() => setMenuOpen(false)}
            className={
              location.pathname.startsWith("/admin/vendors") ? "active" : ""
            }
          >
            <HiOutlineUsers />
            Vendors
          </Link>

          <Link
            to="/admin/categories"
            onClick={() => setMenuOpen(false)}
            className={
              location.pathname.startsWith("/admin/categories") ? "active" : ""
            }
          >
            <HiOutlineTag />
            Categories
          </Link>
        </nav>

        <button className="logout-btn" onClick={logout}>
          <HiOutlineArrowLeftOnRectangle />
          Logout
        </button>
      </aside>

      {/* Overlay */}
      {menuOpen && (
        <div className="sidebar-overlay" onClick={() => setMenuOpen(false)} />
      )}

      {/* Main */}
      <main className="admin-content">{children}</main>
    </div>
  );
}
