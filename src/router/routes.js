import organigrama from 'pages/TeamTests/Organigrama.vue'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      // Routes for Proves
      { path: 'typography', name:'typography', component: () => import('pages/Typography.vue') },
      { path: 'flex', name:'flex', component: () => import('pages/Flex.vue') },
      { path: 'profile', name:'profile', component: () => import('pages/Profile/Profile.vue')},
      { path: 'login', name:'login', component: () => import('pages/Profile/Login.vue')},
      { path: 'notifications', name:'notifications', component: () => import('pages/Notifications.vue')},
      { path: 'configurations', name:'configurations', component: () => import('pages/Configurations.vue')},

      // Routes for ICT
      { path: 'mda', name:'mda', component: () => import('pages/TeamTests/MDA.vue')},
      { path: 'ict', name:'ict', component: () => import('pages/TeamTests/ICT.vue')},
      { path: 'organigrama', name:'organigrama', component: () => import('pages/TeamTests/Organigrama.vue')},
      { path: 'straingauge', name:'strain-gauge', component: () => import('pages/TeamTests/StrainGauge.vue')}

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
