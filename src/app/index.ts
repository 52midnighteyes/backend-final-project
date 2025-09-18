import express from "express";
import helmet from "helmet";
import cors from "cors";
import { FE_URL } from "./configs/config";
import { Response, Request, NextFunction } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import dotenv from "dotenv";

dotenv.config();

import AddOnRouter from "./routers/add-ons.router";
import TransactionRouter from "./routers/transactions.router";
import AuthRouter from "./routers/auth.router";

const app = express();

const corsOrigin = "http://localhost:3000";

app.use(express.json());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(helmet());

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(201).json({
      message: `API is running`,
    });
  } catch (error) {
    next(error);
  }
});

//EndPoint

app.use("/api/add-ons", AddOnRouter);

app.use("/api/transactions", TransactionRouter);
app.use("/api/auth", AuthRouter);

app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

//ErrorHandler

app.use(errorHandler);

export default app;
