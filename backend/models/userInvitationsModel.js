import mongoose from "mongoose";

const userInvitationsSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "Please add a user ID"],
    },
    invitations: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const UserInvitations = mongoose.model("Invitation", userInvitationsSchema);

export default UserInvitations;
