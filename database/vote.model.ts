import { auth } from "@/auth";
import { model, models, Schema, Types } from "mongoose";

export interface IVote {
  author: Types.ObjectId; // Reference to User ID
  id: Types.ObjectId; // Reference to Question or Answer ID
  type: "Question" | "Answer"; // Type of the entity being voted on
  voteType: "upvote" | "downvote"; // Type of the vote
}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: {
      type: Schema.Types.ObjectId,
      refPath: "type", // Dynamically reference Question or Answer based on type
      required: true,
    },
    type: { type: String, enum: ["Question", "Answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  { timestamps: true }
);

const Vote = models?.vote || model<IVote>("Vote", VoteSchema);

export default Vote;
