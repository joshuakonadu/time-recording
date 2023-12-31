import express from "express";
const router = express.Router();
import {
  addTime,
  getTimeByWorkspace,
  getTimeByUser,
  getTimeByWorkspaceUser,
  updateTimeRecord,
  deleteTimeRecord,
} from "../controllers/timerecordsController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/add", protect, addTime);
router.get("/byworkspace/:id", protect, getTimeByWorkspace);
router.get("/byuser", protect, getTimeByUser);
router.post("/userworkspace", protect, getTimeByWorkspaceUser);
router.put("/update", protect, updateTimeRecord);
router.delete("/delete/:id", protect, deleteTimeRecord);

export default router;
