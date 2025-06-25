import { IProviderConfig } from "../../interfaces/campaign/IProviderService";

const defaultConfig: IProviderConfig = {
  createProvider: "/provider/createProvider",
  connectInstance: "/messageTrigger/connectInstance",
  removeProvider: "provider/removeProvider",
  getProvidersByAccountId: "provider/getProvidersByAccountId",
};

export default defaultConfig;
