import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../api";
import { setAuth } from "../store/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const res = await api.post("/auth/login", {
        email: form.email.trim(),
        password: form.password
      });
      const payload = res.data || {};
      const user = payload.user || payload;

      if (!payload.token && !payload.accessToken && !user?.token) {
        throw new Error("No token returned from server");
      }

      dispatch(setAuth(payload));
      navigate("/dashboard");
    } catch (error) {
      const message =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card shadow-lg border-0" style={{ width: "100%", maxWidth: "420px" }}>
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        className="form-control"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <input
                            className="form-control"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                    </div>  

                    {errorMessage && (
                        <div className="alert alert-danger py-2" role="alert">
                            {errorMessage}
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    </div>
    
  );
}