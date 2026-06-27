import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import "./CustomerDetails.css";

export default function CustomerDetails() {
  const { customerId } = useParams();

  const token = localStorage.getItem("token");

  const [customer, setCustomer] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/customers/${customerId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCustomer(data.customer);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="empty-state">
          Loading customer...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>

      <div className="customer-details-page">

        <Link
          to="/admin/customers"
          className="back-link"
        >
          ← Back to Customers
        </Link>

        <div className="customer-profile-card">

          <div className="customer-avatar">

            <FaRegUserCircle />

          </div>

          <div>

            <h1>{customer.name}</h1>

            <p>Customer Account</p>

          </div>

        </div>

        <div className="details-card">

          <h2>Personal Information</h2>

          <div className="details-grid">

            <div>

              <label>Name</label>

              <span>{customer.name}</span>

            </div>

            <div>

              <label>Email</label>

              <span>{customer.email}</span>

            </div>

            <div>

              <label>Phone</label>

              <span>{customer.phone || "-"}</span>

            </div>

            <div>

              <label>Status</label>

              <span>{customer.status}</span>

            </div>

            <div>

              <label>Joined</label>

              <span>
                {new Date(customer.createdAt).toLocaleDateString("en-IN")}
              </span>

            </div>

          </div>

        </div>

        <div className="details-card">

          <h2>Booking History</h2>

          {customer.bookings.length === 0 ? (

            <div className="empty-state">

              No bookings found.

            </div>

          ) : (

            <div className="table-container">

              <table className="booking-table">

                <thead>

                  <tr>

                    <th>Service</th>

                    <th>Vendor</th>

                    <th>Price</th>

                    <th>Status</th>

                  </tr>

                </thead>

                <tbody>

                  {customer.bookings.map((booking) => (

                    <tr key={booking.id}>

                      <td>{booking.service.serviceName}</td>

                      <td>{booking.vendor.businessName}</td>

                      <td>
                        ₹{" "}
                        {Number(
                          booking.service.price
                        ).toLocaleString("en-IN")}
                      </td>

                      <td>

                        <span className="status-badge">

                          {booking.status}

                        </span>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </AdminLayout>
  );
}