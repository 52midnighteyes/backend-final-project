import express from "express";
import helmet from "helmet";
import cors from "cors";
import { FE_URL } from "./configs/config";
import { Response, Request, NextFunction } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";

import AddOnRouter from "./routers/add-ons.router";
import TransactionRouter from "./routers/transactions.router";
import AuthRouter from "./routers/auth.router";

const app = express();

const corsOrigin = FE_URL;

app.use(express.json());
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);
app.use(helmet());

app.use((req, res, next) => {
  console.log("===== Incoming Request =====");
  console.log("Time     :", new Date().toISOString());
  console.log("Method   :", req.method);
  console.log("URL      :", req.originalUrl);
  console.log("Headers  :", req.headers);
  console.log("Body     :", req.body);
  console.log("Query    :", req.query);
  console.log("============================\n");

  next();
});

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
