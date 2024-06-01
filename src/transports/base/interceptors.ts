import { AxiosResponse, AxiosError } from "axios";

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
