import { Schema, model, models, Types } from "mongoose";

interface IQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[]; // Optional tags for categorization
  views: number;
  answers: number; // Optional reference to answers
  upVotes: number;
  downVotes: number;
  authorId: Types.ObjectId; // Reference to User ID
}

const QuestionSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  {
    timestamps: true,
  }
);

const Question =
  models?.question || model<IQuestion>("Question", QuestionSchema);
export default Question;
