import useAuth from "@core/services/auth/useAuth";
import axios from "axios";
import defaultConfig from "../defaultConfig";

const axiosIns = axios.create({
  baseURL: defaultConfig.baseUrlService,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const { auth } = useAuth(axiosIns, {});
export default auth;
