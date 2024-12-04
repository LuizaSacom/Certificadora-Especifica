import express from "express";
import mongoose from "mongoose";
import { environments } from "./constants/environments";
import { userRoutes } from "./presentation/routes/UserRoutes";

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

app.listen(environments.PORT, () => {
  console.log(`Example app listening on port ${environments.PORT}`);
});
