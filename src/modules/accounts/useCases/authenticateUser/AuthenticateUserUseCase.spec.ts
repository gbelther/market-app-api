import { AppError } from "../../../../shared/errors/AppError";
import { DateProvider } from "../../../../shared/providers/DateProvider/DateProvider";
import { ICreateUserDTO } from "../../dtos/ICreateUserDTO";
import { UsersRepositoryInMemory } from "../../infra/typeorm/repositories/in-memory/UsersRepositoryInMemory";
import { UsersTokensRepositoryInMemory } from "../../infra/typeorm/repositories/in-memory/UsersTokensRepositoryInMemory";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let authenticateUserUseCase: AuthenticateUserUseCase;
let dateProvider: DateProvider;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dateProvider = new DateProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dateProvider
    );
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user", async () => {
    const user: ICreateUserDTO = {
      name: "Nome teste1",
      email: "emailteste1@email.com",
      password: "passwordteste1",
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const authProperties = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    });

    expect(authProperties).toHaveProperty("token");
    expect(authProperties).toHaveProperty("refresh_token");
  });

  it("should not be able to authenticate a user nonexisting", async () => {
    const user: ICreateUserDTO = {
      name: "Nome teste1",
      email: "emailteste1@email.com",
      password: "passwordteste1",
    };

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: user.password,
      })
    ).rejects.toEqual(new AppError("Email ou senha inválidas!"));
  });

  it("should not be able to authenticate a user with incorrect password", async () => {
    const user: ICreateUserDTO = {
      name: "Nome teste1",
      email: "emailteste1@email.com",
      password: "passwordteste1",
    };

    await createUserUseCase.execute({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    await expect(
      authenticateUserUseCase.execute({
        email: user.email,
        password: "passwordtesteincorrect",
      })
    ).rejects.toEqual(new AppError("Email ou senha inválidas!"));
  });
});
