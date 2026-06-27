import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./VendorLogin.css";
import PublicNavbar from "../../components/PublicNavbar";

export default function VendorLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email: form.email,
          password: form.password,
          role: "VENDOR",
        },
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      try {
        await axios.get(`${import.meta.env.VITE_API_URL}/vendors/profile`, {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        navigate("/vendor/dashboard");
      } catch (error) {
        if (error.response?.status === 404) {
          navigate("/vendor/profile");
        } else {
          throw error;
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return ( 
    <> <PublicNavbar />
    <div className="auth-page">
      <div className="auth-card">
        <h2>Vendor Login</h2>
        <p>Sign in to manage your business.</p>

        <form onSubmit={handleSubmit}>
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
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          {error && <p className="error">{error}</p>}

          <button
            type="submit"
            className="primary-btn submit-btn"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register/vendor">Register</Link>
        </div>
      </div>
    </div>
    </>
  );
}
