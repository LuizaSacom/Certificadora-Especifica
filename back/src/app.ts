import express from "express";
import mongoose from "mongoose";
import { environments } from "./constants/environments";
import { userRoutes } from "./presentation/routes/UserRoutes";
import { login } from "./presentation/controllers/AuthController";

const app = express();

mongoose
  .connect(environments.MONGO_URL)
  .then(() => {
    console.log("Conectado ao MongoDB!");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
  });

app.use(express.json());
app.use("/users", userRoutes);
app.post("/login", login);

app.listen(environments.PORT, () => {
  console.log(`Example app listening on port ${environments.PORT}`);
});
