import express from "express";
const router = express.Router();
import {
  addWorkspace,
  getWorkspace,
  getAllRegisterWorkspaces,
  deleteWorkspaceUser,
  updateWorkspaceMember,
  deleteWorkspaceMember,
  getWorkspaceMembers,
} from "../controllers/workspaceController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/add", protect, addWorkspace);
router.get("/data/:id", protect, getWorkspace);
router.get("/register-workspaces", protect, getAllRegisterWorkspaces);
router.delete("/remove/:id", protect, deleteWorkspaceUser);
router.put("/update-members/:id", protect, updateWorkspaceMember);
router.put("/remove-member/:id", protect, deleteWorkspaceMember);
router.get("/members/:id", protect, getWorkspaceMembers);

export default router;
