import { useEffect, useState } from "react";
import api from "../api";

export default function AdminFeedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
  // Define it inside so the linter can inspect the await path
  const fetchFeedback = async () => {
    try {
      const res = await api.get("/feedback");
      setFeedbackList(res.data || []);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to fetch feedback");
    } finally {
      setLoading(false);
    }
  };

  fetchFeedback();
}, []); // Empty array ensures it only fires once on mount


  const updateStatus = async (id, status) => {
    try {
      await api.put(`/feedback/${id}`, { status });
      setMessage("Feedback status updated");
      fetchFeedback();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to update feedback");
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading feedback...</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="mb-3">Manage Feedback</h3>

        {message && <div className="alert alert-info">{message}</div>}

        {feedbackList.length === 0 ? (
          <div className="alert alert-secondary">No feedback found.</div>
        ) : (
          <div className="d-flex flex-column gap-3">
            {feedbackList.map((item) => (
              <div key={item._id} className="border rounded p-3">
                <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                  <div>
                    <strong>{item.name}</strong>
                    <div className="text-warning">
                      {"★".repeat(item.rating)}
                      {"☆".repeat(5 - item.rating)}
                    </div>
                    <p className="mb-0 mt-2">{item.comment}</p>
                  </div>
                  <div className="d-flex gap-2 align-items-center flex-wrap">
                    <span className="badge bg-secondary">{item.status}</span>
                    <select
                      className="form-select form-select-sm"
                      value={item.status}
                      onChange={(e) => updateStatus(item._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
