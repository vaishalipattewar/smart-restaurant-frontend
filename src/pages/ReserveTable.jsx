import { useState } from "react";
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

  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Please login first.");
      return;
    }

    try {
      await api.post("/reservations", {
        tableNumber: Number(form.tableNumber),
        guestCount: Number(form.guestCount),
        reservationDate: form.reservationDate,
        reservationTime: form.reservationTime,
        notes: form.notes
      });

      setMessage("Reservation created successfully!");
      setForm({
        tableNumber: "",
        guestCount: "",
        reservationDate: "",
        reservationTime: "",
        notes: ""
      });
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to create reservation");
    }
  };

  return (
    <div className="card shadow-sm">
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

          {message && <div className="alert alert-info">{message}</div>}

          <button className="btn btn-primary w-100" type="submit">
            Reserve Table
          </button>
        </form>
      </div>
    </div>
  );
}