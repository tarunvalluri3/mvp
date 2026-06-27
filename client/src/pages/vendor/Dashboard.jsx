import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import VendorLayout from "../../layouts/VendorLayout";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import "./Dashboard.css";

export default function Dashboard() {
  const [vendor, setVendor] = useState(null);
  const [stats, setStats] = useState({
    services: 0,
    bookings: 0,
  });

  const [loading, setLoading] = useState(true);

  const [recentServices, setRecentServices] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);

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
      setRecentServices(data.recentServices);
      setRecentBookings(data.recentBookings);
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

  const pieData = [
    {
      name: "Active",
      value: stats.activeServices,
    },
    {
      name: "Inactive",
      value: stats.inactiveServices,
    },
  ];

  const overviewData = [
    {
      name: "Services",
      value: stats.services,
    },
    {
      name: "Bookings",
      value: stats.bookings,
    },
    {
      name: "Approved",
      value: vendor?.approvalStatus === "APPROVED" ? 1 : 0,
    },
  ];

  const COLORS = ["#16a34a", "#dc2626"];

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

        <div className="dashboard-charts">
          <div className="dashboard-chart-card">
            <div className="chart-header">
              <h3>Service Status</h3>

              <p>Active vs Inactive Services</p>
            </div>

            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="dashboard-chart-card">
            <div className="chart-header">
              <h3>Business Overview</h3>

              <p>Current marketplace summary</p>
            </div>

            <ResponsiveContainer width="80%" height={240}>
              <BarChart data={overviewData}>
                {/* <CartesianGrid strokeDasharray="3 3" /> */}

                <XAxis dataKey="name" />

                <YAxis />

                <Tooltip />

                <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#111827" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ===========================
            RECENT ACTIVITY
        =========================== */}

        <div className="dashboard-grid">
          <div className="dashboard-table-card">
            <h3>Recent Services</h3>

            {recentServices.length === 0 ? (
              <p>No services found.</p>
            ) : (
              recentServices.map((service) => (
                <div className="dashboard-row" key={service.id}>
                  <div>
                    <h4>{service.serviceName}</h4>

                    <span>{` Type : ${service.serviceType}`}</span>
                  </div>

                  <strong>
                    ₹{Number(service.price).toLocaleString("en-IN")}
                  </strong>
                </div>
              ))
            )}
          </div>

          <div className="dashboard-table-card">
            <h3>Recent Bookings</h3>

            {recentBookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              recentBookings.map((booking) => (
                <div className="dashboard-row" key={booking.id}>
                  <div>
                    <h4>{booking.service.serviceName}</h4>

                    <span>{booking.customer.name}</span>
                  </div>

                  <span className="status-badge">{booking.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </VendorLayout>
  );
}
