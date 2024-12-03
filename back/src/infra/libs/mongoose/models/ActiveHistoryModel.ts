import { Schema } from "mongoose";

export const activeHistorySchema = new Schema({
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
