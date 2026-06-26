import { Link } from "react-router-dom";
import { HiOutlineBars3 } from "react-icons/hi2";
import { useState } from "react";
import "./LandingPage.css";

function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const customerRoute =
    user?.role === "CUSTOMER" ? "/customer/services" : "/login/customer";

  const vendorRoute =
    user?.role === "VENDOR" ? "/vendor/dashboard" : "/register/vendor";

  return (
    <div className="landing-page">
      <nav className="navbar">
        <div className="container navbar-container">
          <Link to="/" className="logo">
            Expertly
          </Link>

          <ul className="nav-menu">
            <li>
              <a href="#how-it-works">How it Works</a>
            </li>

            <li>
              <a href="#categories">Categories</a>
            </li>

            <li>
              <a href="#contact">Contact</a>
            </li>

            <li>
              <Link to="/login/customer">Login</Link>
            </li>
          </ul>

          <Link to={vendorRoute} className="secondary-btn">
            Become a Provider
          </Link>

          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            <HiOutlineBars3 />
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            <a href="#how-it-works">How it Works</a>

            <a href="#categories">Categories</a>

            <a href="#contact">Contact</a>

            <Link to="/login/customer">Login</Link>

            <Link to={vendorRoute} className="secondary-btn">
              Become a Provider
            </Link>
          </div>
        )}
      </nav>

      <section className="hero">
        <div className="container hero-container">
          <div className="hero-content">
            <span className="hero-badge">
              Trusted Marketplace for Professional Services
            </span>

            <h1>
              Connect with Trusted Professionals
              <br />
              for Every Service You Need.
            </h1>

            <p>
              From photographers and consultants to electricians and designers,
              discover verified professionals, compare services, and book with
              confidence.
            </p>

            <div className="hero-buttons">
              <Link to={customerRoute} className="primary-btn">
                Find Services
              </Link>

              <Link to={vendorRoute} className="secondary-btn">
                Become a Provider
              </Link>
            </div>

            <div className="hero-stats">
              <div>
                <h3>500+</h3>
                <span>Professionals</span>
              </div>

              <div>
                <h3>50+</h3>
                <span>Categories</span>
              </div>

              <div>
                <h3>5K+</h3>
                <span>Bookings</span>
              </div>
            </div>
          </div>

          <div className="hero-image">
            <div className="service-card card card-1">
              <span className="service-tag">Photography</span>
              <h4>Wedding Photography</h4>
              <p>★★★★★ 4.9 Rating</p>
            </div>

            <div className="service-card card card-2">
              <span className="service-tag">Electrician</span>
              <h4>Bridal Make Up</h4>
              <p>★★★★★ 4.8 Rating</p>
            </div>

            <div className="service-card card card-3">
              <span className="service-tag">Consulting</span>
              <h4>Fashion Designing</h4>
              <p>★★★★★ 5.0 Rating</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
