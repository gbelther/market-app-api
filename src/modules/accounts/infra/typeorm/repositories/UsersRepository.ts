import { getRepository, Repository } from "typeorm";

import { ICreateUserDTO } from "../../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../../repositories/IUsersRepository";
import { User } from "../entities/User";

class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async create({
    name,
    email,
    password,
    avatar,
  }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({
      name,
      email,
      password,
      avatar,
    });

    return await this.repository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.repository.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    return await this.repository.findOne(id);
  }
}

export { UsersRepository };
