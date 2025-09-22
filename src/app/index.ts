import express from "express";
import helmet from "helmet";
import cors from "cors";
import { Response, Request, NextFunction } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import dotenv from "dotenv";

dotenv.config();

import AddOnRouter from "./routers/add-ons-routers";
import AuthRouter from "./routers/auth.router";
import propertiesRouter from "./routers/properties-routers";



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
app.use("/api/auth", AuthRouter);
app.use("/api/properties", propertiesRouter);

//ErrorHandler

app.use(errorHandler);

export default app;
