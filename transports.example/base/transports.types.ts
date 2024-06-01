import { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

export type TransportAxiosRequest<Body, Param, Query> = OptionalBody<Body> &
  OptionalParam<Param> &
  OptionalQuery<Query>;

type OptionalParam<Param> = Param extends undefined | null
  ? {}
  : { param: Param };
type OptionalQuery<Query> = Query extends undefined | null
  ? {}
  : { query: Query };
type OptionalBody<Body> = Body extends undefined | null ? {} : { body: Body };

export interface Interceptors {
  handleResponse?: ({ data }: AxiosResponse) => any;
  handleRequest?: (
    value: InternalAxiosRequestConfig<any>
  ) =>
    | InternalAxiosRequestConfig<any>
    | Promise<InternalAxiosRequestConfig<any>>;
  handleError?: (error: AxiosError) => any;
}
