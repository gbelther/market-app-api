import { ICreateUserTokenDTO } from "../../../../dtos/ICreateUserTokenDTO";
import { IUsersTokensRepository } from "../../../../repositories/IUsersTokensRepository";
import { UserTokens } from "../../entities/UserTokens";

class UsersTokensRepositoryInMemory implements IUsersTokensRepository {
  usersTokens: UserTokens[] = [];

  async create({
    user_id,
    refresh_token,
    expires_date,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const userToken = new UserTokens();

    Object.assign(userToken, {
      user_id,
      refresh_token,
      expires_date,
    });

    this.usersTokens.push(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    return this.usersTokens.find(
      (userToken) =>
        userToken.user_id === user_id &&
        userToken.refresh_token === refresh_token
    );
  }

  async deleteById(id: string): Promise<void> {
    this.usersTokens = this.usersTokens.filter(
      (userToken) => userToken.id === id
    );
  }
}

export { UsersTokensRepositoryInMemory };
