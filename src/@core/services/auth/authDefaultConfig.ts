import { IAuthConfig } from "@core/services/interfaces/auth/IAuthService";

const authConfig: IAuthConfig = {
  // Endpoints
  loginEndpoint: "/Services/Autenticacao/LoginService.asmx/Logar",

  refreshEndpoint: "/connect/refreshtoken",
  logoutEndpoint: "/jwt/logout",

  tokenType: "Bearer",
  storageTokenKeyName: "accessToken",
  storageRefreshTokenKeyName: "refreshToken",
  storageExpiresAtKeyName: "expiresAtToken",
  storageDomainKeyName: "domain",

  novaSenhaEndpoint:
    "Services/Autenticacao/LoginService.asmx/AlterarSenhaPorGuid",
  resetarSenhaEndpoint: "Services/Autenticacao/LoginService.asmx/ResetarSenha",
  obterChaveMFAEndpoint: "Services/Autenticacao/MfaService.asmx/ConfigurarMFA",
  salvarMFACodigoAutenticacaoEndpoint:
    "Services/Autenticacao/MfaService.asmx/ConfirmarMFA",
  desativarMFAEndpoint:
    "Services/Autenticacao/MfaService.asmx/DesativarMFAUsuarioLogado",
  logarDMSEndpoint:
    "Services/FandiOne/IntegracaoDMSService.asmx/RedirecionarDMS",
};

export default authConfig;
