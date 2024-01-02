import express from "express";
const router = express.Router();
import {
  addTime,
  getTimeByWorkspace,
  getTimeByUser,
  getTimeByWorkspaceUser,
  updateTimeRecord,
  deleteTimeRecord,
  addAdminTime,
  getTimeByWorkspaceAdmin,
} from "../controllers/timerecordsController.js";
import { protect } from "../middleware/authMiddleware.js";

router.post("/add", protect, addTime);
router.get("/byworkspace/:id", protect, getTimeByWorkspace);
router.get("/byuser", protect, getTimeByUser);
router.post("/userworkspace", protect, getTimeByWorkspaceUser);
router.put("/update", protect, updateTimeRecord);
router.delete("/delete/:id", protect, deleteTimeRecord);
router.post("/adminadd", protect, addAdminTime);
router.post("/adminworkspace", protect, getTimeByWorkspaceAdmin);

export default router;
