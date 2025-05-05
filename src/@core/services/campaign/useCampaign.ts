import { AxiosInstance } from "axios";
import campaignService from "./campaignService";

export default function useAddress(
  axiosIns: AxiosInstance,
  overrideConfig: Object
) {
  const campaign = new campaignService(axiosIns, overrideConfig);

  return {
    telephony,
  };
}
