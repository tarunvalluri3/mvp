import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import VendorLayout from "../../layouts/VendorLayout";
import "./Dashboard.css";

export default function Dashboard() {
  const [vendor, setVendor] = useState(null);
  const [stats, setStats] = useState({
    services: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/vendors/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setVendor(data.vendor);
      setStats(data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <VendorLayout>
        <h2>Loading Dashboard...</h2>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout>
      <div className="dashboard-page">
        {/* ===========================
            PAGE HEADER
        =========================== */}

        <div className="dashboard-header">
          <span className="dashboard-tag">Vendor Dashboard</span>

          <h1>Welcome back, {vendor?.businessName || "Vendor"}</h1>

          <p>
            Manage your business profile, services and bookings from one place.
          </p>
        </div>

        {/* ===========================
            SUMMARY CARDS
        =========================== */}

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h4>Business Status</h4>

            <span
              className={`status-badge ${vendor?.approvalStatus?.toLowerCase()}`}
            >
              {vendor?.approvalStatus}
            </span>
          </div>

          <div className="dashboard-card">
            <h4>Active Services</h4>

            <h2>{stats.services}</h2>

            <p>Services Published</p>
          </div>

          <div className="dashboard-card">
            <h4>Booking Requests</h4>

            <h2>{stats.bookings}</h2>

            <p>Total Requests</p>
          </div>
        </div>

        {/* ===========================
            QUICK ACTIONS
        =========================== */}

        <div className="dashboard-section">
          <h3>Quick Actions</h3>

          <div className="action-grid">
            <Link to="/vendor/services" className="action-card">
              <h4>Add New Service</h4>

              <p>Publish a new service for customers.</p>
            </Link>

            <Link to="/vendor/services" className="action-card">
              <h4>Manage Services</h4>

              <p>Edit, activate or deactivate services.</p>
            </Link>

            <Link to="/vendor/bookings" className="action-card">
              <h4>View Bookings</h4>

              <p>Manage customer booking requests.</p>
            </Link>

            <Link to="/vendor/profile" className="action-card">
              <h4>Edit Business Profile</h4>

              <p>Update your business information.</p>
            </Link>
          </div>
        </div>

        {/* ===========================
            RECENT ACTIVITY
        =========================== */}

        <div className="dashboard-section">
          <h3>Recent Activity</h3>

          <div className="empty-card">
            <h4>No activity yet</h4>

            <p>
              Once customers start interacting with your services, recent
              activity will appear here.
            </p>
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
