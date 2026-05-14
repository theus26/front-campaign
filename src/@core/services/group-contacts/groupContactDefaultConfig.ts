import { IGroupContactConfig } from "../interfaces/group-contacts/IGroupContactsService";

const defaultConfig: IGroupContactConfig = {
  createGroupContact: "/Grupo/InserirGrupo",
  updateGroupContact: "/Grupo/EditarGrupo",
  deleteGroupContact: "/Grupo/RemoverGrupo",
  getGroupContactById: "/Grupo/ObterGrupoPorId",
  getListGroupContacts: "/Grupo/ListarGrupos",
  getListAllGroupContacts: "Grupo/ListarGruposSemPaginacao",
};

export default defaultConfig;
