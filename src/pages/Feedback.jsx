import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";

export default function Feedback() {
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    rating: 5,
    comment: ""
  });

  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({
    rating: 5,
    comment: ""
  });

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const response = await api.get("/feedback");
      setFeedbackList(response.data);
    } catch (error) {
      console.error("Failed to fetch feedback", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFeedback();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/feedback", formData);
      setFormData({ rating: 5, comment: "" });
      setMessage("Feedback submitted successfully");
      fetchFeedback();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to submit feedback");
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/feedback/${id}`);
      setMessage("Feedback removed");
      fetchFeedback();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to delete feedback");
    }
  };

  const startEdit = (item) => {
    setEditingId(item._id);
    setEditData({
      rating: item.rating,
      comment: item.comment
    });
  };

  const handleUpdate = async (id) => {
    try {
      await api.put(`/feedback/${id}`, editData);
      setEditingId(null);
      setMessage("Feedback updated");
      fetchFeedback();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to update feedback");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/feedback/${id}`, { status });
      setMessage("Status updated");
      fetchFeedback();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to update status");
    }
  };

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-2">Customer Feedback</h3>
            <p className="text-muted mb-0">
              Share your experience and view reviews from other guests.
            </p>
          </div>
        </div>
      </div>

      <div className="col-lg-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Submit Your Review</h5>

            {message && (
              <div className="alert alert-info py-2">{message}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Rating</label>
                <select
                  className="form-select"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: Number(e.target.value) })
                  }
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Very Good</option>
                  <option value="3">3 - Good</option>
                  <option value="2">2 - Fair</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Comment</label>
                <textarea
                  className="form-control"
                  rows="4"
                  value={formData.comment}
                  onChange={(e) =>
                    setFormData({ ...formData, comment: e.target.value })
                  }
                  placeholder="Write your experience here..."
                />
              </div>

              <button className="btn btn-primary" type="submit">
                Submit Feedback
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <h5 className="mb-3">Recent Feedback</h5>

            {loading ? (
              <p className="text-muted">Loading feedback...</p>
            ) : feedbackList.length === 0 ? (
              <p className="text-muted">No feedback available yet.</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {feedbackList.map((item) => (
                  <div key={item._id} className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <strong>{item.name}</strong>
                        <div className="text-warning">
                          {"★".repeat(item.rating)}
                          {"☆".repeat(5 - item.rating)}
                        </div>
                      </div>

                      <span className="badge bg-secondary">
                        {item.status || "Pending"}
                      </span>
                    </div>

                    <p className="mt-2 mb-2">{item.comment}</p>

                    {user?.role === "admin" && (
                      <div className="d-flex gap-2 flex-wrap mb-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleStatusChange(item._id, "Approved")}
                        >
                          Approve
                        </button>
                        <button
                          className="btn btn-sm btn-warning"
                          onClick={() => handleStatusChange(item._id, "Rejected")}
                        >
                          Reject
                        </button>
                      </div>
                    )}

                    {(user?.role === "admin" ||
                      item.user?._id === user?.id ||
                      item.user === user?.id) && (
                      <div className="d-flex gap-2 flex-wrap">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => startEdit(item)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    )}

                    {editingId === item._id && (
                      <div className="mt-3">
                        <select
                          className="form-select mb-2"
                          value={editData.rating}
                          onChange={(e) =>
                            setEditData({ ...editData, rating: Number(e.target.value) })
                          }
                        >
                          <option value="5">5 - Excellent</option>
                          <option value="4">4 - Very Good</option>
                          <option value="3">3 - Good</option>
                          <option value="2">2 - Fair</option>
                          <option value="1">1 - Poor</option>
                        </select>

                        <textarea
                          className="form-control mb-2"
                          rows="3"
                          value={editData.comment}
                          onChange={(e) =>
                            setEditData({ ...editData, comment: e.target.value })
                          }
                        />

                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleUpdate(item._id)}
                        >
                          Save
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}