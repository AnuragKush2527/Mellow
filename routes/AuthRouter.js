import { signup, login, logout } from "../controllers/AuthController.js";
import {
  signupValidation,
  loginValidation,
} from "../middlewares/AuthValidation.js";

import express from "express";

const router = express.Router();

router.post("/login", loginValidation, login);
router.post("/signup", signupValidation, signup);
router.post("/logout", logout);

export default router;
