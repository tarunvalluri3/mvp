import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegUserCircle } from "react-icons/fa";

import CustomerNavbar from "../../components/CustomerNavbar";

import "./Profile.css";

export default function Profile() {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/auth/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/profile`,
        {
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Profile updated successfully.");

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to update profile."
      );

    } finally {

      setLoading(false);

    }
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password.newPassword !== password.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {

      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/change-password`,
        password,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Password updated successfully.");

      setPassword({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

    } catch (err) {

      setError(
        err.response?.data?.message ||
        "Unable to update password."
      );

    }
  };

  return (
    <>
      <CustomerNavbar />

      <div className="customer-profile-page">

        <div className="customer-profile-header">

          <h1>My Profile</h1>

          <p>
            Manage your account information and security.
          </p>

        </div>

        <div className="customer-profile-card">

          <div className="customer-profile-avatar">

            <FaRegUserCircle />

          </div>

          <div className="customer-profile-info">

            <h2>{profile.name || "Customer"}</h2>

            <span>Customer Account</span>

            <p>{profile.email}</p>

          </div>

        </div>

        <form
          className="customer-profile-form-card"
          onSubmit={updateProfile}
        >

          <div className="customer-profile-form-header">

            <h3>Personal Information</h3>

            <button
              className="primary-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

          </div>

          <div className="customer-profile-grid">

            <div className="customer-profile-group">

              <label>Full Name</label>

              <input
                type="text"
                name="name"
                className="customer-profile-input"
                value={profile.name}
                onChange={handleProfileChange}
              />

            </div>

            <div className="customer-profile-group">

              <label>Phone Number</label>

              <input
                type="text"
                name="phone"
                className="customer-profile-input"
                value={profile.phone}
                onChange={handleProfileChange}
              />

            </div>

            <div className="customer-profile-group customer-profile-full">

              <label>Email Address</label>

              <input
                type="email"
                className="customer-profile-input"
                value={profile.email}
                disabled
              />

            </div>

            <div className="customer-profile-group customer-profile-full">

              <label>Address</label>

              <textarea
                name="address"
                className="customer-profile-input customer-profile-textarea"
                value={profile.address}
                onChange={handleProfileChange}
              />

            </div>

          </div>

        </form>

        <form
          className="customer-profile-form-card"
          onSubmit={updatePassword}
        >

          <div className="customer-profile-form-header">

            <h3>Change Password</h3>

          </div>

          <div className="customer-profile-grid">

            <div className="customer-profile-group">

              <label>Current Password</label>

              <input
                type="password"
                name="currentPassword"
                className="customer-profile-input"
                value={password.currentPassword}
                onChange={handlePasswordChange}
              />

            </div>

            <div className="customer-profile-group">

              <label>New Password</label>

              <input
                type="password"
                name="newPassword"
                className="customer-profile-input"
                value={password.newPassword}
                onChange={handlePasswordChange}
              />

            </div>

            <div className="customer-profile-group customer-profile-full">

              <label>Confirm Password</label>

              <input
                type="password"
                name="confirmPassword"
                className="customer-profile-input"
                value={password.confirmPassword}
                onChange={handlePasswordChange}
              />

            </div>

          </div>

          <button className="primary-btn">
            Update Password
          </button>

        </form>

        {message && (
          <p className="customer-profile-success">
            {message}
          </p>
        )}

        {error && (
          <p className="customer-profile-error">
            {error}
          </p>
        )}

      </div>
    </>
  );
}