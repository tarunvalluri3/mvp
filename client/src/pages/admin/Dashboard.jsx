import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Dashboard.css";

import AdminLayout from "../../layouts/AdminLayout";

export default function Dashboard() {
  const [stats, setStats] = useState({
    pendingVendors: 0,
    approvedVendors: 0,
    rejectedVendors: 0,
    suspendedVendors: 0,
    categories: 0,
  });

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/dashboard`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setStats(data.stats);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-page">
        <h2>Loading Dashboard...</h2>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        {/* ==========================================
          HEADER
      ========================================== */}

        <div className="dashboard-header">
          <span className="dashboard-tag">Administration</span>

          <h1>Marketplace Administration</h1>

          <p>
            Manage vendors, categories and monitor the overall marketplace from
            one central dashboard.
          </p>
        </div>

        {/* ==========================================
          STATS
      ========================================== */}

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h4>Pending Vendors</h4>

            <h2>{stats.pendingVendors}</h2>

            <p>Awaiting approval</p>
          </div>

          <div className="dashboard-card">
            <h4>Approved Vendors</h4>

            <h2>{stats.approvedVendors}</h2>

            <p>Currently active</p>
          </div>

          <div className="dashboard-card">
            <h4>Categories</h4>

            <h2>{stats.categories}</h2>

            <p>Available categories</p>
          </div>

          <div className="dashboard-card">
            <h4>Suspended Vendors</h4>

            <h2>{stats.suspendedVendors}</h2>

            <p>Currently suspended</p>
          </div>
        </div>

        {/* ==========================================
          QUICK ACTIONS
      ========================================== */}

        <div className="dashboard-section">
          <h3>Quick Actions</h3>

          <div className="action-grid">
            <Link to="/admin/vendors" className="action-card">
              <h4>Review Vendor Applications</h4>

              <p>Review vendor profiles and approve or reject applications.</p>
            </Link>

            <Link to="/admin/categories" className="action-card">
              <h4>Manage Categories</h4>

              <p>Create, edit and organize service categories.</p>
            </Link>
          </div>
        </div>

        {/* ==========================================
          RECENT ACTIVITY
      ========================================== */}

        <div className="dashboard-section">
          <h3>Recent Activity</h3>

          <div className="empty-card">
            <h4>No recent activity</h4>

            <p>
              Recent administrative actions will appear here as the platform
              becomes active.
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
