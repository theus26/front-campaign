import { AxiosInstance } from "axios";
import AuthService from "../auth/authService";
import { IAuthService } from "../interfaces/auth/IAuthService";
import {
  IAtualizarContato,
  IContactConfig,
  IContactsAll,
  IContactsService,
  IContatos,
  IContatosFiltros,
  IContatosFiltrosSemPaginacaoDto,
  ICriarContato,
} from "../interfaces/contacts/IContactsService";
import { IPaginacao } from "../interfaces/types";
import defaultConfig from "./contactsDefaultConfig";

export default class ContactService
  extends AuthService
  implements IContactsService
{
  useAuth: IAuthService;
  axiosIns: AxiosInstance;
  serviceContactConfig: IContactConfig;

  constructor(
    axiosIns: AxiosInstance,
    useAuth: IAuthService,
    overrideConfig: Object,
  ) {
    super(axiosIns, overrideConfig);
    this.serviceContactConfig = { ...defaultConfig, ...overrideConfig };
    this.useAuth = useAuth;
    this.axiosIns = axiosIns;
    this.useAuth.configureInterceptorsAxiosInstance(this.axiosIns);
  }
  async getListaAllContacts(
    filter: IContatosFiltrosSemPaginacaoDto,
  ): Promise<IContactsAll[]> {
    const response = await this.axiosIns.get(
      this.serviceContactConfig.getListaAllContacts,
      {
        params: filter,
      },
    );
    return response.data;
  }
  async createContact(data: ICriarContato): Promise<void> {
    const response = await this.axiosIns.post(
      this.serviceContactConfig.createContact,
      data,
    );
    return response.data;
  }
  async updateContact(
    contatoId: string,
    data: IAtualizarContato,
  ): Promise<void> {
    await this.axiosIns.put(this.serviceContactConfig.updateContact, data, {
      params: { contatoId },
    });
  }
  async getContactById(contatoId: string): Promise<IContatos> {
    const response = await this.axiosIns.get(
      this.serviceContactConfig.getContactById,
      {
        params: { contatoId },
      },
    );
    return response.data;
  }
  async listContacts(filter: IContatosFiltros): Promise<IPaginacao<IContatos>> {
    const response = await this.axiosIns.get(
      this.serviceContactConfig.getListContacts,
      {
        params: filter,
      },
    );
    return response.data;
  }
  async deleteContact(contatoId: string): Promise<void> {
    await this.axiosIns.delete(this.serviceContactConfig.deleteContact, {
      params: { contatoId },
    });
  }
}
