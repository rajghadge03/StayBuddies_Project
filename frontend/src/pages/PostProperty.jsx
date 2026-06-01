import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar"; 
import "./PostProperty.css";


const PostProperty = () => {
  const [formData, setFormData] = useState({
    address: "",
    roomType: "Room",
    rentPrice: "",
    features: "",
    images: [],
    ownerDocument: null,
  });

  const [imagePreviews, setImagePreviews] = useState([]);
  const imagesInputRef = useRef(null);
  const ownerInputRef = useRef(null);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleImageChange = (e) => {
    const filesArray = Array.from(e.target.files || []);
    const allowed = filesArray.slice(0, 5);
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    const previews = allowed.map((file) => URL.createObjectURL(file));
    setFormData((s) => ({ ...s, images: allowed }));
    setImagePreviews(previews);
  };

  const handleOwnerChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setFormData((s) => ({ ...s, ownerDocument: file || null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.address.trim()) return alert("Please enter address.");
    if (!formData.rentPrice) return alert("Please enter rent price.");
    if (formData.images.length === 0)
      return alert("Please choose at least one property image.");
    if (!formData.ownerDocument)
      return alert("Please upload ownership proof.");

    const data = new FormData();
    data.append("address", formData.address);
    data.append("roomType", formData.roomType);
    data.append("rentPrice", formData.rentPrice);
    data.append("features", formData.features || "");

    formData.images.forEach((file) => data.append("images", file));
    data.append("ownershipProof", formData.ownerDocument);

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/properties/add", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      alert("✅ Property posted successfully!");
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
      setImagePreviews([]);
      setFormData({
        address: "",
        roomType: "Room",
        rentPrice: "",
        features: "",
        images: [],
        ownerDocument: null,
      });

      if (imagesInputRef.current) imagesInputRef.current.value = "";
      if (ownerInputRef.current) ownerInputRef.current.value = "";
    } catch (err) {
      console.error("Error posting property:", err);
      alert("❌ Error posting property. Check console for details.");
    }
  };

  return (
    <>
      
      <Navbar />

   
      <div className="post-property-container">
        <form className="post-property-form" onSubmit={handleSubmit}>
          <h2>Post Your Property</h2>

          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />

          <label>Room Type</label>
          <select
            name="roomType"
            value={formData.roomType}
            onChange={handleChange}
          >
            <option value="Room">Room</option>
            <option value="PG">PG</option>
            <option value="Flat">Flat</option>
          </select>

          <label>Rent (₹)</label>
          <input
            type="number"
            name="rentPrice"
            value={formData.rentPrice}
            onChange={handleChange}
            required
          />

          <label>Features (comma-separated)</label>
          <input
            type="text"
            name="features"
            value={formData.features}
            onChange={handleChange}
            placeholder="e.g. AC, Wifi, Balcony"
          />

          <label>Upload Property Images (max 5)</label>
          <input
            ref={imagesInputRef}
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
          />
          <div className="file-name">
            {formData.images.length > 0
              ? `${formData.images.length} image(s) selected`
              : "No images chosen"}
          </div>

          <div className="image-preview">
            {imagePreviews.map((src, i) => (
              <img key={i} src={src} alt={`preview-${i}`} />
            ))}
          </div>

          <label>Upload Ownership Proof (PDF or Image)</label>
          <input
            ref={ownerInputRef}
            type="file"
            name="ownerDocument"
            accept=".pdf,image/*"
            onChange={handleOwnerChange}
          />
          <div className="file-name">
            {formData.ownerDocument
              ? formData.ownerDocument.name
              : "No file chosen"}
          </div>

          <button type="submit" className="submit-btn">
            Post Property
          </button>
        </form>
      </div>
      <footer className="footer">
        <p>© 2025 StayBuddies. All rights reserved.</p>
      </footer>
    </>
  );
};

export default PostProperty;
