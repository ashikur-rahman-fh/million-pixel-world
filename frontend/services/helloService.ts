import { api } from "@/lib/api/axiosInstance";

export interface HelloResponse {
  message: string;
  status: string;
  code: number;
}

export const helloService = {
  hello: async (): Promise<HelloResponse> => {
    const response = await api.get<HelloResponse>("/api/hello/");

    return response.data;
  },
};
