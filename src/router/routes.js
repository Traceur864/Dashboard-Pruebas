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
            "Full ISP",
            "Full MDA",
            "Full BSI",
            "Full Programming",
            "Jr ICT",
            "Jr MDA",
            "Jr BSI",
            "Jr ISP",
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
            "Full ISP",
            "Full MDA",
            "Full BSI",
            "Full Programming",
            "Jr ICT",
            "Jr MDA",
            "Jr BSI",
            "Jr ISP",
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
        meta: { requiresAuth: true, rol: ["Administrador"] },
      },

      // Routes for ICT
      {
        path: "mda",
        name: "mda",
        component: () => import("pages/TeamTests/MDA.vue"),
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
          rol: ["Administrador", "Full BSI", "Jr BSI"],
        },
      },
      {
        path: "straingauge",
        name: "strain-gauge",
        component: () => import("pages/TeamTests/StrainGauge.vue"),
        meta: {
          requiresAuth: true,
          rol: ["Administrador", "Full ISP", "Jr ISP"],
        },
      },

      //Calendar routes
      {
        path: "calendar/vacations",
        name: "vacation_calendar",
        component: () => import("pages/calendar/VacationCalendar.vue"),
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
