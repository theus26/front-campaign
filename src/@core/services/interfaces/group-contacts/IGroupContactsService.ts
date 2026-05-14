import { IPaginacao } from "../types";

export interface IGroupContactsService {
  serviceGroupContactConfig: IGroupContactConfig;

  createGroupContact(data: ICriarGrupoContato): Promise<void>;
  updateGroupContact(
    groupContactId: string,
    data: IAtualizarGrupoContato,
  ): Promise<void>;
  getGroupContactById(groupContactId: string): Promise<IGruposContatosDto>;
  getListAllGroupContacts(): Promise<IGruposContatosDto[]>;
  getListGroupContacts(
    filter: IGruposFiltros,
  ): Promise<IPaginacao<IGruposContatosDto>>;

  deleteGroupContact(groupContactId: string): Promise<void>;
}

export type IGroupContactConfig = {
  createGroupContact: string;
  updateGroupContact: string;
  deleteGroupContact: string;
  getGroupContactById: string;
  getListGroupContacts: string;
  getListAllGroupContacts: string;
};

export interface ICriarGrupoContato {
  nome: string;
  numeros: string[];
}

export interface IAtualizarGrupoContato {
  nome?: string | null;
  numeros?: string[];
}

export interface IGruposFiltros {
  nome?: string;
  pagina?: number;
  tamanhoPagina?: number;
}

export interface IGruposContatosDto {
  grupoId: string;
  nome: string;
  contatosGrupoDto: IContatosGrupoDto[];
  dataCriacao: string;
  dataAtualizacao?: string;
}
export interface IContatosGrupoDto {
  nome: string;
  numero: string;
}
