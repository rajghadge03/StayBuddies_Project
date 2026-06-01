import { useState } from "react";
import "./Register.css";
import Navbar from "../components/Navbar";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    contact: "",
    role: "", 
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
      } else {
        setMessage("✅ Registered successfully!");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong. Try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="register-section">
        <div className="register-container">
          <h2>Create Account</h2>
          <form onSubmit={handleRegister}>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <label>Contact Number</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
            />

            <label>Register as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="">Select Role</option>
              <option value="tenant">Tenant</option>
              <option value="owner">Owner</option>
            </select>

            <button type="submit">Register</button>
          </form>

          {message && <p className="msg">{message}</p>}

          <p>
            Already have an account? <a href="/login">Login here</a>
          </p>
        </div>
      </div>
      <footer className="footer">
        <p>© 2025 StayBuddies. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Register;
