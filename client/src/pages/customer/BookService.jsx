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
        `${import.meta.env.VITE_API_URL}/services/details/${serviceId}`
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
        }
      );

      navigate("/customer/my-bookings");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to create booking."
      );
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

        <div className="customer-book-card">

          <div className="customer-book-header">

            <span className="customer-book-tag">
              Booking
            </span>

            <h1>Book Service</h1>

            <p>
              Complete the booking details below.
            </p>

          </div>

          <div className="selected-service">

            <h3>
              {service.serviceName}
            </h3>

            <p>
              {service.vendor.businessName}
            </p>

            <h2>
              ₹ {Number(service.price).toLocaleString("en-IN")}
            </h2>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="customer-form-group">

              <label>
                Event Date
              </label>

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

              <label>
                Service Address
              </label>

              <textarea
                name="serviceAddress"
                className="customer-input customer-textarea"
                placeholder="Enter the complete address..."
                value={form.serviceAddress}
                onChange={handleChange}
                required
              />

            </div>

            <div className="customer-form-group">

              <label>
                Additional Notes
              </label>

              <textarea
                name="notes"
                className="customer-input customer-textarea"
                placeholder="Any special instructions..."
                value={form.notes}
                onChange={handleChange}
              />

            </div>

            {error && (
              <p className="customer-error">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="customer-submit-btn"
              disabled={loading}
            >
              {loading
                ? "Creating Booking..."
                : "Confirm Booking"}
            </button>

          </form>

        </div>

      </div>
    </>
  );
}