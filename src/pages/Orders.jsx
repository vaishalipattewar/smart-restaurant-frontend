import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";

export default function Orders() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data || []);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchOrders();
    }
  }, [user]);

  if (loading) {
    return <div className="alert alert-info">Loading your orders...</div>;
  }

  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <h3 className="mb-3">My Orders</h3>

        {orders.length === 0 ? (
          <div className="alert alert-secondary">No orders yet.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Items</th>
                  <th>Placed On</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id}>
                    <td>{index + 1}</td>
                    <td>{order.status}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>
                      {order.items?.map((item) => `${item.name} x${item.quantity}`).join(", ")}
                    </td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
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