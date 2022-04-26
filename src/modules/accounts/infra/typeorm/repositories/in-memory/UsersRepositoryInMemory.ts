import { ICreateUserDTO } from "../../../../dtos/ICreateUserDTO";
import { IUsersRepository } from "../../../../repositories/IUsersRepository";
import { User } from "../../entities/User";

class UsersRepositoryInMemory implements IUsersRepository {
  users: User[] = [];

  async create({
    name,
    email,
    password,
    avatar,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, {
      name,
      email,
      password,
      avatar,
    });

    this.users.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User> {
    return this.users.find((user) => user.email === email);
  }

  async findById(id: string): Promise<User> {
    return this.users.find((user) => user.id === id);
  }
}

export { UsersRepositoryInMemory };
