import { RequestMethod } from "@src/@types";

export const transportsIndexTemplate = `import transports from "./transports";

export default transports;

`;

export const transportsTemplate = `
const transports = { };

export default transports;

`;

export const httpClientTemplate = `import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { Interceptors } from "./transports.types";

export class HttpClient {
  protected readonly instance: AxiosInstance;

  public constructor(baseURL: string, interceptors?: Interceptors) {
    this.instance = axios.create({
      baseURL,
    });
    this.initializeResponseInterceptor(interceptors);
  }

  private initializeResponseInterceptor = (interceptors?: Interceptors) => {
    this.instance.interceptors.response.use(
      interceptors?.handleResponse || this.handleResponse,
      interceptors?.handleError || this.handleError
    );
    this.instance.interceptors.request.use(
      interceptors?.handleRequest || this.handleRequest,
      interceptors?.handleError || this.handleError
    );
  };

  private handleResponse = ({ data }: AxiosResponse) => data;
  private handleRequest = (value: InternalAxiosRequestConfig<any>) => value;

  protected handleError = (error: AxiosError) => {
    return Promise.reject(error);
  };
}

export default HttpClient;

`;
export const interceptorsTemplate = `import { AxiosResponse, AxiosError } from "axios";

type ServerError = { error: string; message: string };

export const defaultInterceptors = {
  handleResponse: (res: AxiosResponse) => res,
  handleError: (error: AxiosError) => {
    const serverResponse = error.response?.data as ServerError;
    console.dir({
      serverError: serverResponse.error,
      serverMessage: serverResponse.message,
      axiosMessage: error.message,
      statusCode: error.response?.status,
      requestUrl: error.response?.config.baseURL+error.response?.config.url,
      requestMethod: error.response?.config.method,
      requestData: error.response?.config.data,
    });
    throw error;
  },
};
`;
export const transportsTypeTemplate = `import { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

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
`;

type RequestTemplateProps = {
  name: string;
  Name: string;
  method: RequestMethod;
  ClientName: string;
  returns?: string;
  requestBody?: string;
};
export const requestTemplate = ({
  name,
  Name,
  method,
  returns,
  ClientName,
  requestBody,
}: RequestTemplateProps) => {
  const bodyAllowed =
    method === "post" || method === "patch" || method === "put";
  const body = bodyAllowed ? ", body" : "";
  return `import ${ClientName}Client from "..";
import { TransportAxiosRequest } from "../../../../base/transports.types";

export async function ${name}(
  this: ${ClientName}Client,
  requestProps: ${Name}Props
) {
  const { param, query${body} } = requestProps;
  try {
    const { data } = await this.instance.${method}<${Name}Return>("/"${body});
    return data;
  } catch (error) {
    console.dir({ error, requestProps });
    throw error;
  }
}

type ${Name}Body = ${requestBody || "{}"}; // define body
type ${Name}Param = {}; // define param
type ${Name}Query = {}; // define query

export type ${Name}Props = TransportAxiosRequest<
  ${Name}Body,
  ${Name}Param,
  ${Name}Query
>;

export type ${Name}Return = Promise<${
    returns || "undefined"
  }>; // define return 
`;
};
