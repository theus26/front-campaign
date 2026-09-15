import { IAuthConfig } from "@core/services/interfaces/auth/IAuthService";

const authConfig: IAuthConfig = {
  loginEndpoint: "/User/SignIn",
  refreshToken: "/User/RefreshToken",
  loginWithGoogle: "/User/SignInWithGoogle",
};

export default authConfig;
