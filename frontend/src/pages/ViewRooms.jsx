import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./ViewRooms.css";

const ViewRooms = () => {
  const location = useLocation(); // ✅ moved inside component
  const queryParams = new URLSearchParams(location.search);
  const initialSearch = queryParams.get("search") || "";

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // filters
  const [roomType, setRoomType] = useState("All");
  const [minRent, setMinRent] = useState("");
  const [maxRent, setMaxRent] = useState("");
  const [search, setSearch] = useState(initialSearch);

  // contact popup states
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showContact, setShowContact] = useState(false);

  // ✅ fetch properties (with filters)
  const fetchProperties = async (params = {}) => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5000/api/properties", { params });
      setProperties(res.data || []);
    } catch (err) {
      console.error("Fetch properties error:", err);
      setError("Failed to load properties.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ initial load + homepage search support
  useEffect(() => {
    if (initialSearch) {
      fetchProperties({ search: initialSearch });
    } else {
      fetchProperties();
    }
  }, [initialSearch]);

  // ✅ handle filter search
  const handleSearch = (e) => {
    e?.preventDefault();
    const params = {};
    if (roomType && roomType !== "All") params.roomType = roomType;
    if (minRent) params.minRent = minRent;
    if (maxRent) params.maxRent = maxRent;
    if (search) params.search = search.trim();
    fetchProperties(params);
  };

  const handleReset = () => {
    setRoomType("All");
    setMinRent("");
    setMaxRent("");
    setSearch("");
    fetchProperties();
  };

  const handleContactClick = (owner) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to view contact information.");
      window.location.href = "/login";
      return;
    }
    setSelectedOwner(owner);
    setShowContact(true);
  };

  return (
    <>
      <Navbar />

      <div className="viewrooms-page">
        {/* Filters Panel */}
        <div className="filters-panel">
          <h3>Filters</h3>

          <div className="filter-row">
            <label>Room Type</label>
            <select value={roomType} onChange={(e) => setRoomType(e.target.value)}>
              <option value="All">All</option>
              <option value="Room">Room</option>
              <option value="PG">PG</option>
              <option value="Flat">Flat</option>
            </select>
          </div>

          <div className="filter-row">
            <label>Min Rent (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={minRent}
              onChange={(e) => setMinRent(e.target.value)}
            />
          </div>

          <div className="filter-row">
            <label>Max Rent (₹)</label>
            <input
              type="number"
              placeholder="Any"
              value={maxRent}
              onChange={(e) => setMaxRent(e.target.value)}
            />
          </div>

          <div className="filter-row">
            <label>Search (address or feature)</label>
            <input
              type="text"
              placeholder="e.g. Kharadi, Wifi"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-actions">
            <button className="btn-primary" onClick={handleSearch}>Search</button>
            <button className="btn-secondary" onClick={handleReset}>Reset</button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="results-panel">
          <h2>Available Rooms & Properties</h2>

          {loading ? (
            <div className="loading">Loading properties...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : properties.length === 0 ? (
            <div className="no-data">
              <img src="/no-data.svg" alt="No properties" />
              <h3>No Rooms Available</h3>
              <p>Try adjusting the filters or post a property.</p>
              <Link to="/post-property" className="btn-primary">
                Post a Property
              </Link>
            </div>
          ) : (
            <div className="property-list">
              {properties.map((p) => (
                <div className="property-card" key={p._id}>
                  <div className="card-left">
                    <img
                      src={
                        p.images && p.images.length > 0
                          ? `http://localhost:5000/uploads/${p.images[0]}`
                          : "/placeholder.jpg"
                      }
                      alt={p.address}
                    />
                  </div>

                  <div className="card-right">
                    <div className="card-header">
                      <h3>{p.roomType} • {p.address}</h3>
                      <div className="rent">₹{p.rentPrice}</div>
                    </div>

                    <div className="card-meta">
                      <div className="meta-item">
                        <strong>Features:</strong>{" "}
                        {Array.isArray(p.features)
                          ? p.features.slice(0, 3).join(", ")
                          : p.features}
                      </div>
                      <div className="meta-item">
                        <strong>Owner:</strong> {p.owner?.name || "—"}
                      </div>
                    </div>

                    <div className="card-actions">
                      <Link to={`/property/${p._id}`} className="btn-outline">
                        View Details
                      </Link>
                      <button
                        className="btn-primary"
                        onClick={() => handleContactClick(p.owner)}
                      >
                        Contact Owner
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showContact && selectedOwner && (
        <div className="contact-popup">
          <div className="contact-box">
            <h3>Owner Contact Information</h3>
            <p><strong>Name:</strong> {selectedOwner.name || "Not provided"}</p>
            <p><strong>Phone:</strong> {selectedOwner.contact || "Not available"}</p>
            <button onClick={() => setShowContact(false)} className="btn-secondary">
              Close
            </button>
          </div>
        </div>
      )}
      <footer className="footer">
        <p>© 2025 StayBuddies. All rights reserved.</p>
      </footer>
    </>
  );
};

export default ViewRooms;
