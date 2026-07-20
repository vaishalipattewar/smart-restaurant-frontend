import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import api from "../api";

export default function PlaceOrder() {
  const { user } = useSelector((state) => state.auth);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu");
        setMenuItems(res.data || []);
      } catch (error) {
        console.error("Failed to fetch menu", error);
      }
    };

    fetchMenu();
  }, []);

  const addToOrder = (item) => {
    setSelectedItems((prev) => {
      const existing = prev.find((x) => x.menuItem === item._id);
      if (existing) {
        return prev.map((x) =>
          x.menuItem === item._id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      return [...prev, { menuItem: item._id, quantity: 1 }];
    });
  };

  const updateQuantity = (menuItemId, delta) => {
    setSelectedItems((prev) =>
      prev
        .map((item) => {
          if (item.menuItem !== menuItemId) return item;

          const nextQuantity = item.quantity + delta;
          return nextQuantity > 0 ? { ...item, quantity: nextQuantity } : null;
        })
        .filter(Boolean)
    );
  };

  const removeFromOrder = (menuItemId) => {
    setSelectedItems((prev) => prev.filter((item) => item.menuItem !== menuItemId));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage("Please login first.");
      return;
    }

    if (selectedItems.length === 0) {
      setMessage("Please select at least one item.");
      return;
    }

    try {
      const payload = {
        items: selectedItems.map((item) => ({
          menuItem: item.menuItem,
          quantity: item.quantity
        })),
        deliveryAddress: deliveryAddress.trim()
      };

      await api.post("/orders", payload);

      setMessage("Order placed successfully!");
      setSelectedItems([]);
      setDeliveryAddress("");
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to place order");
    }
  };

  return (
    <div className="row g-4">
      <div className="col-md-7">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-3">Place Order</h3>

            {menuItems.map((item) => (
              <div key={item._id} className="border rounded p-3 mb-2 d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="mb-1">{item.name}</h6>
                  <p className="mb-0 text-muted">{item.description}</p>
                  <strong>₹{item.price}</strong>
                </div>

                <button className="btn btn-sm btn-primary" onClick={() => addToOrder(item)}>
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-md-5">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-3">Your Order</h3>

            {selectedItems.length === 0 ? (
              <p className="text-muted">No items selected yet.</p>
            ) : (
              <ul className="list-group mb-3">
                {selectedItems.map((item) => {
                  const menuItem = menuItems.find((x) => x._id === item.menuItem);
                  return (
                    <li key={item.menuItem} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <span>
                          {menuItem?.name || "Item"} x{item.quantity}
                        </span>
                        <span>₹{(menuItem?.price || 0) * item.quantity}</span>
                      </div>

                      <div className="mt-2 d-flex gap-2">
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.menuItem, -1)}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => updateQuantity(item.menuItem, 1)}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger btn-sm ms-auto"
                          onClick={() => removeFromOrder(item.menuItem)}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            <form onSubmit={handlePlaceOrder}>
              <div className="mb-3">
                <label className="form-label">Delivery Address</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                />
              </div>

              {message && <div className="alert alert-info">{message}</div>}

              <button className="btn btn-success w-100" type="submit">
                Place Order
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}