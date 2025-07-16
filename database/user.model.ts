import { model, models, Schema } from "mongoose";

//frontend
export interface IUser {
  name: string;
  email: string;
  username: string;
  password: string;
  bio?: string;
  image: string;
  location?: string;
  portifolio?: string;
  reputation?: number;
}

//backend
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String },
    image: { type: String, required: true },
    location: { type: String },
    portifolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = models?.user || model<IUser>("User", userSchema);
export default User;
