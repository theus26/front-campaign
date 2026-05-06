import useGroupContact from "@/@core/services/group-contacts/useGroupContact";
import useAuth from "@/services/auth/useAuth";
import axios from "axios";
import defaultConfig from "../defaultConfig";

const axiosIns = axios.create({
  baseURL: defaultConfig.baseUrlService,
  headers: {
    "Content-Type": "application/json",
  },
});

const { groupContacts } = useGroupContact(axiosIns, useAuth);
export default groupContacts;
