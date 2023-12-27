import express from "express";
const router = express.Router();
import {
  createUserRegisterWorkspace,
  addWorkspace,
  getWorkspace,
} from "../controllers/workspaceController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/newregister", createUserRegisterWorkspace);
router.post("/newspace", protect, addWorkspace);
router.get("/:id", protect, getWorkspace);

export default router;
