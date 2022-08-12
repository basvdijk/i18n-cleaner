const normalRoutes = [
  { path: '/', redirect: '/home' },
  {
    path: '/home',
    component: Home,
    name: 'Home',
    meta: { middleware: 'auth', pageTitleTranslationKey: 'pages.home' },
  },
  {
    path: '/settings',
    component: Settings,
    name: 'Settings',
    meta: { middleware: 'auth', pageTitleTranslationKey: 'pages.settings' },
  },
];
