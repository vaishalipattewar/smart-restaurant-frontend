import { useEffect, useState } from "react";
import api from "../api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const changeRole = async (userId, role) => {
    try {
      await api.put(`/users/${userId}/role`, { role });
      setMessage("User role updated");
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to update role");
    }
  };

  const deleteUser = async (userId) => {
    try {
      await api.delete(`/users/${userId}`);
      setMessage("User deleted");
      fetchUsers();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to delete user");
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading users...</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="mb-3">Manage Users</h3>

        {message && <div className="alert alert-info">{message}</div>}

        {users.length === 0 ? (
          <div className="alert alert-secondary">No users found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userItem) => (
                  <tr key={userItem._id}>
                    <td>{userItem.name}</td>
                    <td>{userItem.email}</td>
                    <td>{userItem.role}</td>
                    <td>
                      <div className="d-flex gap-2 flex-wrap">
                        <select
                          className="form-select form-select-sm"
                          value={userItem.role}
                          onChange={(e) => changeRole(userItem._id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => deleteUser(userItem._id)}
                        >
                          Delete
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
    </div>
  );
}
