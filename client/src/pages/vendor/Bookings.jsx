import { useEffect, useState } from "react";
import axios from "axios";

import VendorLayout from "../../layouts/VendorLayout";
import "./Bookings.css";

export default function Bookings() {
  const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/vendor`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setBookings(data.bookings);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (bookingId, action) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/bookings/${bookingId}/${action}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <VendorLayout>
      <div className="vendor-bookings-page">
        <div className="vendor-page-header">
          <span className="vendor-page-tag">Bookings</span>

          <h1>Customer Bookings</h1>

          <p>Manage incoming booking requests.</p>
        </div>

        {loading ? (
          <div className="vendor-empty-card">Loading...</div>
        ) : bookings.length === 0 ? (
          <div className="vendor-empty-card">
            <h3>No Bookings</h3>

            <p>Booking requests will appear here.</p>
          </div>
        ) : (
          <div className="vendor-bookings-table-wrapper">
            <table className="vendor-bookings-table">
              <thead>
                <tr>
                  <th>Customer</th>

                  <th>Service</th>

                  <th>Event Date</th>

                  <th>Price</th>

                  <th>Status</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>
                      <strong>{booking.customer.name}</strong>

                      <p>{booking.serviceAddress}</p>
                    </td>

                    <td>{booking.service.serviceName}</td>

                    <td>
                      {new Date(booking.eventDate).toLocaleDateString("en-IN")}
                    </td>

                    <td>
                      ₹ {Number(booking.service.price).toLocaleString("en-IN")}
                    </td>

                    <td>
                      <span
                        className={`vendor-status ${booking.status.toLowerCase()}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        {booking.status === "REQUESTED" && (
                          <>
                            <button
                              className="accept-btn"
                              onClick={() => updateStatus(booking.id, "accept")}
                            >
                              Accept
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() => updateStatus(booking.id, "reject")}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {booking.status !== "REQUESTED" && (
                          <span className="completed-text">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </VendorLayout>
  );
}
