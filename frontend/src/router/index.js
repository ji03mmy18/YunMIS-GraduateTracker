import { createRouter, createWebHistory } from 'vue-router';

const title = ' - 雲科大資管系 畢業生流向調查系統';

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/components/HelloWorld.vue'),
    meta: { title: titleFormat('Home') }
  },
  {
    path: '/test',
    name: 'main',
    component: () => import('@/components/Home.vue'),
    meta: { title: titleFormat('Main') }
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
