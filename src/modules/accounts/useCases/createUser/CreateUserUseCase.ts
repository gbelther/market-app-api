import { inject, injectable } from "tsyringe";
import { hash } from "bcrypt";

import { AppError } from "../../../../shared/errors/AppError";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { User } from "../../infra/typeorm/entities/User";

import { IUsersRepository } from "../../repositories/IUsersRepository";

@injectable()
class CreateUserUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) {}

  async execute({
    name,
    email,
    password,
    avatar,
  }: ICreateUserDTO): Promise<User> {
    const emailIsInUse = await this.usersRepository.findByEmail(email);

    if (emailIsInUse) {
      throw new AppError(`O email ${email} já está em uso!`);
    }

    const passwordHash = await hash(password, 8);

    return await this.usersRepository.create({
      name,
      email,
      password: passwordHash,
      avatar,
    });
  }
}

export { CreateUserUseCase };
