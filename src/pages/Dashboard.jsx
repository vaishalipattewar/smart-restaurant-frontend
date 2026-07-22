import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="card shadow-sm">
          <div className="card-body">
            <h3 className="mb-2">Welcome, {user?.name || "Guest"}!</h3>
            <p className="text-muted mb-0">
              Manage your restaurant activity from here.
            </p>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5>Order Food</h5>
            <p className="text-muted">
              Place a new order and track your selected items.
            </p>
            <Link to="/place-order" className="btn btn-primary">
              Place Order
            </Link>
          </div>
        </div>
      </div>

      <div className="col-md-6">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5>View Order History</h5>
            <p className="text-muted">
              See all your previous orders and their status.
            </p>
            <Link to="/orders" className="btn btn-outline-primary">
              My Orders
            </Link>
          </div>
        </div>
      </div>
      {user?.role === "admin" && (
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5>Admin Order Management</h5>
              <p className="text-muted">
                Update customer order status from Pending to Delivered.
              </p>
              <Link to="/admin-orders" className="btn btn-success">
                Manage Orders
              </Link>
            </div>
          </div>
        </div>
      )}
      <div className="col-md-6">
        <div className="card shadow-sm h-100">
          <div className="card-body">
            <h5>Share Your Experience</h5>
            <p className="text-muted">
              Submit ratings and reviews for the restaurant.
            </p>
            <Link to="/feedback" className="btn btn-outline-success">
              Go to Feedback
            </Link>
          </div>
        </div>
      </div>
    </div>
    
  );
}