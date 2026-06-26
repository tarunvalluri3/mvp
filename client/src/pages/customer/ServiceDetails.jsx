import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import CustomerNavbar from "../../components/CustomerNavbar";
import "./ServiceDetails.css";

export default function ServiceDetails() {
  const { serviceId } = useParams();

  const [service, setService] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchService();
  }, []);

  const fetchService = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/services/details/${serviceId}`
      );

      setService(data.service);

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return (
      <>
        <CustomerNavbar />

        <div className="customer-details-page">
          <h2>Loading...</h2>
        </div>
      </>
    );
  }

  if (!service) {
    return (
      <>
        <CustomerNavbar />

        <div className="customer-details-page">
          <h2>Service not found.</h2>
        </div>
      </>
    );
  }

  return (
    <>
      <CustomerNavbar />

      <div className="customer-details-page">

        <div className="customer-details-card">

          <div className="customer-details-header">

            <span className="customer-category">
              {service.category.name}
            </span>

            <h1>
              {service.serviceName}
            </h1>

            <h2>
              ₹ {Number(service.price).toLocaleString("en-IN")}
            </h2>

          </div>

          <div className="customer-section">

            <h3>Description</h3>

            <p>
              {service.description}
            </p>

          </div>

          <div className="customer-info-grid">

            <div>

              <h4>Business</h4>

              <p>{service.vendor.businessName}</p>

            </div>

            <div>

              <h4>Service Type</h4>

              <p>{service.serviceType}</p>

            </div>

            <div>

              <h4>Address</h4>

              <p>{service.vendor.address}</p>

            </div>

            <div>

              <h4>Vendor Email</h4>

              <p>{service.vendor.user.email}</p>

            </div>

            <div>

              <h4>Phone</h4>

              <p>{service.vendor.user.phone}</p>

            </div>

          </div>

          <Link
            to={`/customer/book-service/${service.id}`}
            className="customer-book-btn"
          >
            Book Service
          </Link>

        </div>

      </div>

    </>
  );
}