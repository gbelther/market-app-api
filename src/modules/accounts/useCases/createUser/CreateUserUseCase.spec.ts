import { AppError } from "../../../../shared/errors/AppError";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "../../infra/typeorm/repositories/in-memory/UsersRepositoryInMemory";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async () => {
    const user: ICreateUserDTO = {
      name: "Usuario Teste1",
      email: "usuarioteste1@email.com",
      password: "usuarioteste1senha",
    };

    const userCreated = await usersRepositoryInMemory.create({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    expect(userCreated).toHaveProperty("id");
  });

  it("should not be able to create a new user with an email in use", async () => {
    const user1: ICreateUserDTO = {
      name: "Usuario Teste1",
      email: "usuarioteste1@email.com",
      password: "usuarioteste1senha",
    };

    const user2: ICreateUserDTO = {
      name: "Usuario Teste2",
      email: user1.email,
      password: "usuarioteste2senha",
    };

    await createUserUseCase.execute({
      name: user1.name,
      email: user1.email,
      password: user1.password,
    });

    await expect(
      createUserUseCase.execute({
        name: user2.name,
        email: user2.email,
        password: user2.password,
      })
    ).rejects.toEqual(new AppError(`O email ${user2.email} já está em uso!`));
  });
});
