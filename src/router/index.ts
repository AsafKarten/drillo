import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/Login.vue'
import CreateAccount from '../views/CreateAccount.vue'
import CreateProject from '../views/CreateProject.vue'
import DrillerView from '../views/DrillerView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectView from '../views/ProjectView.vue'
import EmployeesView from '../views/EmployeesView.vue'
import MachinesView from '../views/MachinesView.vue'
import EmployeeView from '../views/EmployeeView.vue'
import MachineView from '../views/MachineView.vue'
import DailyReport from '../views/DailyReport.vue'
import CreateEmployee from '../views/CreateEmployee.vue'
import CreateMachine from '../views/CreateMachine.vue'
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
  }  ,
  {
    path: '/create-project',
    name: 'createProject',
    component: CreateProject
  }
  ,
  {
    path: '/projects',
    name: 'ProjectsView',
    component: ProjectsView
  } ,
  {
    path: '/project/:id',
    name: 'ProjectView',
    component: ProjectView,
  } ,
  {
    path: '/employees',
    name: 'EmployeesView',
    component: EmployeesView
  },
  {
    path: '/machines',
    name: 'MachinesView',
    component: MachinesView
  }
  ,
  {
    path: '/daily-report',
    name: 'DailyReport',
    component: DailyReport
  }
  ,
  {
    path: '/employee/:id',
    name: 'EmployeeView',
    component: EmployeeView
  }
  ,
  {
    path: '/machine/:id',
    name: 'MachineView',
    component: MachineView
  },
  {
    path: '/create-employee',
    name: 'CreateEmployee',
    component: CreateEmployee
  },
  {
    path: '/create-machine',
    name: 'CreateMachine',
    component: CreateMachine
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
 
  next();
})

export default router
