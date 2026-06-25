import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CustomerRegister.css";

export default function CustomerRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      return setError("Passwords do not match.");
    }
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        role: "CUSTOMER",
      });
      navigate("/login/customer");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create Customer Account</h2>
        <p>Register to start booking services.</p>
        <form onSubmit={handleSubmit}>
          <input
            className="input"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            name="phone"
            placeholder="Phone Number"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            className="input"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />
          {error && <p className="error">{error}</p>}
          <button className="primary-btn submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link to="/login/customer">Login</Link>
        </div>
      </div>
    </div>
  );
}
