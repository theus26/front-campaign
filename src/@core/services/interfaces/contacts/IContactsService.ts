import { IPaginacao } from "../types";

export interface IContactsService {
  serviceContactConfig: IContactConfig;
  createContact(data: ICriarContato): Promise<void>;
  updateContact(contactId: string, data: IAtualizarContato): Promise<void>;
  getContactById(contactId: string): Promise<IContatos>;
  listContacts(filter: IContatosFiltros): Promise<IPaginacao<IContatos>>;
  getListaAllContacts(
    filter: IContatosFiltrosSemPaginacaoDto,
  ): Promise<IContactsAll[]>;
  deleteContact(contactId: string): Promise<void>;
}

export type IContactConfig = {
  createContact: string;
  updateContact: string;
  deleteContact: string;
  getContactById: string;
  getListContacts: string;
  getListaAllContacts: string;
};

export interface ICriarContato {
  numero?: string;
  nome?: string;
  fotoPerfil?: string;
}

export interface IAtualizarContato extends ICriarContato {}

export interface IContatosFiltros {
  numero?: string;
  nome?: string;
  pagina: number;
  tamanhoPagina: number;
}

export interface IContatos {
  id: string;
  numero?: string;
  nome?: string;
  fotoPerfil?: string;
}

export interface IContactsAll {
  nome?: string;
  numero?: string;
}

export interface IContatosFiltrosSemPaginacaoDto extends IContactsAll {}
