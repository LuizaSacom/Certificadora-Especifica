import * as dotenv from "dotenv";
dotenv.config();

export const environments = {
  PORT: `${process.env.PORT}`,
  DATABASE: `${process.env.DATABASE}`,
  MONGO_URL: `${process.env.MONGO_URL}`,
};
