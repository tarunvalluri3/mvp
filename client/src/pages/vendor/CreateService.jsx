import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import VendorLayout from "../../layouts/VendorLayout";
import "./CreateService.css";

export default function CreateService() {
  const navigate = useNavigate();

  const { serviceId } = useParams();

  const isEdit = Boolean(serviceId);

  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    serviceName: "",
    description: "",
    categoryId: "",
    price: "",
    serviceType: "ONSITE",
  });

  useEffect(() => {
    fetchCategories();

    if (isEdit) {
      fetchService();
    }
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories`,
      );

      setCategories(data.categories);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchService = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/services/my-services/${serviceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setForm({
        serviceName: data.service.serviceName,
        description: data.service.description,
        categoryId: data.service.categoryId,
        price: data.service.price,
        serviceType: data.service.serviceType,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      if (isEdit) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/services/${serviceId}`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/services`, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      navigate("/vendor/services");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to save service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <VendorLayout>
      <div className="create-service-page">
        <div className="page-header">
          <span className="page-tag">Service Management</span>

          <h1>{isEdit ? "Edit Service" : "Create New Service"}</h1>

          <p>
            Add a new service to your business. Approved services will be
            visible to customers searching on the marketplace.
          </p>
        </div>

        <div className="service-card">
          <h2>{isEdit ? "Update Service" : "Service Information"}</h2>

          <p>Complete the information below to publish a new service.</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Service Name</label>

              <input
                type="text"
                name="serviceName"
                className="input"
                placeholder="Wedding Photography"
                value={form.serviceName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>

              <textarea
                name="description"
                className="input textarea"
                placeholder="Describe your service..."
                value={form.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Category</label>

                <select
                  name="categoryId"
                  className="input"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Price (₹)</label>

                <input
                  type="number"
                  name="price"
                  className="input"
                  placeholder="5000"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Service Type</label>

              <select
                name="serviceType"
                className="input"
                value={form.serviceType}
                onChange={handleChange}
              >
                <option value="ONSITE">Onsite</option>

                <option value="REMOTE">Remote</option>

                <option value="BOTH">Both</option>
              </select>
            </div>

            {error && <p className="error">{error}</p>}

            <button
              type="submit"
              className="primary-btn submit-btn"
              disabled={loading}
            >
              {loading
                ? isEdit
                  ? "Updating Service..."
                  : "Creating Service..."
                : isEdit
                  ? "Update Service"
                  : "Create Service"}
            </button>
          </form>
        </div>
      </div>
    </VendorLayout>
  );
}
