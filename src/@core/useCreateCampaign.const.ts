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
    desc: "Envie mensagens automáticas de maneira recorrente para seus contatos.",
  },
];

export const typeContacts = [
  {
    title: "Adicione os números de forma manual",
    desc: "Digite os números desejados manualmente para incluir novos contatos no chat.",
    value: "manual",
  },
  {
    title: "Importar planilhas",
    value: "import",
    desc: "Importe um arquivo em formato XLS, XLSX ou CSV contendo a lista de números.",
  },
];

export const breakMessage = [
  "A cada 5 min - Recomendado",
  "A cada 3 min",
  "A cada 2 min - Risco de banimento",
  "A cada 1 min - Alto risco de banimento",
];

export const recurrencePeriod = ["Diário", "Semanal", "Mensal"];
