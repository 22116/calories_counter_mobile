import { RouteConfig } from 'vue-router'

const routes: RouteConfig[] = [
  {
    path: '/',
    component: () => import('components/view/layouts/MainLayout.vue'),
    children: [
      { path: '/', redirect: '/history' },
      { path: '/history', component: () => import('components/view/pages/History.vue') },
      { path: '/counter/:date/:hash', component: () => import('components/view/pages/Counter.vue') },
      { path: '/settings', component: () => import('components/view/pages/Settings.vue') },
      { path: '/statistics', component: () => import('components/view/pages/Statistics.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('components/view/pages/Error404.vue')
  }
]

export default routes
