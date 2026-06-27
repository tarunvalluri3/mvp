import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import AdminLayout from "../../layouts/AdminLayout";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

import "./Dashboard.css";

const COLORS = {
  APPROVED: "#16a34a",
  PENDING: "#f59e0b",
  REJECTED: "#dc2626",
  SUSPENDED: "#6b7280",
};

export default function Dashboard() {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  const [vendorStatus, setVendorStatus] = useState([]);

  const [dashboard, setDashboard] = useState({
    stats: {
      totalVendors: 0,
      totalCustomers: 0,
      totalCategories: 0,
      totalServices: 0,
      totalBookings: 0,
    },

    recentVendors: [],

    recentBookings: [],
  });

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

      setDashboard(data);
      setVendorStatus(data.vendorStatus);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">Loading Dashboard...</div>
      </AdminLayout>
    );
  }

  const pieData = vendorStatus.map((item) => ({
    name: item.approvalStatus,
    value: item._count.approvalStatus,
  }));

  const platformData = [
    {
      name: "Vendors",
      value: dashboard.stats.totalVendors,
    },
    {
      name: "Customers",
      value: dashboard.stats.totalCustomers,
    },
    {
      name: "Services",
      value: dashboard.stats.totalServices,
    },
    {
      name: "Bookings",
      value: dashboard.stats.totalBookings,
    },
    {
      name: "Categories",
      value: dashboard.stats.totalCategories,
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard-page">
        <div className="dashboard-header">
          <span className="dashboard-tag">Administration</span>

          <h1>Marketplace Dashboard</h1>

          <p>
            Monitor vendors, customers, services and bookings from one place.
          </p>
        </div>

        <div className="dashboard-cards">
          <div className="dashboard-card">
            <h4>Total Vendors</h4>
            <h2>{dashboard.stats.totalVendors}</h2>
          </div>

          <div className="dashboard-card">
            <h4>Total Customers</h4>
            <h2>{dashboard.stats.totalCustomers}</h2>
          </div>

          <div className="dashboard-card">
            <h4>Total Services</h4>
            <h2>{dashboard.stats.totalServices}</h2>
          </div>

          <div className="dashboard-card">
            <h4>Total Bookings</h4>
            <h2>{dashboard.stats.totalBookings}</h2>
          </div>

          <div className="dashboard-card">
            <h4>Total Categories</h4>
            <h2>{dashboard.stats.totalCategories}</h2>
          </div>
        </div>

        {/* charts */}

        <div className="dashboard-charts">
          {/* Vendor Status */}

          <div className="dashboard-chart-card">
            <div className="chart-header">
              <h3>Vendor Approval Status</h3>

              <p>Current vendor distribution</p>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[entry.name]} />
                  ))}
                </Pie>

                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Platform Overview */}

          <div className="dashboard-chart-card">
            <div className="chart-header">
              <h3>Platform Overview</h3>

              <p>Total resources available</p>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={platformData}>
                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="value"
                  radius={[6, 6, 0, 0]}
                  barSize={28}
                  fill="#111827"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* next section below this comment */}

        <div className="dashboard-grid">
          {/* Recent Vendors */}

          <div className="dashboard-table-card">
            <h3>Recent Vendors</h3>

            {dashboard.recentVendors.length === 0 ? (
              <p>No vendors found.</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Business</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentVendors.map((vendor) => (
                    <tr key={vendor.id}>
                      <td>
                        <strong>{vendor.businessName}</strong>

                        <br />

                        <span>{vendor.user.email}</span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${vendor.approvalStatus.toLowerCase()}`}
                        >
                          {vendor.approvalStatus}
                        </span>
                      </td>

                      <td>
                        <Link
                          to={`/admin/vendors/${vendor.id}`}
                          className="table-view-btn"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Recent Bookings */}

          <div className="dashboard-table-card">
            <h3>Recent Bookings</h3>

            {dashboard.recentBookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Service</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {dashboard.recentBookings.map((booking) => (
                    <tr key={booking.id}>
                      <td>{booking.customer.name}</td>

                      <td>{booking.service.serviceName}</td>

                      <td>
                        <span className="status-badge">{booking.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
