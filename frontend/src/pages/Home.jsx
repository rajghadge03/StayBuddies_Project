import "../App.css";
import Navbar from "../components/Navbar"; 
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const searchParam = query || city;
    if (searchParam.trim()) {
      navigate(`/findroom?search=${encodeURIComponent(searchParam)}`);
    } else {
      navigate("/findroom");
    }
  };

  return (
    <>
      {/*  Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <div className="search-bar">
            <select value={city} onChange={(e) => setCity(e.target.value)}>
              <option value="">Select City</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Delhi">Delhi</option>
              <option value="Pune">Pune</option>
            </select>

            <input
              type="text"
              placeholder="Search by Area"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <button onClick={handleSearch}>Find Room</button>
          </div>

          <h1>Find Affordable Rooms for Students & Bachelors</h1>
          <p>Verified PGs and rental rooms — no brokerage, no hassle.</p>
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="feature">
          <h3>🏠 No Brokerage</h3>
          <p>Direct owner listings, no middlemen.</p>
        </div>
        <div className="feature">
          <h3>✅ Verified Listings</h3>
          <p>Properties are checked and approved.</p>
        </div>
        <div className="feature">
          <h3>💬 24/7 Support</h3>
          <p>We’re here to help you anytime.</p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-list">
          <div className="testimonial">
            <p>“StayBuddies helped me find a great PG near my college within a day!”</p>
            <h4>— Aditi, Pune</h4>
          </div>
          <div className="testimonial">
            <p>“No brokers, no hassle. I directly connected with the owner. Highly recommended!”</p>
            <h4>— Rohan, Bangalore</h4>
          </div>
          <div className="testimonial">
            <p>“I posted my flat and got tenants in just 3 days. Great platform!”</p>
            <h4>— Shruti, Mumbai</h4>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <h2>About StayBuddies</h2>
        <p>
          StayBuddies is your trusted platform for finding comfortable, affordable rental rooms
          and PGs designed especially for students and working professionals. We make the search
          simple — verified listings, zero brokerage, and a hassle-free experience so you can focus
          on what truly matters.
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 StayBuddies. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Home;
