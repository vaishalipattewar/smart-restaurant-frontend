import { useState } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import "./App.css";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import AdminOrders from "./pages/AdminOrders";
import ReserveTable from "./pages/ReserveTable";
import AdminReservations from "./pages/AdminReservations";
import AdminUsers from "./pages/AdminUsers";
import AdminFeedback from "./pages/AdminFeedback";
import Feedback from "./pages/Feedback";
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
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className="app-shell">
      <nav className="navbar navbar-expand-lg app-navbar shadow-sm mb-4">
        <div className="container">
          <Link to="/" className="navbar-brand fw-bold me-3">
            Smart Restaurant
          </Link>

          <div className="d-flex flex-grow-1 align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center flex-wrap gap-2 me-auto">
              {user && (
                <>
                  <Link to="/dashboard" className="nav-link text-white fw-semibold">
                    Dashboard
                  </Link>
                  <Link to="/menu" className="nav-link text-white fw-semibold">
                    Menu
                  </Link>

                  <div className="dropdown position-relative">
                    <button
                      className="btn btn-outline-light btn-sm px-3 dropdown-toggle"
                      type="button"
                      onClick={() =>
                        setOpenDropdown(openDropdown === "orders" ? null : "orders")
                      }
                    >
                      Orders
                    </button>

                    {openDropdown === "orders" && (
                      <div className="dropdown-menu show d-block mt-2" style={{ position: "absolute", zIndex: 1000 }}>
                        <Link
                          to="/orders"
                          className="dropdown-item"
                          onClick={() => setOpenDropdown(null)}
                        >
                          My Orders
                        </Link>
                        <Link
                          to="/place-order"
                          className="dropdown-item"
                          onClick={() => setOpenDropdown(null)}
                        >
                          Place Order
                        </Link>
                      </div>
                    )}
                  </div>

                  <Link to="/reserve-table" className="nav-link text-white fw-semibold">
                    Reservations
                  </Link>

                  {user.role === "admin" && (
                    <div className="dropdown position-relative">
                      <button
                        className="btn btn-outline-light btn-sm px-3 dropdown-toggle"
                        type="button"
                        onClick={() =>
                          setOpenDropdown(openDropdown === "admin" ? null : "admin")
                        }
                      >
                        Admin
                      </button>

                      {openDropdown === "admin" && (
                        <div className="dropdown-menu show d-block mt-2" style={{ position: "absolute", zIndex: 1000 }}>
                          <Link
                            to="/admin-users"
                            className="dropdown-item"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Manage Users
                          </Link>
                          <Link
                            to="/admin-orders"
                            className="dropdown-item"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Manage Orders
                          </Link>
                          <Link
                            to="/admin-reservations"
                            className="dropdown-item"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Manage Reservations
                          </Link>
                          <Link
                            to="/admin-feedback"
                            className="dropdown-item"
                            onClick={() => setOpenDropdown(null)}
                          >
                            Manage Feedback
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                  <Link to="/feedback" className="nav-link text-white fw-semibold">
                    Feedback
                  </Link>
                </>
              )}
            </div>

            {!user ? (
              <div className="d-flex align-items-center gap-2">
                <Link to="/login" className="nav-link text-white fw-semibold">
                  Login
                </Link>
                <Link to="/register" className="nav-link text-white fw-semibold">
                  Register
                </Link>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-light btn-sm fw-semibold logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container app-content">
        <Routes>
          <Route path="/" element={<Home />} />
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
            path="/admin-users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminUsers />
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
            path="/admin-reservations"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminReservations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin-feedback"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminFeedback />
              </ProtectedRoute>
            }
          />

          <Route
            path="/feedback"
            element={
              <ProtectedRoute allowedRoles={["user", "admin"]}>
                <Feedback />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;