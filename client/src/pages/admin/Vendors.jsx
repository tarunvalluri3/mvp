import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AdminLayout from "../../layouts/AdminLayout";
import "./Vendors.css";

export default function Vendors() {
  const token = localStorage.getItem("token");

  const [vendors, setVendors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  useEffect(() => {
    fetchVendors();
  }, [status]);

  const fetchVendors = async () => {
    try {
      setLoading(true);

      const params = {};

      if (status !== "ALL") {
        params.status = status;
      }

      if (search.trim()) {
        params.search = search;
      }

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/vendors`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        },
      );

      setVendors(data.vendors);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVendors();
  };

  const updateStatus = async (vendorId, approvalStatus) => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/admin/vendors/${vendorId}/status`,
        {
          approvalStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchVendors();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AdminLayout>
      <div className="vendors-page">
        <div className="page-header">
          <span className="page-tag">Vendor Management</span>

          <h1>Vendor Applications</h1>

          <p>
            Review, approve and manage vendor applications across the
            marketplace.
          </p>
        </div>

        <div className="vendors-toolbar">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search business or owner..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button type="submit">Search</button>
          </form>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">All Vendors</option>

            <option value="PENDING">Pending</option>

            <option value="APPROVED">Approved</option>

            <option value="REJECTED">Rejected</option>

            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>

        {loading ? (
          <div className="empty-state">Loading vendors...</div>
        ) : vendors.length === 0 ? (
          <div className="empty-state">No vendors found.</div>
        ) : (
          <div className="vendors-table-wrapper">
            <table className="vendors-table">
              <thead>
                <tr>
                  <th>Business</th>

                  <th>Owner</th>

                  <th>Contact</th>

                  <th>Status</th>

                  <th>Joined</th>

                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="business-column">
                      <h4>{vendor.businessName}</h4>

                      <p className="business-address">📍 {vendor.address}</p>
                    </td>

                    <td className="owner-column">
                      <h4>{vendor.user.name}</h4>

                      <p>{vendor.user.email}</p>
                    </td>

                    <td>
                      <h4>{vendor.user.phone || "-"}</h4>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${vendor.approvalStatus.toLowerCase()}`}
                      >
                        {vendor.approvalStatus}
                      </span>
                    </td>

                    <td>
                      {new Date(vendor.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>

                    <td>
                      <div className="action-buttons">
                        <Link
                          to={`/admin/vendors/${vendor.id}`}
                          className="view-btn"
                        >
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
