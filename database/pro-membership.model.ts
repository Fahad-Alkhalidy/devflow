import { Schema, model, models, Types, Document } from "mongoose";

export interface IProMembership {
  userId: Types.ObjectId; // Reference to User ID
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripePriceId: string;
  status: "active" | "canceled" | "past_due" | "unpaid" | "incomplete";
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  planType: "monthly" | "yearly";
  amount: number; // Amount in cents
  currency: string;
}

export interface IProMembershipDocument extends IProMembership, Document {}

const ProMembershipSchema = new Schema(
  {
    user: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      unique: true 
    },
    stripeCustomerId: { 
      type: String, 
      required: true 
    },
    stripeSubscriptionId: { 
      type: String, 
      required: false 
    },
    stripePriceId: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ["active", "canceled", "past_due", "unpaid", "incomplete"],
      required: true 
    },
    currentPeriodStart: { 
      type: Date, 
      required: true 
    },
    currentPeriodEnd: { 
      type: Date, 
      required: true 
    },
    cancelAtPeriodEnd: { 
      type: Boolean, 
      default: false 
    },
    planType: { 
      type: String, 
      enum: ["monthly", "yearly"],
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    currency: { 
      type: String, 
      default: "usd" 
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
// Note: user field already has unique: true which creates an index automatically
ProMembershipSchema.index({ stripeCustomerId: 1 });
ProMembershipSchema.index({ status: 1 });

const ProMembership = models?.ProMembership || model<IProMembership>("ProMembership", ProMembershipSchema);
export default ProMembership;
