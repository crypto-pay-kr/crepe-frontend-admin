import { API } from ".";

interface LoginRequest {
  loginId: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
}

export const loginApi = async (body: LoginRequest): Promise<LoginResponse> => {
  const response = await API.post("/user/login", body);
  return response.data;
};