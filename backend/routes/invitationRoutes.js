import express from "express";
const router = express.Router();
import {
  inviteWorkspace,
  removeInvitation,
  acceptInvitation,
  getInvitations,
  addRemoveInvitationMessage,
} from "../controllers/invitationController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/add", protect, inviteWorkspace);
router.post("/accept", protect, acceptInvitation);
router.post("/remove", protect, removeInvitation);
router.get("/all", protect, getInvitations);
router.post("/remove-invitation-message", protect, addRemoveInvitationMessage);

export default router;
