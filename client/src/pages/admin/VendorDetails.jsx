import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { FaStore } from "react-icons/fa";

import AdminLayout from "../../layouts/AdminLayout";

import "./VendorDetails.css";

import GoogleMap from "../../components/GoogleMap";

export default function VendorDetails() {
  const { vendorId } = useParams();

  const token = localStorage.getItem("token");

  const [vendor, setVendor] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVendor();
  }, []);

  const fetchVendor = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/vendors/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setVendor(data.vendor);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (approvalStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/vendors/${vendor.id}/status`,
        {
          approvalStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchVendor();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="empty-state">Loading vendor...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="vendor-details-page">
        <Link to="/admin/vendors" className="back-link">
          ← Back to Vendors
        </Link>

        <div className="vendor-profile-card">
          <div className="vendor-avatar">
            <FaStore />
          </div>

          <div>
            <h1>{vendor.businessName}</h1>

            <p>Vendor Account</p>

            <div className="vendor-actions">
              {vendor.approvalStatus === "PENDING" && (
                <>
                  <button
                    className="approve-btn"
                    onClick={() => updateStatus("APPROVED")}
                  >
                    Approve
                  </button>

                  <button
                    className="reject-btn"
                    onClick={() => updateStatus("REJECTED")}
                  >
                    Reject
                  </button>
                </>
              )}

              {vendor.approvalStatus === "APPROVED" && (
                <button
                  className="suspend-btn"
                  onClick={() => updateStatus("SUSPENDED")}
                >
                  Suspend
                </button>
              )}

              {(vendor.approvalStatus === "REJECTED" ||
                vendor.approvalStatus === "SUSPENDED") && (
                <button
                  className="approve-btn"
                  onClick={() => updateStatus("APPROVED")}
                >
                  Approve
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="details-card">
          <h2>Business Information</h2>

          <div className="details-grid">
            <div>
              <label>Business Name</label>
              <span>{vendor.businessName}</span>
            </div>

            <div>
              <label>Owner</label>
              <span>{vendor.user.name}</span>
            </div>

            <div>
              <label>Email</label>
              <span>{vendor.user.email}</span>
            </div>

            <div>
              <label>Phone</label>
              <span>{vendor.user.phone || "-"}</span>
            </div>

            <div>
              <label>Address</label>
              <span>{vendor.address}</span>
            </div>

            <div>
              <label>Status</label>
              <span>{vendor.approvalStatus}</span>
            </div>

            <div className="full-width">
              <label>Description</label>
              <span>{vendor.businessDescription}</span>
            </div>
            <div className="full-width">
              <label>Business Location</label>

              <div className="vendor-map">
                <GoogleMap
                  latitude={vendor.latitude}
                  longitude={vendor.longitude}
                />
              </div>

              <span className="coordinates">
                {vendor.latitude.toFixed(6)}, {vendor.longitude.toFixed(6)}
              </span>
            </div>
          </div>
        </div>

        <div className="details-card">
          <h2>Services</h2>

          {vendor.services.length === 0 ? (
            <div className="empty-state">No services available.</div>
          ) : (
            <div className="table-container">
              <table className="services-table">
                <thead>
                  <tr>
                    <th>Service</th>

                    <th>Category</th>

                    <th>Price</th>

                    <th>Type</th>

                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {vendor.services.map((service) => (
                    <tr key={service.id}>
                      <td>{service.serviceName}</td>

                      <td>{service.category.name}</td>

                      <td>₹ {Number(service.price).toLocaleString("en-IN")}</td>

                      <td>{service.serviceType}</td>

                      <td>
                        <span className="status-badge">{service.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
