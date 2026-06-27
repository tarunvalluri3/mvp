import CustomerNavbar from "../../components/CustomerNavbar";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "./Services.css";

export default function Services() {
  const [services, setServices] = useState([]);

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  useEffect(() => {
    fetchServices();
  }, [categoryId]);

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

  const fetchServices = async () => {
    try {
      setLoading(true);

      const url = categoryId
        ? `${import.meta.env.VITE_API_URL}/services?categoryId=${categoryId}`
        : `${import.meta.env.VITE_API_URL}/services`;

      const { data } = await axios.get(url);

      setServices(data.services);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) =>
    service.serviceName.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <CustomerNavbar />

      <div className="customer-services-page">
        <div className="page-header">
          <span className="page-tag">Marketplace</span>

          <h1>Explore Services</h1>

          <p>Discover trusted professionals for your upcoming requirements.</p>
        </div>

        <div className="toolbar">
          <input
            className="search-input"
            placeholder="Search services..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="category-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="empty-state">Loading services...</div>
        ) : filteredServices.length === 0 ? (
          <div className="empty-state">No services found.</div>
        ) : (
          <div className="customer-services-list">
            {filteredServices.map((service) => (
              <div className="customer-service-card" key={service.id}>
                <span className="customer-category">
                  {service.category.name}
                </span>

                <h3>{service.serviceName}</h3>

                <p className="customer-vendor">{service.vendor.businessName}</p>

                <div className="customer-card-footer">
                  <h2>₹ {Number(service.price).toLocaleString("en-IN")}</h2>

                  <Link
                    to={`/services/${service.id}`}
                    className="customer-details-btn"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
