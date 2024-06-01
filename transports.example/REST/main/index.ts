import { Interceptors } from "../../base/transports.types";
import UserClient from "./user";

export default class MainTransport {
  user: UserClient;
  constructor(baseUrl: string, interceptors?: Interceptors) {
    this.user = new UserClient(baseUrl + "/user", interceptors);
  }
}
