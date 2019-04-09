export default [
  { path: '/', redirect: '/scheduler/index' },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      {
        path: '/scheduler',
        name: 'scheduler',
        icon: 'dashboard',
        routes: [
          {
            path: '/scheduler/index',
            name: 'index',
            component: './AdScheduler/index.tsx',
          },
        ],
      },
      {
        path: '/advert',
        name: 'advert',
        icon: 'dashboard',
        routes: [
          {
            path: '/advert/list',
            name: 'list',
            component: './Advert/List.tsx',
          },
          {
            path: '/advert/create',
            name: 'create',
            component: './Advert/Create.tsx',
            hideInMenu: true,
          },
          {
            path: '/advert/edit/:id',
            name: 'edit',
            component: './Advert/Edit.tsx',
            hideInMenu: true,
          },
          {
            path: '/advert/stats/:id',
            name: 'stats',
            component: './Stats/List.tsx',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/place',
        name: 'place',
        icon: 'dashboard',
        routes: [
          {
            path: '/place/list',
            name: 'list',
            component: './Place/List.tsx',
          },
        ],
      },
      {
        path: '/material',
        name: 'material',
        icon: 'dashboard',
        routes: [
          {
            path: '/material/list',
            name: 'list',
            component: './Material/List.tsx',
          },
        ],
      },
      {
        path: '/template',
        name: 'template',
        icon: 'dashboard',
        routes: [
          {
            path: '/template/list',
            name: 'list',
            component: './Template/List.tsx',
          },
          {
            path: '/template/create',
            name: 'create',
            component: './Template/Create.tsx',
            hideInMenu: true,
          },
          {
            path: '/template/edit/:id',
            name: 'edit',
            component: './Template/Edit.tsx',
            hideInMenu: true,
          },
        ],
      },
      {
        path: '/rebase',
        name: 'rebase',
        icon: 'dashboard',
        routes: [
          {
            path: '/rebase/list',
            name: 'list',
            component: './Rebase/List.tsx',
          },
          {
            path: '/rebase/group/list',
            name: 'grouplist',
            component: './RebaseGroup/List.tsx',
          },
        ],
      },
      {
        path: '/common',
        name: 'common',
        icon: 'dashboard',
        routes: [
          {
            path: '/common/media/list',
            name: 'mediaList',
            component: './Media/List.tsx',
          },
          {
            path: '/common/channel/list',
            name: 'channelList',
            component: './Channel/List.tsx',
          },
          {
            path: '/common/:id/channel/list',
            name: 'channelList',
            component: './Channel/List.tsx',
            hideInMenu: true,
          },
          {
            path: '/common/place-type/list',
            name: 'placeTypeList',
            component: './PlaceType/List.tsx',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
]
