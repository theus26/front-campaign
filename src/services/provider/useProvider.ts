import useAuth from "@/services/auth/useAuth";
import useProvider from "@core/services/campaign/provider/useProvider";
import axios from "axios";
import defaultConfig from "../defaultConfig";

const axiosIns = axios.create({
  baseURL: defaultConfig.baseUrlService,
  headers: {
    "Content-Type": "application/json",
  },
});

const { provider } = useProvider(axiosIns, useAuth);
export default provider;
