export default [
  { heading: "Campanhas de WhatsApp" },
  {
    title: "Gestão de Campanhas",
    icon: { icon: "tabler-chart-donut-2" },
    children: [
      {
        title: "Criar Nova Campanha",
        to: "campaigns-create",
      },
      {
        title: "Histórico de Campanhas",
        to: "campaigns-list",
      },
    ],
  },
];
