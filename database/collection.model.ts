import { model, models, Schema, Types, Document } from "mongoose";

export interface ICollection {
  author: Types.ObjectId; // Reference to User ID
  question: Types.ObjectId; // Reference to Question ID
}

export interface ICollectionDocument extends ICollection, Document {}

const CollectionSchema = new Schema<ICollection>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true }
);

const Collection =
  models?.collection || model<ICollection>("Collection", CollectionSchema);

export default Collection;
