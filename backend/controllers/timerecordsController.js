import asyncHandler from "express-async-handler";
import {
  findTimeRecordsByUserId,
  createTimeRecord,
  findTimeRecordsByWorkspaceId,
  findTimeRecordsByUserAndWorkspaceId,
} from "../models/timerecordModel.js";

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
  const { id: workspaceId } = req.params;
  const user = req.user;
  const timeRecords = await findTimeRecordsByUserAndWorkspaceId(
    user._id,
    workspaceId
  );
  res.status(200).json(timeRecords);
});
