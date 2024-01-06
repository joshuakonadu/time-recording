import mongoose from "mongoose";
//Note: get inviation -> {workspaceId, }
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
