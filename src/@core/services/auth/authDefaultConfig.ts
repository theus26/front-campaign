import { IAuthConfig } from "@core/services/interfaces/auth/IAuthService";

const authConfig: IAuthConfig = {
  loginEndpoint: "/User/SignIn",
  refreshToken: "/User/RefreshToken",
};

export default authConfig;
