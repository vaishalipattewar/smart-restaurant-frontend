import { useEffect, useState } from "react";
import api from "../api";

export default function AdminReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get("/reservations");
        setReservations(res.data || []);
      } catch (error) {
        console.error("Failed to fetch reservations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      setReservations((prev) =>
        prev.map((reservation) =>
          reservation._id === id ? { ...reservation, status } : reservation
        )
      );
    } catch (error) {
      console.error("Failed to update reservation status", error);
    }
  };

  if (loading) {
    return <div className="alert alert-info">Loading reservations...</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="mb-3">Manage Reservations</h3>

        {reservations.length === 0 ? (
          <div className="alert alert-secondary">No reservations found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Table</th>
                  <th>Guests</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation._id}>
                    <td>{reservation.user?.name || "Unknown"}</td>
                    <td>{reservation.tableNumber}</td>
                    <td>{reservation.guestCount}</td>
                    <td>{reservation.reservationDate}</td>
                    <td>{reservation.reservationTime}</td>
                    <td>
                      <select
                        className="form-select form-select-sm"
                        value={reservation.status}
                        onChange={(e) => updateStatus(reservation._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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