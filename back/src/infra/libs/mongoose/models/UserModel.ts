import { activeSchema } from "./ActiveModel";
import mongoose, { Document, ObjectId, Schema } from "mongoose";

export type UserSchema = {
  id: ObjectId;
  username: string;
  password: string;
  salt: string;
  createdAt: string;
  updatedAt: string;
} & Document;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    actives: [activeSchema],
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform(__: any, ret: any) {
    ret.id = ret._id;
    delete ret.__v;
    delete ret._id;
  },
});

export const UserModel = mongoose.connection.model<UserSchema>(
  "user",
  userSchema
);
