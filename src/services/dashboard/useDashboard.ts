import useDashboard from "@/@core/services/dashboard/useDashboard";
import useAuth from "@/services/auth/useAuth";
import axios from "axios";
import defaultConfig from "../defaultConfig";

const axiosIns = axios.create({
  baseURL: defaultConfig.baseUrlService,
  headers: {
    "Content-Type": "application/json",
  },
});

const { dashboard } = useDashboard(axiosIns, useAuth);
export default dashboard;
