import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./Profile.css"; 
import VendorLayout from "../../layouts/VendorLayout";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    businessName: "",
    businessDescription: "",
    address: "",
  });
  const [position, setPosition] = useState({ lat: 17.385, lng: 78.4867 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const currentLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported.");
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
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
          latitude: position.lat,
          longitude: position.lng,
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
              <label htmlFor="businessDescription">Business Description</label>

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

            <div className="form-group">
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

                <input className="input" value={position.lat} readOnly />
              </div>

              <div className="form-group">
                <label>Longitude</label>

                <input className="input" value={position.lng} readOnly />
              </div>
            </div>

            <p className="map-info">
              Click anywhere on the map to pin your business location.
            </p>

            <MapContainer center={position} zoom={13} className="map">
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />

              <LocationPicker position={position} setPosition={setPosition} />
            </MapContainer>
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
