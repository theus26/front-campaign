import useContacts from "@/@core/services/contacts/useContacts";
import useAuth from "@/services/auth/useAuth";
import axios from "axios";
import defaultConfig from "../defaultConfig";

const axiosIns = axios.create({
  baseURL: defaultConfig.baseUrlService,
  headers: {
    "Content-Type": "application/json",
  },
});

const { contacts } = useContacts(axiosIns, useAuth);
export default contacts;
