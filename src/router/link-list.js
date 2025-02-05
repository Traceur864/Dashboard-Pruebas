export const linksList = [
  {
    title: "Home",
    caption: "Pagina principal",
    icon: "las la-home",
    link: "home",
  },
  {
    title: "ICT",
    caption: "Visualizacion de datos ICT",
    icon: "las la-chart-bar",
    link: "ict",
    meta: { rol: ["Administrador", "Full ICT", "Jr ICT"] },
  },
  {
    title: "MDA",
    caption: "Visualizacion de datos MDA",
    icon: "las la-project-diagram",
    link: "mda",
    meta: {
      rol: ["Administrador", "Full ISP", "Full BSI", "Full MDA", "Full ICT"],
    },
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
    meta: { rol: ["Administrador", "Full BSI", "Jr BSI"] },
  },
  {
    title: "Label Center",
    caption: "Control de Etiquetas",
    icon: "las la-ticket-alt",
    link: "label-center",
    meta: { rol: ["Administrador"] },
  },
  {
    title: "Docs",
    caption: "quasar.dev",
    icon: "las la-graduation-cap",
    link: "https://quasar.dev",
  },
];
