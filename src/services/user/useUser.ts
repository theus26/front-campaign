import useAuth from "@/services/auth/useAuth";
import useUser from "@core/services/user/useUser";
import axios from "axios";
import defaultConfig from "../defaultConfig";

const axiosIns = axios.create({
  baseURL: defaultConfig.baseUrlService,
  headers: {
    "Content-Type": "application/json",
  },
});

const { user } = useUser(axiosIns, useAuth);
export default user;
