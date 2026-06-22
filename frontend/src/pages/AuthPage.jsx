import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupAPI, loginAPI } from "../api";
import "./AuthPage.css";

// ============================================================
//  PERSONAVERSE — AuthPage.jsx
//
//  Real API calls connected:
//    Signup → signupAPI() → token localStorage mein save
//    Login  → loginAPI()  → token localStorage mein save
//    Dono ke baad → /dashboard pe redirect
// ============================================================

const LEFT_POINTS = [
  { icon: "🧑‍💼", text: "Create profiles of any real or fictional person" },
  { icon: "💬", text: "Chat with them — AI responds in their voice" },
  { icon: "🧠", text: "Understand any perspective, on any topic" },
];

export default function AuthPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab]   = useState("login");
  const [loginData, setLoginData]   = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "", email: "", password: "", confirmPassword: "",
  });
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLoginChange(field, value) {
    setLoginData((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  function handleSignupChange(field, value) {
    setSignupData((prev) => ({ ...prev, [field]: value }));
    setError("");
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setError("");
    setSuccess("");
  }

  // ── LOGIN ──
  async function handleLogin() {
    if (!loginData.email || !loginData.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Real API call
      const data = await loginAPI(loginData.email, loginData.password);

      if (data.token) {
        // Token aur user info localStorage mein save karo
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Dashboard pe le jao
        navigate("/dashboard");
      } else {
        // Backend ne error bheja
        setError(data.message || "Login failed.");
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── SIGNUP ──
  async function handleSignup() {
    if (!signupData.name || !signupData.email || !signupData.password || !signupData.confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (signupData.password !== signupData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (signupData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      // Real API call
      const data = await signupAPI(signupData.name, signupData.email, signupData.password);

      if (data.token) {
        // Signup ke baad seedha login kar do
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/dashboard");
      } else {
        setError(data.message || "Signup failed.");
      }

    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      activeTab === "login" ? handleLogin() : handleSignup();
    }
  }

  return (
    <div className="auth-page">

      {/* LEFT PANEL */}
      <div className="auth-left">
        <div className="auth-left__bg-emoji">🧠</div>
        <div className="auth-left__logo">PersonaVerse</div>
        <div className="auth-left__tag">AI-Powered Personas</div>
        <h1 className="auth-left__title">
          Look inside<br />
          anyone's mind.<br />
          On demand.
        </h1>
        <p className="auth-left__subtitle">
          Build detailed profiles of any real or fictional person,
          then have a real conversation with them — powered by AI.
        </p>
        <div className="auth-left__points">
          {LEFT_POINTS.map((point, index) => (
            <div key={index} className="auth-left__point">
              <div className="auth-left__point-icon">{point.icon}</div>
              <span>{point.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-right">
        <div className="auth-right__inner">

          {/* Tabs */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
              onClick={() => switchTab("login")}
            >
              Login
            </button>
            <button
              className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
              onClick={() => switchTab("signup")}
            >
              Sign Up
            </button>
          </div>

          {/* Error banner */}
          {error && (
            <div className="auth-banner auth-banner--error">⚠️ {error}</div>
          )}

          {/* Success banner */}
          {success && (
            <div className="auth-banner auth-banner--success">✅ {success}</div>
          )}

          {/* LOGIN FORM */}
          {activeTab === "login" && (
            <div>
              <div className="auth-form__title">Welcome back</div>
              <div className="auth-form__subtitle">
                Login to access your personas and chat history.
              </div>

              <div className="auth-field">
                <label className="auth-field__label">Email Address</label>
                <input
                  className="auth-field__input"
                  type="email"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={(e) => handleLoginChange("email", e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="auth-field">
                <label className="auth-field__label">Password</label>
                <input
                  className="auth-field__input"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => handleLoginChange("password", e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="auth-forgot">
                <span className="auth-forgot__link">Forgot password?</span>
              </div>

              <button
                className="auth-submit-btn"
                onClick={handleLogin}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login →"}
              </button>

              <div className="auth-switch">
                Don't have an account?
                <span className="auth-switch__link" onClick={() => switchTab("signup")}>
                  Sign up
                </span>
              </div>
            </div>
          )}

          {/* SIGNUP FORM */}
          {activeTab === "signup" && (
            <div>
              <div className="auth-form__title">Create an account</div>
              <div className="auth-form__subtitle">
                Join PersonaVerse and start building your personas.
              </div>

              <div className="auth-field">
                <label className="auth-field__label">Full Name</label>
                <input
                  className="auth-field__input"
                  type="text"
                  placeholder="e.g. Anshika Sharma"
                  value={signupData.name}
                  onChange={(e) => handleSignupChange("name", e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="auth-field">
                <label className="auth-field__label">Email Address</label>
                <input
                  className="auth-field__input"
                  type="email"
                  placeholder="you@example.com"
                  value={signupData.email}
                  onChange={(e) => handleSignupChange("email", e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="auth-field">
                <label className="auth-field__label">Password</label>
                <input
                  className="auth-field__input"
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={signupData.password}
                  onChange={(e) => handleSignupChange("password", e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <div className="auth-field">
                <label className="auth-field__label">Confirm Password</label>
                <input
                  className="auth-field__input"
                  type="password"
                  placeholder="Re-enter your password"
                  value={signupData.confirmPassword}
                  onChange={(e) => handleSignupChange("confirmPassword", e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>

              <button
                className="auth-submit-btn"
                onClick={handleSignup}
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account →"}
              </button>

              <div className="auth-switch">
                Already have an account?
                <span className="auth-switch__link" onClick={() => switchTab("login")}>
                  Login
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}