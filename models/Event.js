//image, name, description, date, time, category, max attendies, location
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 255,
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: [
      "Music",
      "Social",
      "Education",
      "Gaming",
      "Arts",
      "Sports",
      "Wellness",
      "Networking",
      "Technology",
    ],
    required: true,
  },
  maxAttendees: {
    type: Number,
    required: true,
    min: 5,
  },
  location: {
    type: String,
    required: true,
    maxlength: 500,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attendees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  ]
});

const EventModel = mongoose.model("events", EventSchema);
export default EventModel;
