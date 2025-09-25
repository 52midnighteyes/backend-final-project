import express from "express";
import helmet from "helmet";
import cors from "cors";
import { FE_URL } from "./configs/config";
import { Response, Request, NextFunction } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";

import AuthRouter from "./routers/auth.router";
import propertiesRouter from "./routers/properties-routers";
import UserRouter from "./routers/user.router";

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

app.use("/api/auth", AuthRouter);
app.use("/api/properties", propertiesRouter);
app.use("/api/user", UserRouter);

//ErrorHandler

app.use(errorHandler);

export default app;
