import { IProviderConfig } from "../../interfaces/campaign/IProviderService";

const defaultConfig: IProviderConfig = {
  createProvider: "/provider/createProvider",
  connectInstance: "provider/connectInstance",
  logoutProvider: "provider/logoutProvider",
  removeProvider: "provider/removeProvider",
  getListProviders: "provider/getProvidersByAccountId",
  getConnectionState: "provider/getConnectionState",
  updateProvider: "provider/updateProvider",
};

export default defaultConfig;
