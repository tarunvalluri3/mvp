import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import CustomerNavbar from "../../components/CustomerNavbar";
import "./BookService.css";

export default function BookService() {
  const { serviceId } = useParams();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [service, setService] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    eventDate: "",
    serviceAddress: "",
    notes: "",
  });

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/services/details/${serviceId}`,
      );

      setService(data.service);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      await axios.post(
        `${import.meta.env.VITE_API_URL}/bookings`,
        {
          serviceId,
          ...form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate("/customer/my-bookings");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create booking.");
    } finally {
      setLoading(false);
    }
  };

  if (!service) {
    return (
      <>
        <CustomerNavbar />

        <div className="customer-book-page">
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomerNavbar />

      <div className="customer-book-page">
        <div className="booking-layout">
          {/* LEFT */}

          <div className="booking-form-card">
            <div className="customer-book-header">
              <span className="customer-book-tag">Booking</span>

              <h1>Book Service</h1>

              <p>Complete the details below to confirm your booking.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="customer-form-group">
                <label>Event Date</label>

                <input
                  type="date"
                  name="eventDate"
                  className="customer-input"
                  value={form.eventDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="customer-form-group">
                <label>Service Address</label>

                <textarea
                  name="serviceAddress"
                  className="customer-input customer-textarea"
                  value={form.serviceAddress}
                  onChange={handleChange}
                  placeholder="Enter the service location..."
                  required
                />
              </div>

              <div className="customer-form-group">
                <label>Additional Notes</label>

                <textarea
                  name="notes"
                  className="customer-input customer-textarea"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Optional notes..."
                />
              </div>

              {error && <p className="customer-error">{error}</p>}

              <button className="customer-submit-btn" disabled={loading}>
                {loading ? "Creating Booking..." : "Confirm Booking"}
              </button>
            </form>
          </div>

          {/* RIGHT */}

          <div className="booking-summary-card">
            <h3>Booking Summary</h3>

            <div className="summary-row">
              <span>Service</span>

              <strong>{service.serviceName}</strong>
            </div>

            <div className="summary-row">
              <span>Provider</span>

              <strong>{service.vendor.businessName}</strong>
            </div>

            <div className="summary-row">
              <span>Category</span>

              <strong>{service.category.name}</strong>
            </div>

            <div className="summary-row">
              <span>Service Type</span>

              <strong>{service.serviceType}</strong>
            </div>

            <div className="summary-total">
              <span>Total Amount</span>

              <h2>₹ {Number(service.price).toLocaleString("en-IN")}</h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
