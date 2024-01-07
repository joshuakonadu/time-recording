import express from "express";
const router = express.Router();
import {
  inviteWorkspace,
  removeInvitation,
  acceptInvitation,
  getInvitations,
} from "../controllers/invitationController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/add", protect, inviteWorkspace);
router.post("/accept", protect, acceptInvitation);
router.post("/remove", protect, removeInvitation);
router.get("/all", protect, getInvitations);

export default router;
