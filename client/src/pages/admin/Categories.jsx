import { useEffect, useState } from "react";
import axios from "axios";
import AdminLayout from "../../layouts/AdminLayout";
import "./Categories.css";

export default function Categories() {
  const token = localStorage.getItem("token");

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [newCategory, setNewCategory] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/categories`
      );

      setCategories(data.categories);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async () => {
    if (!newCategory.trim()) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/categories`,
        {
          name: newCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNewCategory("");

      fetchCategories();

    } catch (error) {
      console.error(error);
    }
  };

  const updateCategory = async (categoryId) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/categories/${categoryId}`,
        {
          name: editingName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingId(null);

      fetchCategories();

    } catch (error) {
      console.error(error);
    }
  };

  const deleteCategory = async (categoryId) => {

    const confirmDelete = window.confirm(
      "Delete this category?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/categories/${categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchCategories();

    } catch (error) {

      console.error(error);

    }
  }; 

    const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="categories-page">

        {/* Header */}

        <div className="page-header">

          <span className="page-tag">
            Category Management
          </span>

          <h1>Service Categories</h1>

          <p>
            Create and manage service categories available to approved vendors.
          </p>

        </div>

        {/* Toolbar */}

        <div className="categories-toolbar">

          <input
            className="search-input"
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="add-category">

            <input
              type="text"
              placeholder="New category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <button
              className="primary-btn"
              onClick={createCategory}
            >
              Add Category
            </button>

          </div>

        </div>

        {/* Table */}

        {loading ? (

          <div className="empty-state">
            Loading categories...
          </div>

        ) : filteredCategories.length === 0 ? (

          <div className="empty-state">
            No categories found.
          </div>

        ) : (

          <div className="categories-table-wrapper">

            <table className="categories-table">

              <thead>

                <tr>

                  <th>Category</th>

                  <th>Created On</th>

                  <th>Actions</th>

                </tr>

              </thead>

              <tbody>

                {filteredCategories.map((category) => (

                  <tr key={category.id}>

                    <td>

                      {editingId === category.id ? (

                        <input
                          className="edit-input"
                          value={editingName}
                          onChange={(e) =>
                            setEditingName(e.target.value)
                          }
                        />

                      ) : (

                        <strong>
                          {category.name}
                        </strong>

                      )}

                    </td>

                    <td>

                      {new Date(
                        category.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}

                    </td>

                    <td>

                      <div className="action-buttons">

                        {editingId === category.id ? (

                          <>

                            <button
                              className="approve-btn"
                              onClick={() =>
                                updateCategory(category.id)
                              }
                            >
                              Save
                            </button>

                            <button
                              className="secondary-btn"
                              onClick={() =>
                                setEditingId(null)
                              }
                            >
                              Cancel
                            </button>

                          </>

                        ) : (

                          <>

                            <button
                              className="view-btn"
                              onClick={() => {
                                setEditingId(category.id);
                                setEditingName(category.name);
                              }}
                            >
                              Edit
                            </button>

                            <button
                              className="reject-btn"
                              onClick={() =>
                                deleteCategory(category.id)
                              }
                            >
                              Delete
                            </button>

                          </>

                        )}

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