import express from "express";
const router = express.Router();
import {
  createUserRegisterWorkspace,
  addWorkspace,
  getWorkspace,
  getAllRegisterWorkspaces,
} from "../controllers/workspaceController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/newregister", createUserRegisterWorkspace);
router.post("/newspace", protect, addWorkspace);
router.get("/getspace/:id", protect, getWorkspace);
router.get("/register", protect, getAllRegisterWorkspaces);

export default router;
