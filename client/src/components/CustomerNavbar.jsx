import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaRegUserCircle } from "react-icons/fa";
import { IoChevronDown } from "react-icons/io5";
import "./CustomerNavbar.css";

export default function CustomerNavbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login/customer");
  };

  return (
    <nav className="customer-navbar">
      <div className="container customer-navbar-container">
        <Link to="/" className="customer-logo">
          Servora
        </Link>

        <ul className="customer-menu">
          <li>
            <Link to="/customer/services">Services</Link>
          </li>

          <li>
            <Link to="/customer/my-bookings">
              My Bookings
            </Link>
          </li>
        </ul>

        <div
          className="customer-profile"
          onClick={() => setOpen(!open)}
        >
          <FaRegUserCircle className="profile-icon" />

          <span>{user?.name}</span>

          <IoChevronDown />

          {open && (
            <div className="profile-dropdown">
              <div className="profile-info">
                <h4>{user?.name}</h4>

                <p>{user?.email}</p>
              </div>

              <Link to="/customer/profile">
                My Profile
              </Link>

              <button onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}