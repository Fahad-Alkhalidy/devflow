import { model, models, Schema, Types, Document } from "mongoose";

export interface ITag {
  name: string;
  question: number;
}

export interface ITagDocument extends ITag, Document {}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String, required: true },
    question: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Tag = models?.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
