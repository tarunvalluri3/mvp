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
        }
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
        }
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

          <span className="vendor-page-tag">
            Bookings
          </span>

          <h1>Customer Bookings</h1>

          <p>
            Manage incoming booking requests.
          </p>

        </div>

        {loading ? (

          <div className="vendor-empty-card">
            Loading...
          </div>

        ) : bookings.length === 0 ? (

          <div className="vendor-empty-card">
            <h3>No Bookings</h3>

            <p>
              Booking requests will appear here.
            </p>

          </div>

        ) : (

          <div className="vendor-bookings-list">

            {bookings.map((booking) => (

              <div
                className="vendor-booking-card"
                key={booking.id}
              >

                <div className="vendor-booking-header">

                  <div>

                    <h3>
                      {booking.service.serviceName}
                    </h3>

                    <p>
                      {booking.customer.name}
                    </p>

                  </div>

                  <span
                    className={`vendor-status ${booking.status.toLowerCase()}`}
                  >
                    {booking.status}
                  </span>

                </div>

                <div className="vendor-booking-body">

                  <p>

                    <strong>Date:</strong>{" "}

                    {new Date(
                      booking.eventDate
                    ).toLocaleDateString("en-IN")}

                  </p>

                  <p>

                    <strong>Address:</strong>{" "}

                    {booking.serviceAddress}

                  </p>

                  <p>

                    <strong>Price:</strong>{" "}

                    ₹{" "}

                    {Number(
                      booking.service.price
                    ).toLocaleString("en-IN")}

                  </p>

                </div>

                {booking.status === "REQUESTED" && (

                  <div className="vendor-actions">

                    <button
                      className="accept-btn"
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "accept"
                        )
                      }
                    >
                      Accept
                    </button>

                    <button
                      className="reject-btn"
                      onClick={() =>
                        updateStatus(
                          booking.id,
                          "reject"
                        )
                      }
                    >
                      Reject
                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </VendorLayout>
  );
}