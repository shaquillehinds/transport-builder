import UserClient from "..";
import { TransportAxiosRequest } from "../../../../base/transports.types";

type CreateUserDto = {
  name: string;
  email: string;
  values?: string[];
  phone_number?: string;
  introduction?: string;
  time_zone?: string;
  primary_job?: string;
  side_hustle?: string;
  weekly_goal?: string;
  onBoarded?: boolean;
  planAccepted?: boolean;
};

export type CreateUserProps = TransportAxiosRequest<
  CreateUserDto,
  undefined,
  undefined
>;

export async function createUser<RequestReturn>(
  this: UserClient,
  requestProps: CreateUserProps
) {
  const { body } = requestProps;
  try {
    const { data } = await this.instance.post<RequestReturn>("/", body);
    return data;
  } catch (error) {
    console.dir({ error, requestProps });
  }
}
