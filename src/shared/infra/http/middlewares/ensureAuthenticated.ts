import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

import auth from "../../../../config/auth";
import { UsersRepository } from "../../../../modules/accounts/infra/typeorm/repositories/UsersRepository";

import { AppError } from "../../../errors/AppError";

interface IPayload {
  sub?: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não encontrado!", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, auth.secret_token) as IPayload;

    const usersRepository = new UsersRepository();
    const user = usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("O usuário não existe!", 401);
    }

    next();
  } catch (error) {
    throw new AppError("Token inválido!", 401);
  }
}
