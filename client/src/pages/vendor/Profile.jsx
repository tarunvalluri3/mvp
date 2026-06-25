import { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import "./Profile.css";

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
    <div className="vendor-profile-page">
      <div className="vendor-profile-card">
        <h2>Complete Business Profile</h2>

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            name="businessName"
            placeholder="Business Name"
            value={form.businessName}
            onChange={handleChange}
            required
          />
          <textarea
            className="input textarea"
            name="businessDescription"
            placeholder="Business Description"
            value={form.businessDescription}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            name="address"
            placeholder="Business Address"
            value={form.address}
            onChange={handleChange}
            required
          />

          <button
            type="button"
            className="secondary-btn"
            onClick={currentLocation}
          >
            Use Current Location
          </button>

          <MapContainer center={position} zoom={13} className="map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker position={position} setPosition={setPosition} />
          </MapContainer>

          <div className="coordinates">
            <input className="input" value={position.lat} readOnly />
            <input className="input" value={position.lng} readOnly />
          </div>

          {error && <p className="error">{error}</p>}

          <button className="primary-btn submit-btn" disabled={loading}>
            {loading ? "Submitting..." : "Submit Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
