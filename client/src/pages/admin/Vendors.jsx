import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import "./Vendors.css";

export default function Vendors() {
  const token = localStorage.getItem("token");

  const [vendors, setVendors] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("ALL");

  const [selectedVendor, setSelectedVendor] = useState(null);

  const [showModal, setShowModal] = useState(false);

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

  const viewVendor = async (vendorId) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/vendors/${vendorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSelectedVendor(data.vendor);

      setShowModal(true);
    } catch (error) {
      console.error(error);
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
                        {vendor.approvalStatus === "PENDING" && (
                          <>
                            <button
                              className="view-btn"
                              onClick={() => viewVendor(vendor.id)}
                            >
                              View
                            </button>
                            <button
                              className="approve-btn"
                              onClick={() =>
                                updateStatus(vendor.id, "APPROVED")
                              }
                            >
                              Approve
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() =>
                                updateStatus(vendor.id, "REJECTED")
                              }
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {vendor.approvalStatus === "APPROVED" && (
                          <button
                            className="suspend-btn"
                            onClick={() => updateStatus(vendor.id, "SUSPENDED")}
                          >
                            Suspend
                          </button>
                        )}

                        {(vendor.approvalStatus === "REJECTED" ||
                          vendor.approvalStatus === "SUSPENDED") && (
                          <button
                            className="approve-btn"
                            onClick={() => updateStatus(vendor.id, "APPROVED")}
                          >
                            Approve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {showModal && selectedVendor && (
              <div className="vendor-modal-overlay">
                <div className="vendor-modal">
                  <h2>Business Details</h2>

                  <div className="modal-grid">
                    <div>
                      <label>Business Name</label>

                      <p>{selectedVendor.businessName}</p>
                    </div>

                    <div>
                      <label>Owner</label>

                      <p>{selectedVendor.user.name}</p>
                    </div>

                    <div>
                      <label>Email</label>

                      <p>{selectedVendor.user.email}</p>
                    </div>

                    <div>
                      <label>Phone</label>

                      <p>{selectedVendor.user.phone}</p>
                    </div>

                    <div>
                      <label>Address</label>

                      <p>{selectedVendor.address}</p>
                    </div>

                    <div>
                      <label>Status</label>

                      <p>{selectedVendor.approvalStatus}</p>
                    </div>

                    <div className="full-width">
                      <label>Description</label>

                      <p>{selectedVendor.businessDescription}</p>
                    </div>

                    <div className="full-width">
                      <label>Business Location</label>

                      <div className="vendor-map">
                        <iframe
                          title="Vendor Location"
                          width="100%"
                          height="220"
                          loading="lazy"
                          style={{
                            border: 0,
                            borderRadius: "12px",
                          }}
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${
                            selectedVendor.longitude - 0.01
                          },${selectedVendor.latitude - 0.01},${
                            selectedVendor.longitude + 0.01
                          },${
                            selectedVendor.latitude + 0.01
                          }&layer=mapnik&marker=${
                            selectedVendor.latitude
                          },${selectedVendor.longitude}`}
                        />
                      </div>

                      <p className="coordinates">
                        {selectedVendor.latitude.toFixed(6)},{" "}
                        {selectedVendor.longitude.toFixed(6)}
                      </p>
                    </div>
                  </div>

                  <div className="modal-actions">
                    {selectedVendor.approvalStatus === "PENDING" && (
                      <>
                        <button
                          className="approve-btn"
                          onClick={async () => {
                            await updateStatus(selectedVendor.id, "APPROVED");
                            setShowModal(false);
                          }}
                        >
                          Approve
                        </button>

                        <button
                          className="reject-btn"
                          onClick={async () => {
                            await updateStatus(selectedVendor.id, "REJECTED");
                            setShowModal(false);
                          }}
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {selectedVendor.approvalStatus === "APPROVED" && (
                      <button
                        className="suspend-btn"
                        onClick={async () => {
                          await updateStatus(selectedVendor.id, "SUSPENDED");
                          setShowModal(false);
                        }}
                      >
                        Suspend
                      </button>
                    )}

                    {(selectedVendor.approvalStatus === "REJECTED" ||
                      selectedVendor.approvalStatus === "SUSPENDED") && (
                      <button
                        className="approve-btn"
                        onClick={async () => {
                          await updateStatus(selectedVendor.id, "APPROVED");
                          setShowModal(false);
                        }}
                      >
                        Approve
                      </button>
                    )}

                    <button
                      className="secondary-btn"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
