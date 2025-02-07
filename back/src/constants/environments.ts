import * as dotenv from "dotenv";
dotenv.config();

export const environments = {
  PORT: `${process.env.PORT}`,
  DB_NAME: `${process.env.DB_NAME ?? "teste"}`,
  MONGO_URL: `${process.env.MONGO_URL}`,
  JWT_SECRET: `${process.env.JWT_SECRET}`,
  NODEMAILER_USER: `${process.env.NODEMAILER_USER}`,
  NODEMAILER_PASSWORD: `${process.env.NODEMAILER_PASSWORD}`,
};
