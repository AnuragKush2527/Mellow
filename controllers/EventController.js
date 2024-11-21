import EventModel from "../models/Event.js";
import UserModel from "../models/User.js";
import mongoose from "mongoose";

const validCategories = [
  "Music",
  "Social",
  "Education",
  "Gaming",
  "Arts",
  "Sports",
  "Wellness",
  "Networking",
  "Technology",
];

const createEvent = async (req, res) => {
  try {
    const {
      image,
      name,
      description,
      date,
      time,
      category,
      maxAttendees,
      location,
    } = req.body;

    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "User not authenticated.",
        success: false,
      });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        message: `Invalid category. Allowed categories are: ${validCategories.join(
          ", "
        )}`,
        success: false,
      });
    }

    const newEvent = new EventModel({
      image,
      name,
      description,
      date,
      time,
      category,
      maxAttendees,
      location,
      userId: req.user._id,
    });

    await newEvent.save();

    await UserModel.findByIdAndUpdate(
      req.user._id,
      { $push: { myEvents: newEvent._id } },
      { new: true }
    );

    res.status(201).json({
      message: "Event created successfully.",
      success: true,
      event: newEvent,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
    });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Ensure user is authenticated and userId is available in req.user
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "User not authenticated.",
        success: false,
      });
    }

    // Check if the eventId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        message: "Invalid event ID format.",
        success: false,
      });
    }

    // Find the event by ID
    const event = await EventModel.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
        success: false,
      });
    }

    // Check if the authenticated user is the creator of the event
    if (event.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this event.",
        success: false,
      });
    }

    // Remove the event from the user's "myEvents" array and delete the event
    await UserModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { myEvents: eventId } },
      { new: true }
    );

    // Also remove the event from users who may have joined the event
    await UserModel.updateMany(
      { joinedEvents: eventId },
      { $pull: { joinedEvents: eventId } }
    );

    // Delete the event if the user is authorized
    await EventModel.deleteOne({ _id: eventId });

    res.status(200).json({
      message: "Event deleted successfully.",
      success: true,
    });
  } catch (err) {
    console.error("Error deleting event:", err);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: err.message, // Include error message for debugging
    });
  }
};

const viewEvents = async (req, res) => {
  try {
    const events = await EventModel.find();

    if (events.length === 0) {
      return res.status(404).json({
        message: "No events found.",
        success: false,
      });
    }

    res.status(200).json({
      message: "Events fetched successfully.",
      success: true,
      events,
    });
  } catch (err) {
    console.error("Error fetching events:", err);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: err.message,
    });
  }
};

const joinEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await EventModel.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
        success: false,
      });
    }

    if (event.attendees.includes(userId)) {
      return res.status(400).json({
        message: "User is already attending this event.",
        success: false,
      });
    }

    event.attendees.push(userId);
    await event.save();

    // Add the event to the user's "joinedEvents" array
    await UserModel.findByIdAndUpdate(
      userId,
      { $push: { joinedEvents: event._id } },
      { new: true }
    );

    res.status(200).json({
      message: "User added as an attendee successfully.",
      success: true,
      event,
    });
  } catch (err) {
    console.error("Error adding attendee:", err);
    res.status(500).json({
      message: "Internal server error.",
      success: false,
      error: err.message,
    });
  }
};

export { createEvent, deleteEvent, viewEvents, joinEvent };
