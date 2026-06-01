import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import "./PropertyDetails.css";

const PropertyDetails = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // new state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/properties/${id}`);
        setProperty(res.data);
      } catch (error) {
        console.error("Error fetching property details:", error);
      }
    };
    fetchProperty();
  }, [id]);

  if (!property) return <p>Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="property-details-container">
        

        <div className="property-gallery">
          {property.images.map((img, index) => (
            <img
              key={index}
              src={`http://localhost:5000/uploads/${img}`}
              alt={`Property ${index}`}
              className="property-thumbnail"
              onClick={() => setSelectedImage(`http://localhost:5000/uploads/${img}`)}
            />
          ))}
        </div>

        <div className="property-info">
          <h2>{property.address}</h2>
          <p><strong>Room Type:</strong> {property.roomType}</p>
          <p><strong>Rent:</strong> ₹{property.rentPrice}</p>
          <p><strong>Location:</strong> {property.location}</p>
          <p><strong>Description:</strong> {property.description}</p>

          <div className="property-features">
            {property.features.map((feature, i) => (
              <span key={i} className="property-feature-tag">
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>
<button onClick={() => navigate("/findroom")} className="back-button">
          ← Back
        </button>
      {/* Popup when image is clicked */}
      {selectedImage && (
        <div className="image-popup" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Zoomed Property" className="popup-image" />
        </div>
      )}
    </>
  );
};

export default PropertyDetails;
