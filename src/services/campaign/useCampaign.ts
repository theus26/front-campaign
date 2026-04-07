import useCampaign from "@/@core/services/campaign/useCampaign";
import useAuth from "@/services/auth/useAuth";
import axios from "axios";
import defaultConfig from "../defaultConfig";

const axiosIns = axios.create({
  baseURL: defaultConfig.baseUrlService,
  headers: {
    "Content-Type": "application/json",
  },
});

const { campaign } = useCampaign(axiosIns, useAuth);
export default campaign;
