import { AxiosInstance } from "axios";
import AuthService from "../auth/authService";
import { IAuthService } from "../interfaces/auth/IAuthService";
import {
  IAtualizarGrupoContato,
  ICriarGrupoContato,
  IGroupContactConfig,
  IGroupContactsService,
  IGruposContatosDto,
  IGruposFiltros,
} from "../interfaces/group-contacts/IGroupContactsService";
import { IPaginacao } from "../interfaces/types";
import defaultConfig from "./groupContactDefaultConfig";

export default class GroupContactService
  extends AuthService
  implements IGroupContactsService
{
  useAuth: IAuthService;
  axiosIns: AxiosInstance;
  serviceGroupContactConfig: IGroupContactConfig;

  constructor(
    axiosIns: AxiosInstance,
    useAuth: IAuthService,
    overrideConfig: Object,
  ) {
    super(axiosIns, overrideConfig);
    this.serviceGroupContactConfig = { ...defaultConfig, ...overrideConfig };
    this.useAuth = useAuth;
    this.axiosIns = axiosIns;
    this.useAuth.configureInterceptorsAxiosInstance(this.axiosIns);
  }
  async createGroupContact(data: ICriarGrupoContato): Promise<void> {
    const response = await this.axiosIns.post(
      this.serviceGroupContactConfig.createGroupContact,
      data,
    );
    return response.data;
  }
  async updateGroupContact(
    grupoId: string,
    data: IAtualizarGrupoContato,
  ): Promise<void> {
    await this.axiosIns.put(
      this.serviceGroupContactConfig.updateGroupContact,
      data,
      {
        params: { grupoId },
      },
    );
  }
  async getGroupContactById(grupoId: string): Promise<IGruposContatosDto> {
    const response = await this.axiosIns.get(
      this.serviceGroupContactConfig.getGroupContactById,
      {
        params: { grupoId },
      },
    );
    return response.data;
  }
  async getListGroupContacts(
    filter: IGruposFiltros,
  ): Promise<IPaginacao<IGruposContatosDto>> {
    const response = await this.axiosIns.get(
      this.serviceGroupContactConfig.getListGroupContacts,
      {
        params: filter,
      },
    );
    return response.data;
  }
  async deleteGroupContact(grupoId: string): Promise<void> {
    await this.axiosIns.delete(
      this.serviceGroupContactConfig.deleteGroupContact,
      {
        params: { grupoId },
      },
    );
  }
}
