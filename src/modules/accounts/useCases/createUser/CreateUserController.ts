import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateUserUseCase } from "./CreateUserUseCase";

class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, avatar } = request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const userCreated = await createUserUseCase.execute({
      name,
      email,
      password,
      avatar,
    });

    const userCreatedReturn = {
      id: userCreated.id,
      name: userCreated.name,
      email: userCreated.email,
      avatar: userCreated.avatar,
      created_at: userCreated.created_at,
    };

    return response.status(201).json(userCreatedReturn);
  }
}

export { CreateUserController };
