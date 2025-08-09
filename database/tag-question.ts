import { model, models, Schema, Types, Document } from "mongoose";

export interface ITagQuestion {
  tag: Types.ObjectId; // Reference to Tag ID
  question: Types.ObjectId; // Reference to Question ID
}

export interface ITagQuestionDocument extends ITagQuestion, Document {}

const TagQuestionSchema = new Schema<ITagQuestion>(
  {
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const TagQuestion =
  models?.TagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema);

export default TagQuestion;
