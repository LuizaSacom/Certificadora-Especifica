import { Schema, Types } from "mongoose";
import { ActiveHistorySchema, activeHistorySchema } from "./ActiveHistoryModel";

export enum ActiveTypeSchema {
  FFI = "FFI",
  EFT = "EFT",
  OTHER = "OTHER",
  ACTION = "ACTION",
  CRIPTO = "CRIPTO",
  FIXED_INCOME = "FIXED_INCOME",
}

export type ActiveSchema = {
  _id?: string;
  type: ActiveTypeSchema;
  title: string;
  shares: number;
  balance: number;
  variation: number;
  value_per_share: number;
  history: ActiveHistorySchema[];
};

export const activeSchema = new Schema<ActiveSchema>(
  {
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
    history: {
      type: [activeHistorySchema],
      default: [],
      required: true,
    },
  },
  { timestamps: true }
);
