import { Schema } from "mongoose";

export type ActiveHistorySchema = {
  _id?: string;

  value: number;
  variation: number;
  incomeDate: Date;
};

export const activeHistorySchema = new Schema<ActiveHistorySchema>({
  value: {
    type: Number,
    required: true,
  },
  variation: {
    type: Number,
    required: true,
  },
  incomeDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
