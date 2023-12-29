import mongoose from "mongoose";

const userMessageSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "Please add a user ID"],
    },
    type: {
      type: String,
      required: [true, "Please add a message type"],
    },
    message: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const UserMessage = mongoose.model("UserMessage", userMessageSchema);
