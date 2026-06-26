import { NavLink, useNavigate } from "react-router-dom";
import { FiHome, FiGrid, FiCalendar, FiUser, FiLogOut } from "react-icons/fi";
import { IoClose } from "react-icons/io5";

import "./VendorSidebar.css";

export default function VendorSidebar({ open, setOpen }) {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login/vendor");
  };

  return (
    <aside className={`vendor-sidebar ${open ? "open" : ""}`}>
      <div>
        <button className="close-sidebar" onClick={() => setOpen(false)}>
          <IoClose />
        </button>
        <div className="sidebar-brand">
          <h2>Servora</h2>

          <p>Professional Marketplace</p>
        </div>

        <hr className="sidebar-divider" />

        <nav className="sidebar-menu">
          <NavLink to="/vendor/dashboard">
            <FiHome />
            <span>Dashboard</span>
          </NavLink>

          <NavLink to="/vendor/services">
            <FiGrid />
            <span>My Services</span>
          </NavLink>

          <NavLink to="/vendor/bookings">
            <FiCalendar />
            <span>Bookings</span>
          </NavLink>

          <NavLink to="/vendor/profile">
            <FiUser />
            <span>Business Profile</span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="vendor-user">
          <h4>{user?.name}</h4>

          <p>{user?.email}</p>
        </div>

        <button className="logout-btn" onClick={logout}>
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
}
