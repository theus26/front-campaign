import AuthService from "@core/services/auth/authService";
import { AxiosInstance } from "axios";
import {
  ITelephonyAll,
  ITelephonyUser,
} from "../interfaces/telephony/ITelephony";
import {
  ITelephonyConfig,
  ITelephonyService,
} from "../interfaces/telephony/ITelephonyService";
import defaultConfig from "./telephonyDefaultConfig";

export default class TelephonyService
  extends AuthService
  implements ITelephonyService
{
  serviceTelephonyConfig: ITelephonyConfig;

  constructor(axiosIns: AxiosInstance, overrideConfig: Object) {
    super(axiosIns, overrideConfig);
    this.serviceTelephonyConfig = { ...defaultConfig, ...overrideConfig };
  }

  async requestGetAllTelephony(): Promise<ITelephonyAll> {
    const response = await this.axiosIns.get(
      this.serviceTelephonyConfig.getAllTelephonyEndPoint
    );
    return response.data;
  }

  async registerDataUserTelephony(
    provider: string,
    deviceId: string,
    ramalId: string,
    userId?: string
  ): Promise<void> {
    return this.axiosIns.put(
      this.serviceTelephonyConfig.postRegisterDataUserTelephonyEndpoint,
      {
        deviceId: deviceId,
        ramalId: ramalId,
        usuarioId: userId,
        telefoniaId: provider,
      }
    );
  }

  async requestTelephonyUser(
    userId: string
  ): Promise<{ data: ITelephonyUser[] }> {
    const response = await this.axiosIns.get(
      `${this.serviceTelephonyConfig.getTelephonyUserEndpoint}?usuarioId=${userId}`
    );
    return response.data;
  }
}
