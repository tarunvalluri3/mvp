import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import VendorLayout from "../../layouts/VendorLayout";
import "./Services.css";

export default function Services() {
  const token = localStorage.getItem("token");

  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("ALL");

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/services/my-services`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServices(data.services);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  const toggleStatus = async (service) => {
    try {

      const endpoint =
        service.status === "ACTIVE"
          ? "deactivate"
          : "activate";

      await axios.patch(
        `${import.meta.env.VITE_API_URL}/services/${service.id}/${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchServices();

    } catch (error) {

      console.error(error);

    }
  };

  const filteredServices = services.filter((service) => {

    const matchesSearch =
      service.serviceName
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      status === "ALL"
        ? true
        : service.status === status;

    return matchesSearch && matchesStatus;

  }); 

    return (
    <VendorLayout>
      <div className="services-page">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="page-header">

          <span className="page-tag">
            Service Management
          </span>

          <h1>My Services</h1>

          <p>
            Manage the services your business offers to customers.
            Create new services, update pricing and control service availability.
          </p>

        </div>

        {/* ==========================================
            TOOLBAR
        ========================================== */}

        <div className="services-toolbar">

          <input
            className="search-input"
            type="text"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="toolbar-right">

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="ALL">
                All Services
              </option>

              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

            </select>

            <Link
              to="/vendor/services/new"
              className="primary-btn"
            >
              + New Service
            </Link>

          </div>

        </div>

        {/* ==========================================
            TABLE
        ========================================== */}

        {loading ? (

          <div className="empty-state">
            Loading services...
          </div>

        ) : filteredServices.length === 0 ? (

          <div className="empty-state">

            <h3>No services found</h3>

            <p>
              Create your first service to start receiving bookings.
            </p>

          </div>

        ) : (

          <div className="services-table-wrapper">

            <table className="services-table">

              <thead>

                <tr>

                  <th>Service</th>

                  <th>Category</th>

                  <th>Price</th>

                  <th>Type</th>

                  <th>Status</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredServices.map((service) => (

                  <tr key={service.id}>

                    <td>

                      <strong>
                        {service.serviceName}
                      </strong>

                      <p className="service-description">
                        {service.description}
                      </p>

                    </td>

                    <td>

                      {service.category.name}

                    </td>

                    <td>

                      ₹ {Number(service.price).toLocaleString("en-IN")}

                    </td>

                    <td>

                      {service.serviceType}

                    </td>

                    <td>

                      <span
                        className={`status-badge ${service.status.toLowerCase()}`}
                      >
                        {service.status}
                      </span>

                    </td>

                    <td>

                      <div className="action-buttons">

                        <Link
                          to={`/vendor/services/${service.id}/edit`}
                          className="view-btn"
                        >
                          Edit
                        </Link>

                        <button
                          className={
                            service.status === "ACTIVE"
                              ? "reject-btn"
                              : "approve-btn"
                          }
                          onClick={() => toggleStatus(service)}
                        >
                          {service.status === "ACTIVE"
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        )}

      </div>
    </VendorLayout>
  );
}