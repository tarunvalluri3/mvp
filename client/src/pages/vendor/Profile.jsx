import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import VendorLayout from "../../layouts/VendorLayout";
import GooglePlaceAutocomplete from "../../components/GooglePlaceAutocomplete";
import GoogleMap from "../../components/GoogleMap";

export default function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    businessName: "",
    businessDescription: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const currentLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation is not supported.");
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((prev) => ({
          ...prev,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }));
      },
      () => alert("Unable to fetch location."),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/vendors/profile`,
        {
          businessName: form.businessName,
          businessDescription: form.businessDescription,
          address: form.address,
          latitude: Number(form.latitude),
          longitude: Number(form.longitude),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      navigate("/vendor/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorLayout>
      <div className="vendor-profile-page">
        <div className="page-header">
          <span className="page-tag">Vendor Onboarding</span>

          <h1>Complete Your Business Profile</h1>

          <p>
            Provide accurate business information to help customers discover and
            book your services with confidence.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-grid">
            {/* LEFT CARD */}

            <div className="profile-card">
              <h3>Business Information</h3>

              <p className="card-description">
                Tell customers about your business.
              </p>

              <div className="form-group">
                <label htmlFor="businessName">Business Name</label>

                <input
                  id="businessName"
                  className="input"
                  type="text"
                  name="businessName"
                  placeholder="Enter your business name"
                  value={form.businessName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="businessDescription">
                  Business Description
                </label>

                <textarea
                  id="businessDescription"
                  className="input textarea"
                  name="businessDescription"
                  placeholder="Describe your business and services..."
                  value={form.businessDescription}
                  onChange={handleChange}
                  rows={6}
                  required
                />
              </div>

              {/* <div className="form-group">
              <label htmlFor="address">Business Address</label>

              <input
                id="address"
                className="input"
                type="text"
                name="address"
                placeholder="Enter your business address"
                value={form.address}
                onChange={handleChange}
                required
              />
            </div> */}
              <div className="form-group">
                <label htmlFor="address">Business Address</label>

                <GooglePlaceAutocomplete
                  value={form.address}
                  placeholder="Search your business address..."
                  onPlaceSelect={(place) => {
                    setForm((prev) => ({
                      ...prev,
                      address: place.address,
                      latitude: place.latitude,
                      longitude: place.longitude,
                    }));
                  }}
                />
              </div>
            </div>

            {/* RIGHT CARD */}

            <div className="profile-card">
              <div className="location-header">
                <div>
                  <h3>Business Location</h3>

                  <p>Select the exact location of your business.</p>
                </div>

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={currentLocation}
                >
                  Use Current Location
                </button>
              </div>

              <div className="coordinates">
                <div className="form-group">
                  <label>Latitude</label>

                  <input className="input" value={form.latitude} readOnly />
                </div>

                <div className="form-group">
                  <label>Longitude</label>

                  <input className="input" value={form.longitude} readOnly />
                </div>
              </div>

              <p className="map-info">
                Click anywhere on the map to pin your business location.
              </p>

              <GoogleMap
                latitude={Number(form.latitude)}
                longitude={Number(form.longitude)}
              />
            </div>
          </div>

          {error && <p className="error">{error}</p>}

          <div className="submit-wrapper">
            <button
              type="submit"
              className="primary-btn submit-btn"
              disabled={loading}
            >
              {loading ? "Saving Profile..." : "Save Business Profile"}
            </button>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
}
