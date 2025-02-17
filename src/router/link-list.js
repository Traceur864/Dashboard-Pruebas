export const linksList = [
  {
    title: "Home",
    caption: "Pagina principal",
    icon: "las la-home",
    link: "home",
  },
  {
    title: "Visualización de datos",
    caption: "Información graficada por modelo",
    icon: "las la-chart-bar",
    link: "other_models",
    meta: { rol: ["Administrador", "Full ISP", "Jr ISP"] },
  },
  {
    title: "Reporte de componente",
    caption: "Comportamiento de componente",
    icon: "query_stats",
    link: "component_report",
    meta: { rol: ["Administrador", "Full ICT", "Jr ICT"] },
  },
  {
    title: "Organigrama",
    caption: "Informacion de equipo de trabajo",
    icon: "las la-users",
    link: "organigrama",
    meta: {
      rol: ["Administrador"],
    },
  },
  {
    title: "Strain Gauge",
    caption: "Mantenimiento de equipos",
    icon: "las la-calendar-check",
    link: "strain-gauge",
    meta: {
      rol: ["Administrador", "SG Full", "SG Jr"],
    },
  },
  {
    title: "Vacation Planner",
    caption: "RH",
    icon: "lar la-calendar",
    link: "vacation_calendar",
    meta: { rol: ["Administrador", "VC Full"] },
  },
  {
    title: "Mantenimientos",
    caption: "Mantenimientos y calibraciones",
    icon: "engineering",
    link: "maintenance",
    meta: { rol: ["Administrador", "M&C Full", "M&C Jr"] },
  },
  {
    title: "Label Center",
    caption: "Control de Etiquetas",
    icon: "las la-ticket-alt",
    link: "label-center",
    meta: { rol: ["Administrador"] },
  },
  {
    title: "Programming",
    caption: "Programacion de componentes",
    icon: "las la-microchip",
    link: "Programming",
    meta: { rol: ["Administrador", "Full Programming", "Jr Programming"] },
  },
];
