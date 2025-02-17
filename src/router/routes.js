const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "profile",
        name: "profile",
        component: () => import("pages/Profile/Profile.vue"),
        meta: {
          requiresAuth: true,
          rol: [
            "Administrador",
            "Full ICT",
            "Full MDA",
            "SG Full",
            "M&C Full",
            "Full Programming",
            "Jr ICT",
            "Jr MDA",
            "SG Jr",
            "M&C Jr",
            "Jr Programming",
          ],
        },
      },
      {
        path: "editprofile",
        name: "editprofile",
        component: () => import("pages/Profile/EditProfile.vue"),
        meta: {
          requiresAuth: true,
          rol: [
            "Administrador",
            "Full ICT",
            "Full MDA",
            "SG Full",
            "M&C Full",
            "Full Programming",
            "Jr ICT",
            "Jr MDA",
            "SG Jr",
            "M&C Jr",
            "Jr Programming",
          ],
        },
      },
      {
        path: "login",
        name: "login",
        component: () => import("pages/Profile/Login.vue"),
        meta: { requiresGuest: true },
      },
      {
        path: "notifications",
        name: "notifications",
        component: () => import("pages/Notifications.vue"),
        meta: { requiresAuth: true, rol: ["Administrador"] },
      },
      {
        path: "configurations",
        name: "configurations",
        component: () => import("pages/Configurations.vue"),
        meta: { requiresAuth: true, rol: ["Administrador"] },
      },
      {
        path: "config",
        name: "config",
        component: () => import("pages/Config.vue"),
        meta: {
          requiresAuth: true,
          rol: [
            "Administrador",
            "Full ICT",
            "Full MDA",
            "SG Full",
            "M&C Full",
            "Full Programming",
            "Jr ICT",
            "Jr MDA",
            "SG Jr",
            "M&C Jr",
            "Jr Programming",
          ],
        },
      },

      // Routes for ICT
      {
        path: "mda",
        name: "mda",
        component: () => import("src/pages/mda/MDA.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador", "Full MDA", "Jr MDA"],
        },
      },
      {
        path: "ict",
        name: "ict",
        component: () => import("pages/ict/ICTIndex.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador", "Full ICT", "Jr ICT"],
        },
      },
      {
        path: "component_report",
        name: "component_report",
        component: () => import("pages/component_report/historicReports.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador", "Full ICT", "Jr ICT"],
        },
      },
      {
        path: "component_report/:id",
        name: "component_report_data",
        component: () => import("pages/component_report/componentReport.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador", "Full ICT", "Jr ICT"],
        },
      },
      {
        path: "organigrama",
        name: "organigrama",
        component: () => import("pages/TeamTests/Organigrama.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador"],
        },
      },
      {
        path: "historialUsuarios",
        name: "historial_usuarios",
        component: () =>
          import("components/Dialogs/OrganigramaDialogs/Historial.vue"),
        meta: {
          requiresAuth: true,
          rol: [
            "Administrador",
            "Full ICT",
            "Full ISP",
            "Full MDA",
            "Full BSI",
            "Full Programming",
          ],
        },
      },
      {
        path: "labelCenter",
        name: "label-center",
        component: () => import("pages/TeamTests/LabelCenter.vue"),
        meta: { requiresAuth: true, rol: ["Administrador"] },
      },
      {
        path: "maintenance",
        name: "maintenance",
        component: () => import("pages/Maintenance/MaintenanceCalendar.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador", "M&C Full", "M&C Jr"],
        },
      },
      {
        path: "straingauge",
        name: "strain-gauge",
        component: () => import("src/pages/strain_gauge/StrainGauge.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador", "SG Full", "SG Jr"],
        },
      },
      {
        path: "programming",
        name: "Programming",
        component: () => import("pages/programing/Programing.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador", "Full Programming", "Jr Programming"],
        },
      },
      //Calendar routes
      {
        path: "calendar/vacations",
        name: "vacation_calendar",
        component: () => import("pages/calendar/VacationCalendar.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador", "VC Full"],
        },
      },
      {
        path: "/other_models",
        name: "other_models",
        component: () => import("pages/IndexReports.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador", "Full ISP", "Jr ISP"],
        },
      },
      //New Model routes
      {
        path: "/other_models/:model",
        name: "model_data",
        component: () => import("pages/model_charts/IndexModel.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador", "Full ISP", "Jr ISP"],
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
