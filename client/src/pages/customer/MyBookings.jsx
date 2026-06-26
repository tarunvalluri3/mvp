import { useEffect, useState } from "react";
import axios from "axios";

import CustomerNavbar from "../../components/CustomerNavbar";
import "./MyBookings.css";

export default function MyBookings() {
  const token = localStorage.getItem("token");

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/bookings/my-bookings`,
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

  return (
    <>
      <CustomerNavbar />

      <div className="customer-bookings-page">

        <div className="customer-page-header">

          <span className="customer-page-tag">
            Bookings
          </span>

          <h1>My Bookings</h1>

          <p>
            Track all your service booking requests.
          </p>

        </div>

        {loading ? (

          <div className="customer-empty-card">
            Loading...
          </div>

        ) : bookings.length === 0 ? (

          <div className="customer-empty-card">
            <h3>No Bookings Found</h3>

            <p>
              You haven't booked any services yet.
            </p>
          </div>

        ) : (

          <div className="customer-bookings-list">

            {bookings.map((booking) => (

              <div
                className="customer-booking-card"
                key={booking.id}
              >

                <div className="customer-booking-header">

                  <div>

                    <h3>
                      {booking.service.serviceName}
                    </h3>

                    <p>
                      {booking.vendor.businessName}
                    </p>

                  </div>

                  <span
                    className={`booking-status ${booking.status.toLowerCase()}`}
                  >
                    {booking.status}
                  </span>

                </div>

                <div className="customer-booking-body">

                  <p>

                    <strong>Event Date:</strong>{" "}

                    {new Date(
                      booking.eventDate
                    ).toLocaleDateString("en-IN")}

                  </p>

                  <p>

                    <strong>Service Address:</strong>{" "}

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

              </div>

            ))}

          </div>

        )}

      </div>

    </>
  );
}