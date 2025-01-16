import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null
    }
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1 });
ConversationSchema.index({ updatedAt: -1 });

const Conversation = mongoose.model("Conversation", ConversationSchema);
export default Conversation;