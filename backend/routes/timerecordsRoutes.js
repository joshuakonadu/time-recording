import express from "express";
const router = express.Router();
import {
  addTime,
  getTimeByWorkspace,
  getTimeByUser,
  getTimeByWorkspaceUser,
  updateTimeRecord,
} from "../controllers/timerecordsController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/add", protect, addTime);
router.get("/byworkspace/:id", protect, getTimeByWorkspace);
router.get("/byuser", protect, getTimeByUser);
router.get("/userworkspace/:id", protect, getTimeByWorkspaceUser);
router.put("/update", protect, updateTimeRecord);

export default router;
