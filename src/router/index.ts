import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/Login.vue'
import CreateAccount from '../views/CreateAccount.vue'
import DrillerView from '../views/DrillerView.vue'
import { useAppState } from '../realm-state';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/create-account',
    name: 'CreateAccount',
    component: CreateAccount
  }
  ,
  {
    path: '/driller-view',
    name: 'DrillerView',
    component: DrillerView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to , from , next) => {
  const {isLoggedIn } = useAppState();
  if(to.fullPath === '/home'){
    if(!isLoggedIn.value){
      next('/login');
    }
  }
  if(to.fullPath === '/login'){
    if(isLoggedIn.value){
      next('./home');
    }
  }
  // if(to.fullPath === '/driller-view'){
  //   if(isLoggedIn.value){
  //     next('./driller-view');
  //   }
  // }
  next();
})

export default router
