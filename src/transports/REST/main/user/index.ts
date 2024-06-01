import { defaultInterceptors } from "../../../base/interceptors";
import HttpClient from "../../../base/HttpClient";
import { Interceptors } from "../../../base/transports.types";

export default class UserClient extends HttpClient {
  constructor(baseUrl: string, interceptors?: Interceptors) {
    super(baseUrl, interceptors || defaultInterceptors);
  }
}
