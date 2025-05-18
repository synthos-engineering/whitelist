import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  occupation: {
    type: String,
    required: true,
    trim: true,
  },
  platform: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model if it doesn't exist, or use the existing one
const Waitlist =
  mongoose.models.Waitlist || mongoose.model("Waitlist", waitlistSchema);

export default Waitlist;
