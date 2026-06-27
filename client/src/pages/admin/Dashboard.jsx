import { useEffect, useState } from "react";
import axios from "axios";

import AdminLayout from "../../layouts/AdminLayout";

import "./Dashboard.css";

export default function Dashboard() {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

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
        }
      );

      setDashboard(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="dashboard-loading">
          Loading Dashboard...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="admin-dashboard-page">

        <div className="dashboard-header">

          <span className="dashboard-tag">
            Administration
          </span>

          <h1>
            Marketplace Dashboard
          </h1>

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

        <div className="dashboard-grid">

          <div className="dashboard-table-card">

            <h3>
              Recent Vendors
            </h3>

            {dashboard.recentVendors.length === 0 ? (

              <p>No vendors found.</p>

            ) : (

              dashboard.recentVendors.map((vendor) => (

                <div
                  className="dashboard-row"
                  key={vendor.id}
                >

                  <div>

                    <h4>{vendor.businessName}</h4>

                    <span>{vendor.user.name}</span>

                  </div>

                  <small>{vendor.user.email}</small>

                </div>

              ))

            )}

          </div>

          <div className="dashboard-table-card">

            <h3>
              Recent Bookings
            </h3>

            {dashboard.recentBookings.length === 0 ? (

              <p>No bookings found.</p>

            ) : (

              dashboard.recentBookings.map((booking) => (

                <div
                  className="dashboard-row"
                  key={booking.id}
                >

                  <div>

                    <h4>{booking.service.serviceName}</h4>

                    <span>{booking.customer.name}</span>

                  </div>

                  <small>{booking.status}</small>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </AdminLayout>
  );
}