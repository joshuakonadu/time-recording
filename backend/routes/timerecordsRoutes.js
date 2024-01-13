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
router.get("/workspace/:id", protect, getTimeByWorkspace);
router.get("/user", protect, getTimeByUser);
router.post("/user-workspace", protect, getTimeByWorkspaceUser);
router.put("/update", protect, updateTimeRecord);
router.delete("/delete/:id", protect, deleteTimeRecord);
router.post("/admin-add", protect, addAdminTime);
router.post("/admin-workspace", protect, getTimeByWorkspaceAdmin);

export default router;
