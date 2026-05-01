import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav className="navbar">
      <Link to="/admin" className="navbar-brand">
        <span className="brand-icon">⬡</span>
        FormCreater
      </Link>
      <div className="navbar-links">
        <Link to="/admin" className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`}>
          All Forms
        </Link>
        <Link to="/admin/create" className={`nav-link ${location.pathname === "/admin/create" ? "active" : ""}`}>
          + New Form
        </Link>
      </div>
    </nav>
  );
}
