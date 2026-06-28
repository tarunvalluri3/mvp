import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

import CustomerNavbar from "../../components/CustomerNavbar";
import "./ServiceDetails.css";

import GoogleMap from "../../components/GoogleMap";

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
        `${import.meta.env.VITE_API_URL}/services/details/${serviceId}`,
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
        <div className="service-details-layout">
          {/* LEFT */}

          <div className="service-main-card">
            <span className="customer-category">{service.category.name}</span>

            <h1>{service.serviceName}</h1>

            <h2>₹ {Number(service.price).toLocaleString("en-IN")}</h2>

            <p className="service-short-description">{service.description}</p>

            <Link
              to={`/customer/book-service/${service.id}`}
              className="customer-book-btn"
            >
              Book this Service →
            </Link>
          </div>

          {/* RIGHT */}

          <div className="service-sidebar">
            <div className="info-card">
              <h3>Provider Information</h3>

              <div className="info-row">
                <span>Business</span>

                <strong>{service.vendor.businessName}</strong>
              </div>

              <div className="info-row">
                <span>Email</span>

                <strong>{service.vendor.user.email}</strong>
              </div>

              <div className="info-row">
                <span>Phone</span>

                <strong>{service.vendor.user.phone}</strong>
              </div>

              <div className="info-row">
                <span>Address</span>

                <strong>{service.vendor.address}</strong>
              </div>
            </div>{" "}
            <div className="info-card">
              <h3>Business Location</h3>

              <GoogleMap
                latitude={service.vendor.latitude}
                longitude={service.vendor.longitude}
              />

              <div className="location-address">{service.vendor.address}</div>
            </div>
            <div className="info-card">
              <h3>Service Details</h3>

              <div className="info-row">
                <span>Category</span>

                <strong>{service.category.name}</strong>
              </div>

              <div className="info-row">
                <span>Type</span>

                <strong>{service.serviceType}</strong>
              </div>

              <div className="info-row">
                <span>Price</span>

                <strong>
                  ₹ {Number(service.price).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
