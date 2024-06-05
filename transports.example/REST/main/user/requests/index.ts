import { createUser, CreateUserProps, CreateUserReturn } from "./createUser";

export const userRequests = { createUser };

export namespace UserRequestsProps {
  export type CreateUser = CreateUserProps;
}

export namespace UserRequestsReturn {
  export type CreateUser = CreateUserReturn;
}
