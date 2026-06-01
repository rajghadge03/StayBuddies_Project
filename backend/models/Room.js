import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  rent: { type: Number, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Room = mongoose.model("Room", roomSchema);
export default Room;
