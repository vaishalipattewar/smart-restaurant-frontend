import { useEffect, useState } from "react";
import api from "../api";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: "",
  available: true
};

export default function AdminMenu() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchItems = async () => {
    try {
      const res = await api.get("/menu");
      setItems(res.data || []);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to fetch menu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/menu/${editingId}`, form);
        setMessage("Menu item updated");
      } else {
        await api.post("/menu", form);
        setMessage("Menu item created");
      }

      resetForm();
      fetchItems();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to save menu item");
    }
  };

  const startEdit = (item) => {
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

  const deleteItem = async (id) => {
    try {
      await api.delete(`/menu/${id}`);
      setMessage("Menu item deleted");
      fetchItems();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to delete menu item");
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading menu...</div>;
  }

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-3">{editingId ? "Edit Menu Item" : "Add Menu Item"}</h3>
            {message && <div className="alert alert-info">{message}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input className="form-control" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Price</label>
                <input type="number" className="form-control" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Category</label>
                <input className="form-control" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Image URL</label>
                <input className="form-control" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
                <label className="form-check-label">Available</label>
              </div>

              <div className="d-flex gap-2">
                <button className="btn btn-primary" type="submit">{editingId ? "Update" : "Create"}</button>
                {editingId && <button className="btn btn-outline-secondary" type="button" onClick={resetForm}>Cancel</button>}
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-8">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-3">Manage Menu</h3>

            {items.length === 0 ? (
              <div className="alert alert-secondary">No menu items found.</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.category}</td>
                        <td>₹{item.price}</td>
                        <td>{item.available ? "Available" : "Hidden"}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(item)}>Edit</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => deleteItem(item._id)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
