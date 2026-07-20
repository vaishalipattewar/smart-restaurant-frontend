import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import AdminOrders from "./pages/AdminOrders";
import ReserveTable from "./pages/ReserveTable";
import MyReservations from "./pages/MyReservations";
import AdminReservations from "./pages/AdminReservations";
import { logout } from "./store/authSlice";

function ProtectedRoute({ children, allowedRoles = ["user", "admin"] }) {
  const { user } = useSelector((state) => state.auth);

  const hasAccess = Boolean(
    user &&
      allowedRoles.some((role) => role.toLowerCase() === user?.role?.toLowerCase())
  );

  return hasAccess ? children : <Navigate to="/login" replace />;
}

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
        <div className="container-fluid">
          <Link to={user ? "/dashboard" : "/login"} className="navbar-brand fw-bold">
            Smart Restaurant Management
          </Link>

          <div className="ms-auto d-flex align-items-center gap-2">
            {!user && (
              <>
                <Link to="/login" className="nav-link text-white">
                  Login
                </Link>
                <Link to="/register" className="nav-link text-white">
                  Register
                </Link>
              </>
            )}

            {user && (
              <>
                <Link to="/dashboard" className="nav-link text-white">
                  Dashboard
                </Link>
                <Link to="/menu" className="nav-link text-white">
                  Menu
                </Link>
                <Link to="/orders" className="nav-link text-white">
                  My Orders
                </Link>
                <Link to="/place-order" className="nav-link text-white">
                  Place Order
                </Link>
                <Link to="/reserve-table" className="nav-link text-white">
                  Reserve Table
                </Link>
                <Link to="/my-reservations" className="nav-link text-white">
                  My Reservations
                </Link>

                {user.role === "admin" && (
                  <>
                    <Link to="/admin-orders" className="nav-link text-white">
                      Admin Orders
                    </Link>
                    <Link to="/admin-reservations" className="nav-link text-white">
                      Admin Reservations
                    </Link>
                  </>
                )}

                <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/menu"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Menu />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Orders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/place-order"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <PlaceOrder />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-orders"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminOrders />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reserve-table"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <ReserveTable />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-reservations"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <MyReservations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-reservations"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminReservations />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;