import express from "express";
const router = express.Router();
import {
  createUserRegisterWorkspace,
  addWorkspace,
  getWorkspace,
  getAllRegisterWorkspaces,
} from "../controllers/workspaceController.js";
import { protect } from "../middleware/authMiddleware.js";
const logger = (req, res, next) => {
  console.log("reingekommen");
  next();
};

router.post("/newregister", createUserRegisterWorkspace);
router.post("/newspace", protect, addWorkspace);
router.get("/:id", protect, getWorkspace);
router.get("/register", protect, logger, getAllRegisterWorkspaces);

export default router;
