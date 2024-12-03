import { Schema } from "mongoose";
import { activeHistorySchema } from "./ActiveHistoryModel";

export enum ActiveTypeSchema {
  LCA = "LCA",
  LCI = "LCI",
  LF = "LF",
  CDB = "CDB",
  FII = "FII",
  TREASURY = "TREASURY",
  OTHER = "OTHER",
}

export const activeSchema = new Schema(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    shares: {
      type: Number,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
    variation: {
      type: Number,
      required: true,
    },
    value_per_share: {
      type: Number,
      required: true,
    },
    history: [activeHistorySchema],
  },
  { timestamps: true }
);
