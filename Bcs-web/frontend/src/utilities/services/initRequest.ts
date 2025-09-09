import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export enum ENV {
  LOCAL = "local",
  DEVELOPMENT = "development",
  PRODUCTION = "production",
}

export type IConfig = AxiosRequestConfig;

type IAxiosResponse = AxiosError<any> & {
  config: {
    showSpin?: boolean;
  };
};

export const endpointApi = process.env.REACT_APP_API_URL;

const requestConfig: IConfig = {
  baseURL: endpointApi,
  headers: {
    "content-type": "application/json",
  },
};

export const axiosInstance = axios.create(requestConfig);

export default function initRequest() {
  axiosInstance.interceptors.request.use(
    (config: any) => {
      return config;
    },
    (error: IAxiosResponse) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response: AxiosResponse): Promise<any> => {
      const { data } = response;

      return data;
    },
    (error: IAxiosResponse) => {
      // handle errors
      switch (error.response?.status) {
        case 401: {
          break;
        }
        case 403: {
          break;
        }
        case 500: {
          break;
        }
        case 404: {
          window.location.href = "/404";
          break;
        }
        default:
          break;
      }

      return Promise.reject(error.response?.data);
    }
  );
}
