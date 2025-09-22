import { Schema, model, models, Types, Document } from "mongoose";

export interface IDoc {
  title: string;
  content: string;
  authorId: Types.ObjectId; // Reference to User ID
  views: number;
  isPublished: boolean;
}

export interface IDocDocument extends IDoc, Document {}

const DocSchema = new Schema(
  {
    title: { 
      type: String, 
      required: true,
      maxlength: 200 
    },
    content: { 
      type: String, 
      required: true 
    },
    author: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    views: { 
      type: Number, 
      default: 0 
    },
    isPublished: { 
      type: Boolean, 
      default: true 
    },
  },
  {
    timestamps: true,
  }
);

// Index for better search performance
DocSchema.index({ title: "text", content: "text" });
DocSchema.index({ author: 1, createdAt: -1 });

const Doc = models?.Doc || model<IDoc>("Doc", DocSchema);
export default Doc;
