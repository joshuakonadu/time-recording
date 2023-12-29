import mongoose from "mongoose";

const workspaceSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
    },
    members: {
      type: Array,
      default: [],
    },
    projectOption: {
      type: Array,
      default: [],
    },
    roleOption: {
      type: Array,
      default: [],
    },
    mode: {
      type: String,
      default: "24h",
    },
  },
  {
    timestamps: true,
  }
);

const Workspace = mongoose.model("Workspace", workspaceSchema);

export default Workspace;
export const workspaceById = (id) => Workspace.findById(id);
export const createWorkspace = (data) => Workspace.create(data);
export const workspaceAddMember = async (id, member) => {
  const workspace = await Workspace.findById(id);
  workspace.members.push(member);
  return workspace.save();
};
export const workspaceRemoveMember = async (userId, workspaceId) => {
  const workspace = await Workspace.findById(workspaceId);
  workspace.members = workspace.members.filters(
    (user) => user.userId !== userId
  );
  if (workspace.members.length) {
    return workspace.save();
  }
  return Workspace.deleteOne({ _id: workspaceId });
};
