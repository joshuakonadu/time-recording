import express from "express";
const router = express.Router();
import {
  createUserRegisterWorkspace,
  addWorkspace,
  getWorkspace,
  getAllRegisterWorkspaces,
  deleteWorkspaceUser,
} from "../controllers/workspaceController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/newregister", createUserRegisterWorkspace);
router.post("/newspace", protect, addWorkspace);
router.get("/getspace/:id", protect, getWorkspace);
router.get("/register", protect, getAllRegisterWorkspaces);
router.delete("/workspaceuser/:id", protect, deleteWorkspaceUser);

export default router;
