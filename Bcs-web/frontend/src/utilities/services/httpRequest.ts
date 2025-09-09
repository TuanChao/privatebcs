import { AxiosInstance } from "axios";
import { axiosInstance, IConfig } from "./initRequest";

class HttpRequest {
  api: AxiosInstance;

  constructor() {
    this.api = axiosInstance;
  }

  async get<T>(url: string, config?: IConfig): Promise<T> {
    return this.api.get(url, config);
  }

  async delete<T>(url: string, params: any = {}): Promise<T> {
    return this.api.delete(url, params);
  }

  async post<T>(url: string, params: any = {}, config?: IConfig): Promise<T> {
    return this.api.post(url, params, config);
  }

  async put<T>(url: string, params: any = {}): Promise<T> {
    return this.api.put(url, params);
  }

  async patch<T>(url: string, params: any = {}, config?: IConfig): Promise<T> {
    return this.api.patch(url, params, config);
  }
}

const httpRequest = new HttpRequest();

export default httpRequest;
