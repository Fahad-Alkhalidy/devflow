import { model, models, Schema, Document } from "mongoose";

//frontend
export interface IUser {
  name: string;
  email: string;
  username: string;
  bio?: string;
  image: string;
  location?: string;
  portifolio?: string;
  reputation?: number;
}

export interface IUserDocument extends IUser, Document {}

//backend
const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    bio: { type: String },
    image: { type: String, required: true },
    location: { type: String },
    portifolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = models?.user || model<IUser>("User", UserSchema);
export default User;
