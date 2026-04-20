import { IUserConfig } from "../interfaces/user/IUserService";

const defaultConfig: IUserConfig = {
  getCurrentUser: "/User/GetCurrentUser",
  getUser: "/User/GetUser",
  listUsers: "/User/ListUsers",
  createUser: "/User/CreateUser",
  updateUser: "/User/UpdateUser",
  deleteUser: "/User/DeleteUser",
};

export default defaultConfig;
