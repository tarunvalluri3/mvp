import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import CustomerNavbar from "../../components/CustomerNavbar";
import "./BookService.css";

import GooglePlaceAutocomplete from "../../components/GooglePlaceAutocomplete";

import GoogleMap from "../../components/GoogleMap";

export default function BookService() {
  const { serviceId } = useParams();

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const [service, setService] = useState(null);

  const [bookingMode, setBookingMode] = useState(
    service?.serviceType === "ONLINE" ? "ONLINE" : "ONSITE",
  );

  const [customerLocation, setCustomerLocation] = useState({
    latitude: null,
    longitude: null,
  });

  const [distance, setDistance] = useState(0);

  const [travelCharge, setTravelCharge] = useState(0);

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

      if (data.service.serviceType === "ONLINE") {
        setBookingMode("ONLINE");
      }

      if (data.service.serviceType === "ONSITE") {
        setBookingMode("ONSITE");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (
      bookingMode !== "ONSITE" ||
      !service ||
      !customerLocation.latitude ||
      !customerLocation.longitude
    ) {
      setDistance(0);
      setTravelCharge(0);
      return;
    }

    const vendor = new window.google.maps.LatLng(
      service.vendor.latitude,
      service.vendor.longitude,
    );

    const customer = new window.google.maps.LatLng(
      customerLocation.latitude,
      customerLocation.longitude,
    );

    const meters = window.google.maps.geometry.spherical.computeDistanceBetween(
      vendor,
      customer,
    );

    const km = meters / 1000;

    setDistance(km);

    setTravelCharge(Math.ceil(km * 10));
  }, [customerLocation, bookingMode, service]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const currentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setCustomerLocation({
          latitude,
          longitude,
        });

        try {
          const geocoder = new window.google.maps.Geocoder();

          const { results } = await geocoder.geocode({
            location: {
              lat: latitude,
              lng: longitude,
            },
          });

          if (results.length > 0) {
            setForm((prev) => ({
              ...prev,
              serviceAddress: results[0].formatted_address,
            }));
          }
        } catch (error) {
          console.error(error);
        }
      },
      () => {
        alert("Unable to fetch your location.");
      },
    );
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

              {service.serviceType === "BOTH" && (
                <div className="customer-form-group">
                  <label>Service Mode</label>

                  <div className="service-mode-options">
                    <label>
                      <input
                        type="radio"
                        value="ONLINE"
                        checked={bookingMode === "ONLINE"}
                        onChange={() => setBookingMode("ONLINE")}
                      />
                      Online
                    </label>

                    <label>
                      <input
                        type="radio"
                        value="ONSITE"
                        checked={bookingMode === "ONSITE"}
                        onChange={() => setBookingMode("ONSITE")}
                      />
                      At My Location
                    </label>
                  </div>
                </div>
              )}
              {bookingMode === "ONSITE" && (
                <div className="customer-form-group">
                  <div className="location-header">
                    <div>
                      <label>Service Address</label>

                      <p>Select where you want the service.</p>
                    </div>

                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={currentLocation}
                    >
                      Use Current Location
                    </button>
                  </div>

                  <GooglePlaceAutocomplete
                    placeholder="Search your location..."
                    onPlaceSelect={(place) => {
                      setForm((prev) => ({
                        ...prev,
                        serviceAddress: place.address,
                      }));

                      setCustomerLocation({
                        latitude: place.latitude,
                        longitude: place.longitude,
                      });
                    }}
                  />

                  {form.serviceAddress && (
                    <>
                      <p className="selected-address">
                        📍 {form.serviceAddress}
                      </p>

                      <div className="booking-map">
                        <GoogleMap
                          latitude={customerLocation.latitude}
                          longitude={customerLocation.longitude}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

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

            <div className="summary-row">
              <span>Service Price</span>

              <strong>₹ {Number(service.price).toLocaleString("en-IN")}</strong>
            </div>

            {bookingMode === "ONSITE" && (
              <>
                <div className="summary-row">
                  <span>Distance</span>

                  <strong>{distance.toFixed(2)} km</strong>
                </div>

                <div className="summary-row">
                  <span>Travel ({distance.toFixed(2)} km × ₹10)</span>

                  <strong>₹ {travelCharge}</strong>
                </div>
              </>
            )}

            <div className="summary-total">
              <span>Total Amount</span>

              <h2>
                ₹{" "}
                {(Number(service.price) + travelCharge).toLocaleString("en-IN")}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
