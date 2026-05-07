import customWizardAccount from "@images/svg/wizard-account.svg";
import customWizardAddress from "@images/svg/wizard-address.svg";
import customWizardPersonal from "@images/svg/wizard-personal.svg";
import customWizardSocialLink from "@images/svg/wizard-social-link.svg";
export const iconsSteps = [
  {
    title: "Informações da campanha",
    icon: customWizardAccount,
  },
  { title: "Público-alvo", icon: customWizardAddress },
  { title: "Caixa de saída", icon: customWizardPersonal },
  { title: "Mensagem", icon: customWizardSocialLink },
];

export const radioContent = [
  {
    title: "Única",
    desc: "Envie mensagens automáticas para seus contatos de forma única.",
    value: "unica",
  },
  {
    title: "Recorrente",
    value: "recorrente",
    desc: "Envie mensagens automáticas recorrentes para seus contatos.",
  },
];

export const typeContacts = [
  // {
  //   title: "Adicione os números de forma manual",
  //   desc: "Digite os números desejados manualmente para incluir novos contatos no chat.",
  //   value: "manual",
  // },
  {
    title: "Selecionar contatos",
    value: "contatos",
    desc: "Escolha contatos individuais ou grupos já cadastrados para adicionar participantes rapidamente.",
  },
  {
    title: "Selecionar grupos",
    value: "grupos",
    desc: "Adicione participantes utilizando grupos de contatos já criados e organizados.",
  },
  {
    title: "Importar planilhas",
    value: "import",
    desc: "Importe um arquivo em formato XLS, XLSX ou CSV contendo a lista de números.",
  },
];

export const breakMessage = [
  { label: "A cada 5 min - Recomendado", value: "00:05:00" },
  { label: "A cada 3 min", value: "00:03:00" },
  { label: "A cada 2 min - Risco de banimento", value: "00:02:00" },
  { label: "A cada 1 min - Alto risco de banimento", value: "00:01:00" },
];

export const recurrencePeriod = [
  { label: "Diário", value: "1.00:00:00" }, // 1 dia
  { label: "Semanal", value: "7.00:00:00" }, // 7 dias
  { label: "Mensal", value: "30.00:00:00" }, // 30 dias (aprox)
];
