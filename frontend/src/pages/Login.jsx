import { useState } from "react";
import "./Login.css";
import Navbar from "../components/Navbar";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
  setMessage(data.message || "Login failed ❌");
} else {
  // ✅ Save both token and user info
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  setMessage("✅ Login successful! Redirecting...");
  setTimeout(() => {
    window.location.href = "/";
  }, 1500);
}

    } catch (err) {
      console.error("Error:", err);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <section className="login-section">
        <div className="login-container">
          <h2>Welcome Back 👋</h2>
          <form onSubmit={handleLogin}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">Login</button>
          </form>

          {message && <p className="msg">{message}</p>}

          <p>
            Don’t have an account?{" "}
            <a href="/register">Register here</a>
          </p>
        </div>
      </section>
      <footer className="footer">
        <p>© 2025 StayBuddies. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Login;
