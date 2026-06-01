import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: { type: String, required: true },
    roomType: { type: String, required: true },
    rentPrice: { type: Number, required: true },
    features: [String],
    description: { type: String },
    location: { type: String },

    // ✅ Multiple images (max 4)
    images: {
      type: [String],
      required: true,
    },

    // ✅ Ownership proof (file name of document)
    ownershipProof: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model("Property", propertySchema);
export default Property;
