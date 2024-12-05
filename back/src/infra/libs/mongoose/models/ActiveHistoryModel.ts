import { Document, Schema } from "mongoose";

export type ActiveHistorySchema = {
  id: Schema.Types.ObjectId;
  value: number;
  variation: number;
  incomeDate: Date;
};

export const activeHistorySchema = new Schema<ActiveHistorySchema>({
  id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
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
