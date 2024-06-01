import axios, {
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

