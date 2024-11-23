import mongoose, { Document, ObjectId, Schema } from "mongoose";
import { environments } from "../../../../constants/environments";

export enum ActiveTypeSchema {
  LCA = "LCA",
  LCI = "LCI",
  LF = "LF",
  CDB = "CDB",
  FII = "FII",
  TREASURY = "TREASURY",
  OTHER = "OTHER",
}

export type ActiveHistorySchema = {
  id: ObjectId;
  value: number;
  variation: number;
  incomeDate: Date;
};

export type ActiveSchema = {
  id: ObjectId;
  type: ActiveTypeSchema;
  title: string;
  shares: number;
  balance: number;
  variation: number;
  value_per_share: number;
};

const activeHistorySchema = new Schema({
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
