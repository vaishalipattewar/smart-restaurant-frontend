import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";

export default function Menu() {
  const { user } = useSelector((state) => state.auth);

  const isAdmin = Boolean(
    user &&
      (user?.role?.toLowerCase?.() === "admin" ||
        user?.roleName?.toLowerCase?.() === "admin" ||
        user?.isAdmin === true)
  );

  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    available: true
  });

  const [editingId, setEditingId] = useState(null);

  const fetchMenu = async () => {
    await Promise.resolve();
    try {
      const res = await api.get("/menu");
      setItems(res.data || []);
    } catch {
      setError("Unable to load menu items right now.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMenu();
    }, 0);

    return () => clearTimeout(timer); 
  }, [fetchMenu]);

  const categories = useMemo(() => {
    const unique = [...new Set(items.map((item) => item.category).filter(Boolean))];
    return ["All", ...unique];
  }, [items]);

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/menu/${editingId}`, form);
      } else {
        await api.post("/menu", form);
      }

      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        image: "",
        available: true
      });
      setEditingId(null);
      fetchMenu();
    } catch (err) {
      alert(err.response?.data?.error || "Action failed");
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image || "",
      available: item.available
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this menu item?")) return;

    try {
      await api.delete(`/menu/${id}`);
      fetchMenu();
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Menu</h2>
          <p className="text-muted mb-0">
            Browse menu items, search by name, and manage dishes if you are an admin.
          </p>
        </div>

        <div className="mt-3 mt-md-0 w-100" style={{ maxWidth: "320px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search menu items"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <label className="form-label">Filter by category</label>
          <select
            className="form-select"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isAdmin && (
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">
            <h5 className="card-title mb-3">
              {editingId ? "Edit Menu Item" : "Add New Menu Item"}
            </h5>

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Category</label>
                  <input
                    className="form-control"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Image URL</label>
                  <input
                    className="form-control"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    required
                  />
                </div>

                <div className="col-12">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      checked={form.available}
                      onChange={(e) => setForm({ ...form, available: e.target.checked })}
                      id="availableCheck"
                    />
                    <label className="form-check-label" htmlFor="availableCheck">
                      Available
                    </label>
                  </div>
                </div>

                <div className="col-12">
                  <button className="btn btn-success me-2" type="submit">
                    {editingId ? "Update Item" : "Add Item"}
                  </button>

                  {editingId && (
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setForm({
                          name: "",
                          description: "",
                          price: "",
                          category: "",
                          image: "",
                          available: true
                        });
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredItems.length === 0 ? (
        <div className="alert alert-info">No menu items match your search.</div>
      ) : (
        <div className="row g-4">
          {filteredItems.map((item) => (
            <div className="col-md-6 col-lg-4" key={item._id}>
              <div className="card h-100 shadow-sm border-0">
                {item.image ? (
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    className="card-img-top bg-light d-flex align-items-center justify-content-center"
                    style={{ height: "180px" }}
                  >
                    <span className="text-muted">No image available</span>
                  </div>
                )}

                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="card-title mb-0">{item.name}</h5>
                    <span className="badge bg-primary">{item.category}</span>
                  </div>

                  <p className="card-text text-muted flex-grow-1">{item.description}</p>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <strong className="text-success">${item.price}</strong>
                    <span className={`badge ${item.available ? "bg-success" : "bg-secondary"}`}>
                      {item.available ? "Available" : "Unavailable"}
                    </span>
                  </div>

                  {isAdmin && (
                    <div className="mt-3 d-flex gap-2">
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}