import express from "express";
import dotenv from "dotenv";
import { ConnectDB } from "./database/connectdb.js";
import { requestRoute, userRoutes } from "./routes/index.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/request", requestRoute)

app.listen(PORT, () => {
  ConnectDB();
  console.log(`Server is listenng on ${PORT}`);
});
