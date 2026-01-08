import mongoose, { Schema, Document, models } from "mongoose";
import {Message,MessageSchema} from "./Message";

// export type ProviderType = "credentials" | "google" | "linkedin";

export interface User extends Document {
    username: string;
    email: string;
    password?: string;
    verifyCode?: string;
    verifyCodeExpiry?: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
    provider: "credentials" | "google" | "linkedin";
    role:string

}


const Userschema: Schema<User> = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email"],
    },

    password: {
      type: String,
      required: function () {
        return this.provider === "credentials";
      },
    },

    verifyCode: {
      type: String,
      required: false,
    },

    verifyCodeExpiry: {
      type: Date,
      required: false,
    },

    provider: {
      type: String,
      enum: ["credentials", "google", "linkedin", "facebook"],
      required: true,
      default: "credentials",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isAcceptingMessage: {
      type: Boolean,
      default: true,
    },

    messages: {
      type: [MessageSchema],
      default: [],
    },

    role:{
      type:String,
      default:'user'
    }
  },
  { timestamps: true }
);



export default mongoose.models?.User ?? mongoose.model<User>('User', Userschema);