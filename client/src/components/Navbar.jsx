import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, UserCircle, LogOut, CheckSquare } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand-link">
          <div className="brand-icon">
            <CheckSquare size={20} strokeWidth={2.5} />
          </div>
          <div>
            <span className="brand-title">TaskMate</span>
            <span className="brand-sub">MERN Workspace • v2.0</span>
          </div>
        </NavLink>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <LayoutDashboard size={16} />
            Dashboard
          </NavLink>

          <NavLink
            to="/profile"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            <UserCircle size={16} />
            Profile & Stats
          </NavLink>

          {user && (
            <span className="nav-user-pill" title={user.email}>
              {user.name}
            </span>
          )}

          <button type="button" className="btn-logout" onClick={handleLogout}>
            <LogOut size={15} />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
