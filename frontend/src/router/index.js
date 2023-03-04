import { createRouter, createWebHistory } from 'vue-router';

const title = ' - 雲科大資管系 畢業生流向調查系統';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue'),
    meta: { title: titleFormat('Home') }
  },
  {
    path: '/form',
    name: 'form',
    component: () => import('@/views/Form.vue'),
    meta: { title: titleFormat('Form') }
  },
  {
    path: '/done',
    name: 'done',
    component: () => import('@/views/Done.vue'),
    meta: { title: titleFormat('Done') }
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('@/views/Manage.vue'),
    meta: { title: titleFormat('Manage') },
    children: [
      {
        path: '',
        name: 'mgmtHome',
        component: () => import('@/views/mgmtCmpt/Home.vue')
      },
      {
        path: 'query',
        name: 'dataQuery',
        component: () => import('@/views/mgmtCmpt/DataQuery.vue')
      },
      {
        path: 'batch',
        name: 'dataBatch',
        component: () => import('@/views/mgmtCmpt/DataBatch.vue')
      },
      {
        path: 'stats',
        name: 'dataStats',
        component: () => import('@/views/mgmtCmpt/DataStats.vue')
      },
      {
        path: 'account',
        name: 'accManage',
        component: () => import('@/views/mgmtCmpt/AccManage.vue')
      },
      {
        path: 'perms',
        name: 'accPerms',
        component: () => import('@/views/mgmtCmpt/AccPerms.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  if(to.meta.title) document.title = to.meta.title;
  next();
})

export default router;

function titleFormat(str) {
  return str + title;
}
