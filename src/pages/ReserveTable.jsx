import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";

export default function ReserveTable() {
  const { user } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    tableNumber: "",
    guestCount: "",
    reservationDate: "",
    reservationTime: "",
    notes: ""
  });

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchReservations = async () => {
    await Promise.resolve();
    if (!user) {
      setReservations([]);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/reservations/my");
      setReservations(res.data || []);
    } catch (error) {
      console.error("Failed to fetch reservations", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage({ type: "danger", text: "Please login first." });
      return;
    }

    try {
      const response = await api.post("/reservations", {
        tableNumber: Number(form.tableNumber),
        guestCount: Number(form.guestCount),
        reservationDate: form.reservationDate,
        reservationTime: form.reservationTime,
        notes: form.notes
      });

      setReservations((prev) => [response.data, ...prev]);
      setMessage({ type: "success", text: "Reservation created successfully!" });
      setForm({
        tableNumber: "",
        guestCount: "",
        reservationDate: "",
        reservationTime: "",
        notes: ""
      });
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.response?.data?.error || "Failed to create reservation"
      });
    }
  };

  const handleCancel = async (reservationId) => {
    try {
      const response = await api.put(`/reservations/${reservationId}/status`, {
        status: "Cancelled"
      });

      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === reservationId ? response.data : reservation
        )
      );
      setMessage({ type: "success", text: "Reservation cancelled successfully." });
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.response?.data?.error || "Failed to cancel reservation"
      });
    }
  };

  return (
    <div className="row g-4">
      <div className="col-lg-5">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h3 className="mb-3">Reserve a Table</h3>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Table Number</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.tableNumber}
                  onChange={(e) => setForm({ ...form, tableNumber: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Guest Count</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Reservation Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.reservationDate}
                  onChange={(e) => setForm({ ...form, reservationDate: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Reservation Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={form.reservationTime}
                  onChange={(e) => setForm({ ...form, reservationTime: e.target.value })}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              {message.text && (
                <div className={`alert alert-${message.type}`}>{message.text}</div>
              )}

              <button className="btn btn-primary w-100" type="submit">
                Reserve Table
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="col-lg-7">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h3 className="mb-3">Your Reservations</h3>

            {loading ? (
              <div className="alert alert-info">Loading reservations...</div>
            ) : reservations.length === 0 ? (
              <div className="alert alert-secondary">No reservations found.</div>
            ) : (
              <div className="d-grid gap-3">
                {reservations.map((reservation) => (
                  <div key={reservation._id} className="border rounded p-3">
                    <div className="d-flex justify-content-between align-items-start gap-3 flex-wrap">
                      <div>
                        <h5 className="mb-1">Table {reservation.tableNumber}</h5>
                        <p className="mb-1 text-muted">
                          {reservation.reservationDate} at {reservation.reservationTime}
                        </p>
                        <p className="mb-1">Guests: {reservation.guestCount}</p>
                        {reservation.notes && <p className="mb-0">Notes: {reservation.notes}</p>}
                      </div>
                      <div className="text-end">
                        <span className={`badge ${reservation.status === "Cancelled" ? "bg-secondary" : "bg-primary"}`}>
                          {reservation.status}
                        </span>
                        {reservation.status !== "Cancelled" && (
                          <div className="mt-2">
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => handleCancel(reservation._id)}
                            >
                              Cancel
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
        </div>
      </div>
    </div>
  );
}