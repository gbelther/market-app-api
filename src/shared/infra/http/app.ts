import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import "express-async-errors";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from "jsonwebtoken";

import "../../../shared/container";
import createConnection from "../../../shared/infra/typeorm";

import { router } from "./routes";
import { AppError } from "../../errors/AppError";

import swaggerFile from "../../../swagger.json";

createConnection();
const app = express();

app.use(express.json());
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use(cors());
app.use(router);

app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    if (error instanceof AppError) {
      return response.status(error.statusCode).json({
        message: error.message,
      });
    }

    if (
      error instanceof NotBeforeError ||
      error instanceof JsonWebTokenError ||
      error instanceof TokenExpiredError
    ) {
      return response.status(401).json({
        status: "error",
        message: "Token inválido",
      });
    }

    return response.status(500).json({
      status: "error",
      message: `Internal server error - ${error.message}`,
    });
  }
);

export { app };
