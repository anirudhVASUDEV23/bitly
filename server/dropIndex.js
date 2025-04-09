import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

const dropIndex = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const Link = mongoose.connection.collection("links");
    await Link.dropIndex("shortUrl_1");
    console.log("Successfully dropped shortUrl index");
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

dropIndex();
