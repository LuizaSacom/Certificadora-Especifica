import { ActiveSchema, activeSchema } from "./ActiveModel";
import mongoose, { Document, Schema } from "mongoose";

export type UserSchema = {
  id: Schema.Types.ObjectId;
  salt: string;
  actives: ActiveSchema[];
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
} & Document;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    salt: {
      type: String,
      required: true,
    },
    actives: {
      type: [activeSchema],
      default: [],
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.set("toJSON", {
  transform(__: any, ret: any) {
    ret.id = ret._id;
    delete ret.__v;
    delete ret._id;

    ret.active = ret.actives.map((active: any) => {
      active.id = active._id;
      delete active._id;

      active.history = active.history.map((history: any) => {
        history.id = history._id;
        delete history._id;
      });
    });
  },
});

export const UserModel = mongoose.connection.model<UserSchema>(
  "user",
  userSchema
);
