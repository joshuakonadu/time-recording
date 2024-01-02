import express from "express";
const router = express.Router();
import {
  createUserRegisterWorkspace,
  addWorkspace,
  getWorkspace,
  getAllRegisterWorkspaces,
  deleteWorkspaceUser,
  updateWorkspaceMember,
  deleteWorkspaceMember,
  getWorkspaceMembers,
} from "../controllers/workspaceController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/newregister", createUserRegisterWorkspace);
router.post("/newspace", protect, addWorkspace);
router.get("/getspace/:id", protect, getWorkspace);
router.get("/register", protect, getAllRegisterWorkspaces);
router.delete("/workspaceuser/:id", protect, deleteWorkspaceUser);
router.put("/updatemembers/:id", protect, updateWorkspaceMember);
router.put("/removemember/:id", protect, deleteWorkspaceMember);
router.get("/members/:id", protect, getWorkspaceMembers);

export default router;
