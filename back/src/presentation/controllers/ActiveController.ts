import { Request, Response } from "express";
import { UserModel } from "../../infra/libs/mongoose/models/UserModel";
import { generetaToken } from "../../utils/JwtUtil";
import { Document, ObjectId, Schema } from "mongoose";
import {
  ActiveSchema,
  ActiveTypeSchema,
} from "../../infra/libs/mongoose/models/ActiveModel";
import { ActiveHistorySchema } from "../../infra/libs/mongoose/models/ActiveHistoryModel";

const getActiveTypeByString = (type: string): ActiveTypeSchema => {
  switch (type.toUpperCase()) {
    case "FFI":
      return ActiveTypeSchema.FFI;
    case "EFT":
      return ActiveTypeSchema.EFT;
    case "ACTION":
      return ActiveTypeSchema.ACTION;
    case "CRIPTO":
      return ActiveTypeSchema.CRIPTO;
    case "FIXED_INCOME":
      return ActiveTypeSchema.FIXED_INCOME;
    case "OTHER":
    default:
      return ActiveTypeSchema.OTHER;
  }
};

export const registerActive = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id, type, title, shares, value_per_share } = req.body;

    if (!type || !title || !shares || value_per_share) {
      res.status(400).json({
        error: "Título, tipo, cotas e valor por cota são obrigatórios.",
      });
      return;
    }

    const user = await UserModel.findOne({ username: req.headers.username });
    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    const newActive = {
      id: new Schema.Types.ObjectId(""),
      type: getActiveTypeByString(type),
      title: title as string,
      shares: shares as number,
      balance: shares * value_per_share,
      variation: 0,
      value_per_share: value_per_share as number,
      history: [] as Array<ActiveHistorySchema>,
    };

    user.actives.push(newActive);

    res.status(201).json(newActive);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};
