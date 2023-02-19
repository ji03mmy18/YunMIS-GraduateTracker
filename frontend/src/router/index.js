import { createRouter, createWebHistory } from 'vue-router';

const title = ' - 雲科大資管系 畢業生流向調查系統';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/Home.vue'),
    meta: { title: titleFormat('Home') }
  },
  {
    path: '/form',
    name: 'form',
    component: () => import('@/components/Form.vue'),
    meta: { title: titleFormat('Form') }
  },
  {
    path: '/done',
    name: 'done',
    component: () => import('@/components/Done.vue'),
    meta: { title: titleFormat('Done') }
  },
  {
    path: '/manage',
    name: 'manage',
    component: () => import('@/components/Manage.vue'),
    meta: { title: titleFormat('Manage') }
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
