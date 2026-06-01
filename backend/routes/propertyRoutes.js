import express from "express";
import multer from "multer";
import Property from "../models/Property.js";
import { verifyToken, isOwner } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ✅ POST PROPERTY (only for logged-in owners)
router.post(
  "/add",
  verifyToken,
  isOwner,
  upload.fields([
    { name: "images", maxCount: 4 }, // changed to 4
    { name: "ownershipProof", maxCount: 1 }, // renamed for clarity
  ]),
  async (req, res) => {
    try {
      const { address, roomType, rentPrice, features, description, location } = req.body;

      const images = req.files["images"]?.map((f) => f.filename) || [];
      const ownershipProof = req.files["ownershipProof"]?.[0]?.filename || null;

      const property = new Property({
        owner: req.user.id, // ✅ store which owner added it
        address,
        roomType,
        rentPrice,
        features: features ? features.split(",") : [],
        description,
        location,
        images,
        ownershipProof, // ✅ store proof file name
      });

      await property.save();
      res.status(201).json({ message: "Property added successfully" });
    } catch (error) {
      console.error("Error adding property:", error);
      res.status(500).json({ message: "Server error" });
    }
  }
);
// ✅ VIEW ALL PROPERTIES with filtering
router.get("/", async (req, res) => {
  try {
    const { roomType, minRent, maxRent, search } = req.query;
    const filter = {};

    if (roomType && roomType !== "All") {
      filter.roomType = roomType;
    }

    if (minRent) {
      filter.rentPrice = { ...filter.rentPrice, $gte: Number(minRent) };
    }

    if (maxRent) {
      filter.rentPrice = { ...filter.rentPrice, $lte: Number(maxRent) };
    }

    // ✅ add flexible search across multiple fields
    if (search) {
      filter.$or = [
        { address: { $regex: search, $options: "i" } },
        { features: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        
      ];
    }

    // ✅ use the filter here!
    const properties = await Property.find(filter).populate("owner", "name contact");

    res.status(200).json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// ✅ GET SINGLE PROPERTY BY ID
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate("owner", "name contact");
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.status(200).json(property);
  } catch (error) {
    console.error("Error fetching property:", error);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;


