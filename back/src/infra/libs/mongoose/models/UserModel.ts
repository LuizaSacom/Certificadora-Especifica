import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { environments } from "../../../../constants/environments";
import { activeSchema } from "./ActiveModel";

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
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
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

export const AccessKeyModel = mongoose.connection
  .useDb(environments.DATABASE)
  .model<UserSchema>("user", userSchema);
