import { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

export type TransportAxiosRequest<Body, Param, Query> = OptionalBody<Body> &
  OptionalParam<Param> &
  OptionalQuery<Query>;

type OptionalParam<Param> = Param extends undefined | null
  ? { param?: undefined }
  : keyof Param extends never
  ? { param?: undefined }
  : { param: Param };
type OptionalQuery<Query> = Query extends undefined | null
  ? { query?: undefined }
  : keyof Query extends never
  ? { query?: undefined }
  : { query: Query };
type OptionalBody<Body> = Body extends undefined | null
  ? { body?: undefined }
  : keyof Body extends never
  ? { body?: undefined }
  : { body: Body };

export interface Interceptors {
  handleResponse?: ({ data }: AxiosResponse) => any;
  handleRequest?: (
    value: InternalAxiosRequestConfig<any>
  ) =>
    | InternalAxiosRequestConfig<any>
    | Promise<InternalAxiosRequestConfig<any>>;
  handleError?: (error: AxiosError) => any;
}
