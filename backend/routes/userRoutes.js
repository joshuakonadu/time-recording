import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  identifyUser,
} from "../controllers/userController.js";
import { check } from "../middleware/authMiddleware.js";

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/whoami", check, identifyUser);

export default router;
