import UserClient from "./user";
import { Interceptors } from "../../base/transports.types";

export default class MainTransport {
  constructor(baseUrl: string, interceptors?: Interceptors) {
    this.user = new UserClient(baseUrl + "/user", interceptors); // make sure the endpoint is correct
  }
  user: UserClient;
}
