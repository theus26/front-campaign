import { AxiosInstance } from "axios";
import AuthService from "../auth/authService";
import { IAuthService } from "../interfaces/auth/IAuthService";
import { IPaginacao } from "../interfaces/types";
import {
  ICreateUser,
  IUpdateUser,
  IUser,
  IUserConfig,
  IUserFilter,
  IUserService,
} from "../interfaces/user/IUserService";
import defaultConfig from "./userDefaultConfig";

export default class UserService extends AuthService implements IUserService {
  useAuth: IAuthService;
  axiosIns: AxiosInstance;
  serviceUserConfig: IUserConfig;

  constructor(
    axiosIns: AxiosInstance,
    useAuth: IAuthService,
    overrideConfig: Object,
  ) {
    super(axiosIns, overrideConfig);
    this.serviceUserConfig = { ...defaultConfig, ...overrideConfig };
    this.useAuth = useAuth;
    this.axiosIns = axiosIns;
    this.useAuth.configureInterceptorsAxiosInstance(this.axiosIns);
  }

  async getCurrentUser(): Promise<IUser> {
    const response = await this.axiosIns.get(
      this.serviceUserConfig.getCurrentUser,
    );
    return response.data;
  }

  async getUser(userId: string): Promise<IUser> {
    const response = await this.axiosIns.get(this.serviceUserConfig.getUser, {
      params: { userId },
    });
    return response.data;
  }

  async listUsers(filter: IUserFilter): Promise<IPaginacao<IUser>> {
    const response = await this.axiosIns.get(this.serviceUserConfig.listUsers, {
      params: filter,
    });
    return response.data;
  }

  async createUser(data: ICreateUser): Promise<void> {
    await this.axiosIns.post(this.serviceUserConfig.createUser, data);
  }

  async updateUser(userId: string, userData: IUpdateUser): Promise<void> {
    await this.axiosIns.put(this.serviceUserConfig.updateUser, userData, {
      params: { userId },
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await this.axiosIns.delete(this.serviceUserConfig.deleteUser, {
      params: { userId },
    });
  }
}
