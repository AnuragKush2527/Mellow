import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";
import AuthRouter from "./routes/AuthRouter.js";
import EventRouter from "./routes/EventRouter.js";
const app = express();
import connectDB from "./models/db.js";

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(helmet());
app.use(express.json());
app.use(bodyParser.json());
app.use(AuthRouter);
app.use(EventRouter);

const PORT = process.env.PORT || 4000;
connectDB();

app.listen(PORT, (req, res) => {
  console.log(`Server is running on Port: ${PORT}`);
});
