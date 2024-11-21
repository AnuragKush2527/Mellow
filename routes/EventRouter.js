import { ensureAuthenticated } from "../middlewares/Auth.js";
import { createEvent, deleteEvent, joinEvent, viewEvents } from "../controllers/EventController.js";
import express from "express";

const router = express.Router();

router.get("/events", ensureAuthenticated, viewEvents);
router.post("/hostEvent", ensureAuthenticated, createEvent);
router.post("/joinEvent/:eventId", ensureAuthenticated, joinEvent);
router.delete("/deleteEvent/:eventId", ensureAuthenticated, deleteEvent);

export default router;
