import { ApiRequestConfig } from "@/utils/request-api";

type AvatarType = {
  _id: string;
  localPath: string;
  url: string;
};

type UserType = {
  __v: number;
  _id: string;
  avatar: AvatarType;
  createdAt: string;
  email: string;
  isEmailVerified: boolean;
  loginType: string;
  role: "USER" | "ADMIN";
  updatedAt: string;
  username: string;
};

type RegisterRequestPayload = {
  email: string;
  password: string;
  username: string;
  role: "USER" | "ADMIN";
};

type RegisterResponsePayload = {
  id: string;
  email: string;
  username: string;
  role: "USER" | "ADMIN";
  token: string;
};

type LoginRequestPayload = {
  email: string;
  password: string;
};

type LoginResponsePayload = {
  accessToken: string;
  refreshToken: string;
  user: UserType;
};

type RefreshTokenResponsePayload = {
  accessToken: string;
  refreshToken: string;
};

type AuthApiConfig = {
  registerUser: (
    data: RegisterRequestPayload
  ) => ApiRequestConfig<RegisterRequestPayload>;
  loginUser: (
    data: LoginRequestPayload
  ) => ApiRequestConfig<LoginRequestPayload>;
  refreshToken: () => ApiRequestConfig;
  logoutUser: () => ApiRequestConfig<void>;
  getCurrentUser: () => ApiRequestConfig<void>;
};

export const authApi: AuthApiConfig = {
  registerUser: (data) => ({
    url: "/users/register",
    method: "post",
    data,
  }),

  loginUser: (data) => ({
    url: "/users/login",
    method: "post",
    data,
  }),

  refreshToken: () => ({
    url: "/users/refresh-token",
    method: "post",
  }),

  logoutUser: () => ({
    url: "/users/logout",
    method: "post",
  }),

  getCurrentUser: () => ({
    url: "/users/current-user",
    method: "get",
  }),
};

export type {
  RegisterRequestPayload,
  RegisterResponsePayload,
  LoginRequestPayload,
  LoginResponsePayload,
  RefreshTokenResponsePayload,
  AvatarType,
  UserType,
};
