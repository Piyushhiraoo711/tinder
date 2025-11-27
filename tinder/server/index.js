import express from "express";
import dotenv from "dotenv";
import { ConnectDB } from "./database/connectdb.js";
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  ConnectDB();
  console.log(`Server is listenng on ${PORT}`);
});
