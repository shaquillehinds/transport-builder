import { createUser, CreateUserProps } from "./createUser";

export const userRequests = { createUser };

export namespace UserRequestsProps {
  export type CreateUser = CreateUserProps;
}
