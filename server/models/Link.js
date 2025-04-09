import mongoose from "mongoose";
import shortid from "shortid";

const LinkSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    default: shortid.generate,
  },
  customAlias: { type: String, sparse: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  expirationDate: { type: Date },
  clickEvents: [
    {
      timestamp: { type: Date, default: Date.now },
      ipAddress: String,
      userAgent: String,
      referrer: String,
      location: String,
    },
  ],
});

const Link = mongoose.model("Link", LinkSchema);
export default Link;
