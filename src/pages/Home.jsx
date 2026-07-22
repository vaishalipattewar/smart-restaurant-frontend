import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import "../App.css";

export default function Home() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="home-hero">
      <div className="hero-inner container text-center">
        <h1 className="hero-title">Welcome to Smart Restaurant</h1>
        <p className="hero-subtitle">Delicious food, seamless reservations, and effortless ordering.</p>

        <div className="hero-ctas">
          {!user ? (
            <>
              <Link to="/login" className="btn btn-primary btn-lg me-3">
                Login
              </Link>
              <Link to="/register" className="btn btn-outline-light btn-lg">
                Register
              </Link>
            </>
          ) : (
            <Link to="/dashboard" className="btn btn-primary btn-lg">
              Go to Dashboard
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
