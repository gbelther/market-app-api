import { Request, Response } from "express";
import { container } from "tsyringe";

import { RefreshTokenUseCase } from "./RefreshTokenUseCase";

class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const refreshToken = request.body.token;

    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);

    const refresh_token = await refreshTokenUseCase.execute(refreshToken);

    return response.json(refresh_token);
  }
}

export { RefreshTokenController };
