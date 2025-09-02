import { model, models, Schema, Types, Document } from "mongoose";

export interface IInteraction {
  user: Types.ObjectId; // Reference to User ID
  action: string; // e.g., 'like', 'dislike', etc.
  actionId: Types.ObjectId; // Reference to the entity being interacted with (e.g., Question, Answer)
  actionType: "question" | "answer"; // Type of entity being interacted with (e.g., 'Question', 'Answer')
}

export const InteractionActionEnums = [
  "view",
  "upvote",
  "downvote",
  "bookmark",
  "post",
  "edit",
  "delete",
  "search",
] as const;

export interface IInteractionDocument extends IInteraction, Document {}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: InteractionActionEnums, required: true }, // e.g., 'like', 'dislike', etc.
    actionId: { type: Schema.Types.ObjectId, required: true }, // Reference to the entity being interacted with (e.g., Question, Answer)
    actionType: { type: String, enum: ["question", "answer"], required: true }, // Type of entity being interacted with
  },
  { timestamps: true }
);

const Interaction =
  models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
