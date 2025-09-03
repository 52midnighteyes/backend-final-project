import express from "express";
import helmet from "helmet";
import cors from "cors";
import { FE_URL } from "./configs/config";
import { Response, Request, NextFunction } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";

const app = express();

const corsOrigin = FE_URL || process.env.CORS_ORIGIN || "http://localhost:3000";

app.use(express.json());
app.use(
  cors({
    origin: corsOrigin,
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

app.use(errorHandler);

export default app;
