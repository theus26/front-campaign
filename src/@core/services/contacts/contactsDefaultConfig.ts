import { IContactConfig } from "../interfaces/contacts/IContactsService";

const defaultConfig: IContactConfig = {
  createContact: "/Contato/InserirContato",
  updateContact: "/Contato/EditarContato",
  deleteContact: "/Contato/RemoverContato",
  getContactById: "/Contato/ObterContatoPorId",
  getListContacts: "/Contato/ListarContatos",
  getListaAllContacts: "/Contato/ListarContatosSemPaginacao",
};
export default defaultConfig;
