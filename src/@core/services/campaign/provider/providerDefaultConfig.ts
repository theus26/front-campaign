import { IProviderConfig } from "../../interfaces/campaign/IProviderService";

const defaultConfig: IProviderConfig = {
  createProvider: "/provider/createProvider",
  connectInstance: "provider/connectInstance",
  logoutProvider: "provider/logoutProvider",
  removeProvider: "provider/removeProvider",
  getListProviders: "provider/GetProvidersByUserId",
  getConnectionState: "provider/getConnectionState",
  updateProvider: "provider/updateProvider",
  syncContacts: "provider/SyncContacts"
};

export default defaultConfig;
