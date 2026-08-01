import { api } from "@/lib/api";
import { ApiSuccessResponse } from "@/types/api.types";
import { AuthTokens, LoginInput, RegisterInput } from "@/types/auth.types";
import { User } from "@/types/user.types";

export const authService = {
  async register(input: RegisterInput): Promise<AuthTokens> {
    const { data } = await api.post<ApiSuccessResponse<AuthTokens>>("/auth/register", input);
    return data.data;
  },

  async login(input: LoginInput): Promise<AuthTokens> {
    const { data } = await api.post<ApiSuccessResponse<AuthTokens>>("/auth/login", input);
    return data.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async getMe(): Promise<User> {
    const { data } = await api.get<ApiSuccessResponse<User>>("/users/me");
    return data.data;
  },
};
