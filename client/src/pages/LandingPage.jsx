import { Link } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useState } from "react";
import "./LandingPage.css";
import PublicNavbar from "../components/PublicNavbar";

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const customerRoute =
    user?.role === "CUSTOMER" ? "/customer/services" : "/login/customer";

  const vendorRoute =
    user?.role === "VENDOR" ? "/vendor/dashboard" : "/register/vendor";

  return (
    <div className="landing-page">
      <PublicNavbar />

      <section className="landing-hero">
        <div className="landing-hero-content">
          <span className="hero-tag">Professional Services Marketplace</span>

          <h1>
            Connect.
            <br />
            Book.
            <br />
            Grow.
          </h1>

          <p>
            A modern marketplace connecting customers with trusted service
            providers across multiple categories with a seamless booking
            experience.
          </p>

          <div className="hero-actions">
            <Link to={customerRoute} className="hero-btn primary">
              Customer
            </Link>

            <Link to={vendorRoute} className="hero-btn secondary">
              Become a Vendor
            </Link>

            <Link to="/login/admin" className="hero-btn outline">
              Admin Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
