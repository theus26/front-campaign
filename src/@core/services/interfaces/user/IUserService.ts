import { IPaginacao } from "../types";

export interface IUserService {
  serviceUserConfig: IUserConfig;

  getCurrentUser(): Promise<IUser>;
  getUser(userId: string): Promise<IUser>;
  listUsers(filter: IUserFilter): Promise<IPaginacao<IUser>>;
  createUser(data: ICreateUser): Promise<void>;
  updateUser(userId: string, userData: IUpdateUser): Promise<void>;
  deleteUser(userId: string): Promise<void>;
}

export type IUserConfig = {
  getCurrentUser: string;
  getUser: string;
  listUsers: string;
  createUser: string;
  updateUser: string;
  deleteUser: string;
};

export interface IUser {
  userId: string;
  email: string;
  fullName: string;
  role: string;
  status?: string;
  profilePictureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUserFilter {
  userId?: string;
  email?: string;
  fullName?: string;
  role?: string;
  status?: string;
  pagina: number;
  tamanhoPagina: number;
}

export interface ICreateUser {
  email: string;
  name: string;
  password: string;
}

export interface IUpdateUser {
  email?: string;
  fullName?: string;
  password?: string;
  role?: string;
  status?: string;
}
