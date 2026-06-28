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
          {/* LEFT */}

          <div className="hero-content">
            <span className="hero-badge">
              Trusted Marketplace for Professional Services
            </span>

            <h1>
              Find Trusted Professionals
              <br />
              For Every Service That Matters.
            </h1>

            <p>
              Discover verified professionals across photography, home services,
              beauty, consulting and more. Compare services and book with
              confidence.
            </p>

            <div className="hero-buttons">
              <Link to={customerRoute} className="primary-btn">
                Explore Services
              </Link>

              <Link to={vendorRoute} className="secondary-btn">
                Become a Provider
              </Link>
            </div>

            <div className="hero-trust">
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

          {/* RIGHT */}

          <div className="hero-preview">
            <div className="search-widget">
              <small>Find Services</small>

              <h4>Wedding Photography</h4>

              <span>Hyderabad</span>

              <button>Explore</button>
            </div>

            <div className="service-widget">
              <div className="service-top">
                <span className="service-pill">Photography</span>

                <span className="rating">★ 4.9</span>
              </div>

              <h3>Wedding Photography</h3>

              <p>ABC Studio</p>

              <div className="service-bottom">
                <strong>₹25,000</strong>

                <button>Book Now</button>
              </div>
            </div>

            <div className="verified-widget">
              <div className="verified-icon">✓</div>

              <div>
                <h4>Verified Provider</h4>

                <p>Average response under 2 hours</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
