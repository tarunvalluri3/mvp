import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import AdminLayout from "../../layouts/AdminLayout";

import "./Customers.css";

export default function Customers() {
  const token = localStorage.getItem("token");

  const [customers, setCustomers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/admin/customers`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setCustomers(data.customers);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="customers-page">
        <div className="page-header">
          <span className="page-tag">Administration</span>

          <h1>Customers</h1>

          <p>View and manage all registered customers.</p>
        </div>

        <div className="toolbar">
          <input
            type="text"
            className="search-input"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="empty-state">Loading customers...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="empty-state">No customers found.</div>
        ) : (
          <div className="table-container">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>

                  <th>Email</th>

                  <th>Phone</th>

                  <th>Status</th>

                  <th>Joined</th>

                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-info">
                        {/* <div className="customer-avatar">
                          {customer.name
                            .split(" ")
                            .map((word) => word[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </div> */}

                        <span>{customer.name}</span>
                      </div>
                    </td>

                    <td>{customer.email}</td>

                    <td>{customer.phone || "-"}</td>

                    <td>
                      <span className="status-badge">{customer.status}</span>
                    </td>

                    <td>
                      {new Date(customer.createdAt).toLocaleDateString("en-IN")}
                    </td>

                    <td>
                      <Link
                        to={`/admin/customers/${customer.id}`}
                        className="view-btn"
                      >
                        View
                      </Link>
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
