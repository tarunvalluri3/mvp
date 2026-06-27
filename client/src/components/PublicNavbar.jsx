import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiBars3,
  HiXMark,
  HiChevronDown,
} from "react-icons/hi2";

import "./PublicNavbar.css";

export default function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <nav className="public-navbar">

      <div className="container public-navbar-container">

        <Link
          to="/"
          className="public-logo"
        >
          Servora
        </Link>

        <ul className="public-nav-links">

          <li>
            <Link to="/">
              Home
            </Link>
          </li>

          <li>
            <Link to="/customer/services">
              Services
            </Link>
          </li>

          <li>
            <Link to="/register/vendor">
              Become a Vendor
            </Link>
          </li>

        </ul>

        <div className="public-nav-actions">

          <div
            className="public-login-dropdown"
            onClick={() =>
              setLoginOpen(!loginOpen)
            }
          >

            <button className="public-login-btn">

              Login

              <HiChevronDown />

            </button>

            {loginOpen && (

              <div className="public-dropdown">

                <Link to="/login/customer">
                  Customer Login
                </Link>

                <Link to="/login/vendor">
                  Vendor Login
                </Link>

                <Link to="/admin">
                  Admin Login
                </Link>

              </div>

            )}

          </div>

          <Link
            to="/register/vendor"
            className="public-register-btn"
          >
            Join Now
          </Link>

        </div>

        <button
          className="public-mobile-btn"
          onClick={() =>
            setMenuOpen(!menuOpen)
          }
        >
          {menuOpen ? <HiXMark /> : <HiBars3 />}
        </button>

      </div>

      {menuOpen && (

        <div className="public-mobile-menu">

          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            to="/customer/services"
            onClick={() => setMenuOpen(false)}
          >
            Services
          </Link>

          <Link
            to="/register/vendor"
            onClick={() => setMenuOpen(false)}
          >
            Become a Vendor
          </Link>

          <hr />

          <Link
            to="/login/customer"
            onClick={() => setMenuOpen(false)}
          >
            Customer Login
          </Link>

          <Link
            to="/login/vendor"
            onClick={() => setMenuOpen(false)}
          >
            Vendor Login
          </Link>

          <Link
            to="/login/admin"
            onClick={() => setMenuOpen(false)}
          >
            Admin Login
          </Link>

        </div>

      )}

    </nav>
  );
}