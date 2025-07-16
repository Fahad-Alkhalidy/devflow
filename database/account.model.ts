import { model, models, Schema, Types } from "mongoose";

interface IAccount {
  userId: Types.ObjectId; // Reference to User ID
  name: string;
  password?: string; // Optional for OAuth accounts
  image?: string;
  provider: string; // e.g., 'email', 'google', 'github'
  providerAccountId: string; // Unique ID from the auth provider
}

const AccountSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    password: { type: String }, // Optional for OAuth accounts
    image: { type: String },
    provider: { type: String, required: true }, // e.g., 'email', 'google', 'github'
    providerAccountId: { type: String, required: true }, // Unique ID from the auth provider
  },
  { timestamps: true }
);

const Account = models?.account || model<IAccount>("Account", AccountSchema);
export default Account;
