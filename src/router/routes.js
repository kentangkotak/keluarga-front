const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: '/anggotakeluarga', component: () => import('pages/anggotakeluarga/IndexPage.vue') },
      { path: '/pohon', component: () => import('src/pages/treepage/TreePage.vue') },
      // { path: 'anggotakeluarga', component: () => import('pages/TreePage.vue') },
      // { path: 'pohon', component: () => import('pages/TreePage.vue') },
    ],
  },
  // {
  //   path: '/anggotakeluarga',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [{ path: '', component: () => import('src/pages/treepage/TreePage.vue') }],
  // },
  // {
  //   path: '/pohon',
  //   component: () => import('layouts/MainLayout.vue'),
  //   children: [{ path: '', component: () => import('src/pages/treepage/TreePage.vue') }],
  // },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
