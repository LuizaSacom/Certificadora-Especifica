import { Request, Response } from "express";
import { UserModel } from "../../infra/libs/mongoose/models/UserModel";
import { Types, Schema } from "mongoose";
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

export const summary = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await UserModel.findOne({ username: req.headers.username });
    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    res.status(200).json(user.toJSON().actives);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

export const deleteActive = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params?.["id"];

    if (!id) {
      res.status(400).json({
        error: "Id é  obrigatório para deletar a atividade.",
      });

      return;
    }

    const user = await UserModel.findOne({ username: req.headers.username });
    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    const activeIndex = user.actives.findIndex(
      (active) => active._id?.toString() === id
    );
    if (activeIndex === -1) {
      res.status(404).json({ error: "Ativo não encontrado." });
      return;
    }

    user.actives.splice(activeIndex, 1);
    user.markModified("actives");
    await user.save();

    res.status(200).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

export const updateActive = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params?.["id"];
    const { type, title, shares, value_per_share } = req.body;

    const user = await UserModel.findOne({ username: req.headers.username });
    if (!user) {
      res.status(401).json({ error: "Usuário não encontrado." });
      return;
    }

    if (!id) {
      res
        .status(400)
        .json({ error: "Id é obrigatório para atualizar o ativo." });
      return;
    }

    const activeIndex = user.actives.findIndex((active) => {
      return active?._id?.toString() === id;
    });

    if (activeIndex === -1) {
      res.status(404).json({ error: "Ativo não encontrado." });
      return;
    }

    user.actives[activeIndex].title = title;
    user.actives[activeIndex].type = getActiveTypeByString(type);
    user.actives[activeIndex].shares = shares;
    user.actives[activeIndex].balance = shares * value_per_share;
    user.actives[activeIndex].value_per_share = value_per_share;

    await user.save();
    user.markModified("actives");
    res.status(200).json(user.actives[activeIndex]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};

export const createActive = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { type, title, shares, value_per_share } = req.body;

    if (!type || !title || !shares || !value_per_share) {
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
      _id: new Types.ObjectId().toString(),
      type: getActiveTypeByString(type),
      title: title as string,
      shares: shares as number,
      balance: shares * value_per_share,
      variation: 0,
      value_per_share: value_per_share as number,
      history: [] as Array<ActiveHistorySchema>,
    };

    user.actives.push(newActive);
    user.markModified("actives");
    await user.save();

    res.status(201).json(newActive);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro no servidor." });
  }
};
