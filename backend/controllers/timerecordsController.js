import asyncHandler from "express-async-handler";
import {
  findTimeRecordsByUserId,
  createTimeRecord,
  findTimeRecordsByWorkspaceId,
  findTimeRecordsByUserAndWorkspaceId,
  updateTimeRecordById,
  deleteTimeRecordById,
  findTimeRecordById,
  checkTimeRecordPermission,
  checkWorkspaceAdminPermission,
} from "../utils/index.js";

export const addTime = asyncHandler(async (req, res) => {
  const data = req.body;
  data.userId = req.user._id;
  const timeRecord = await createTimeRecord(data);
  res.status(201).json(timeRecord);
});

export const getTimeByWorkspace = asyncHandler(async (req, res) => {
  const { id: workspaceId } = req.params;
  const timeRecords = await findTimeRecordsByWorkspaceId(workspaceId);
  res.status(200).json(timeRecords);
});

export const getTimeByUser = asyncHandler(async (req, res) => {
  const user = req.user;
  const timeRecords = await findTimeRecordsByUserId(user._id);
  res.status(200).json(timeRecords);
});

export const getTimeByWorkspaceUser = asyncHandler(async (req, res) => {
  const { from, to, workspaceId } = req.body;
  const user = req.user;

  const timeRecords = await findTimeRecordsByUserAndWorkspaceId(
    user._id,
    workspaceId,
    from,
    to
  );
  res.status(200).json(timeRecords);
});

export const updateTimeRecord = asyncHandler(async (req, res) => {
  const data = req.body;
  const user = req.user;
  await checkTimeRecordPermission(user._id, data.workspaceId, data.userId);
  const updatedTimeRecord = await updateTimeRecordById(data._id, data);
  res.status(200).json(updatedTimeRecord);
});

export const deleteTimeRecord = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  const timeRecord = await findTimeRecordById(id);
  await checkTimeRecordPermission(
    user._id,
    timeRecord.workspaceId,
    timeRecord.userId
  );
  await deleteTimeRecordById(id);
  res.status(200).send();
});

export const addAdminTime = asyncHandler(async (req, res) => {
  const data = req.body;
  const user = req.user;
  await checkWorkspaceAdminPermission(user._id, data.workspaceId);
  const timeRecord = await createTimeRecord(data);
  res.status(201).json(timeRecord);
});

export const getTimeByWorkspaceAdmin = asyncHandler(async (req, res) => {
  const { from, to, workspaceId, userId } = req.body;
  const user = req.user;
  await checkWorkspaceAdminPermission(user._id, workspaceId);
  const timeRecords = await findTimeRecordsByUserAndWorkspaceId(
    userId,
    workspaceId,
    from,
    to
  );
  res.status(200).json(timeRecords);
});
