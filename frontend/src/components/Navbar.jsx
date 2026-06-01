import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../App.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.name) {
          setUser(parsedUser);
        }
      }
    } catch (err) {
      console.error("Error reading user data:", err);
      localStorage.removeItem("user");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="logo">StayBuddies</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/findroom">Find Room</Link>
        <Link to="/postproperty">Post Room</Link>

        {user ? (
          <>
            <span className="welcome-text">Hello, {user.name} 👋</span>
            <button onClick={handleLogout} className="login-btn logout-btn">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
