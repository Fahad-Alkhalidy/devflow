import { model, models, Schema, Types, Document } from "mongoose";

export interface IVote {
  author: Types.ObjectId; // Reference to User ID
  actionId: Types.ObjectId; // Reference to Question or Answer ID
  actionType: "Question" | "Answer"; // Type of the entity being voted on
  voteType: "upvote" | "downvote"; // Type of the vote
}

export interface IVoteDocument extends IVote, Document {}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionId: {
      type: Schema.Types.ObjectId,
      refPath: "type", // Dynamically reference Question or Answer based on type
      required: true,
    },
    actionType: { type: String, enum: ["Question", "Answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  { timestamps: true }
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
