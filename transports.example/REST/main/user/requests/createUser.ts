import UserClient from "..";
import { TransportAxiosRequest } from "../../../../base/transports.types";

export async function createUser(
  this: UserClient,
  requestProps: CreateUserProps
) {
  const { body, param, query } = requestProps;
  try {
    const { data } = await this.instance.post<CreateUserReturn>("/", body);
    return data;
  } catch (error) {
    console.dir({ error, requestProps });
  }
}

type CreateUserDto = {};
type CreateUserParam = {};
type CreateuUserQuery = {};

export type CreateUserProps = TransportAxiosRequest<
  CreateUserDto,
  CreateUserParam,
  CreateuUserQuery
>;

export type CreateUserReturn = Promise<undefined>;
