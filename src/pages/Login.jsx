
import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        navigate("/dashboard", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setStatus("");
    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      navigate("/dashboard");

    } catch (error) {
      console.error("LOGIN ERROR:", error.code, error.message);

      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setError("Incorrect email or password. Please check your details.");
      } else if (error.code === "auth/operation-not-allowed") {
        setError("Email/password sign-in is not enabled for this Firebase project.");
      } else if (error.code === "auth/too-many-requests") {
        setError("Too many attempts. Please try again later.");
      } else if (error.code === "auth/network-request-failed") {
        setError("Network error. Check your internet connection.");
      } else {
        setError(error.message);
      }

    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    setStatus("");

    if (!email.trim()) {
      setError("Enter your email first, then choose Forgot password.");
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setStatus("Password reset email sent. Check your inbox.");
    } catch (resetError) {
      if (resetError.code === "auth/user-not-found") {
        setError("No account uses this email address.");
      } else if (resetError.code === "auth/invalid-email") {
        setError("Enter a valid email address.");
      } else {
        setError(resetError.message);
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h1>Admin Login</h1>

        <p>Login to manage your portfolio.</p>

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {status && (
          <p className="status-message">
            {status}
          </p>
        )}

        <label>Email</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label>Password</label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button
          type="button"
          className="forgot-password"
          onClick={handlePasswordReset}
          disabled={resetLoading}
        >
          {resetLoading ? "Sending reset email..." : "Forgot password?"}
        </button>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <Link to="/">
          Back to Home
        </Link>
      </form>
    </div>
  );
}

export default Login;
