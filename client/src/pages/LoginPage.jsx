import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckSquare, LogIn, Sparkles, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login({ email, password });
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDemo() {
    setError("");
    try {
      setSubmitting(true);
      await demoLogin();
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div
            className="brand-icon"
            style={{ margin: "0 auto", width: 42, height: 42 }}
          >
            <CheckSquare size={22} strokeWidth={2.5} />
          </div>
          <h1>Welcome to TaskMate</h1>
          <p>Sign in to access your personal MERN task workspace</p>
        </div>

        {error && (
          <div className="toast-banner toast-error" role="alert">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group" style={{ marginBottom: 14 }}>
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              className="input-control"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 18 }}>
            <label htmlFor="login-password">Password</label>
            <div style={{ position: "relative" }}>
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                className="input-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 40 }}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#526575",
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginBottom: 10 }}
            disabled={submitting}
          >
            <LogIn size={17} />
            {submitting ? "Signing in..." : "Sign In"}
          </button>

          <button
            type="button"
            className="btn btn-amber"
            style={{ width: "100%" }}
            onClick={handleDemo}
            disabled={submitting}
          >
            <Sparkles size={17} />
            One-Click Demo Account
          </button>
        </form>

        <p className="auth-footer-link">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
