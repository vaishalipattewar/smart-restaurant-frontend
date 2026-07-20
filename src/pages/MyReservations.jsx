import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";

export default function MyReservations() {
  const { user } = useSelector((state) => state.auth);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await api.get("/reservations/my");
        setReservations(res.data || []);
      } catch (error) {
        console.error("Failed to fetch reservations", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchReservations();
    }
  }, [user]);

  if (loading) {
    return <div className="alert alert-info">Loading reservations...</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="mb-3">My Reservations</h3>

        {reservations.length === 0 ? (
          <div className="alert alert-secondary">No reservations found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
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
                    <td>{reservation.tableNumber}</td>
                    <td>{reservation.guestCount}</td>
                    <td>{reservation.reservationDate}</td>
                    <td>{reservation.reservationTime}</td>
                    <td>{reservation.status}</td>
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