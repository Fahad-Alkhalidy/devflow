import { model, models, Schema, Types } from "mongoose";

export interface IInteraction {
  user: Types.ObjectId; // Reference to User ID
  action: string; // e.g., 'like', 'dislike', etc.
  actionId: Types.ObjectId; // Reference to the entity being interacted with (e.g., Question, Answer)
  actionType: "Question" | "Answer"; // Type of entity being interacted with (e.g., 'Question', 'Answer')
}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true }, // e.g., 'like', 'dislike', etc.
    actionId: { type: Schema.Types.ObjectId, required: true }, // Reference to the entity being interacted with (e.g., Question, Answer)
    actionType: { type: String, enum: ["Question", "Answer"], required: true }, // Type of entity being interacted with
  },
  { timestamps: true }
);

const Interaction =
  models?.interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
