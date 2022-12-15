import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/Login.vue'
import CreateAccount from '../views/CreateAccount.vue'
import CreateProject from '../views/CreateProject.vue'
import AddDrillingMachineToProjectVue from '@/Components/AddDrillingMachineToProject.vue';
//import DrillerView from '../views/DrillerView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import ProjectView from '../views/ProjectView.vue'
import EmployeesView from '../views/EmployeesView.vue'
import MachinesView from '../views/MachinesView.vue'
import EmployeeView from '../views/EmployeeView.vue'
import MachineView from '../views/MachineView.vue'
import DailyReport from '../views/DailyReport.vue'
import SignDailyReport from '../views/SignDailyReport.vue'
import CreateEmployee from '../views/CreateEmployee.vue'
import CreateMachine from '../views/CreateMachine.vue'
import ProjectReports from '../views/ProjectReports.vue'
//new components imports
import ProjectManagment from '../NewViews/ProjectManagment.vue'
import AddJob from '../NewViews/AddJob.vue'
import WorkersView from '../NewViews/WorkersView.vue'
import AddWorker from '../NewViews/AddWorker.vue'
import ProjectMachines from '../NewViews/ProjectMachines.vue'
import AddMachine from '../NewViews/AddMachine.vue'
import ProjectMap from '../NewViews/ProjectMap.vue'
import ProjectFiles from '../NewViews/ProjectFiles.vue'
import ProjectTools from '../NewViews/ProjectTools.vue'
import PitsList from '../NewViews/PitsList.vue'
import FieldProjectManagment from '../NewViews/FieldProjectManagment.vue'
import MachineManagment from '../NewViews/MachineManagment.vue';
import MachineCrew from '../NewViews/MachineCrew.vue'
import FieldProjectMap from '../NewViews/FieldProjectMap.vue'

import { useAppState } from '../realm-state';
import { User } from 'realm-web';

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
  // {
  //   path: '/driller-view',
  //   name: 'DrillerView',
  //   component: DrillerView
  // }  ,
  {
    path: '/create-project',
    name: 'createProject',
    component: CreateProject
  }
  ,
  {
    path: '/add-machine-project/:id',
    name: 'AddDrillingMachineToProjectVue',
    component: AddDrillingMachineToProjectVue
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
    path: '/daily-report/:id',
    name: 'DailyReport',
    component: DailyReport
  }
  ,
  {
    path: '/sign-daily-report/:id',
    name: 'SignDailyReport',
    component: SignDailyReport
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
  ,
  {
    path: '/project-reports/:id',
    name: 'ProjectReports',
    component: ProjectReports
  },
  //new routes
  
  {
    path: '/project-managment/:id',
    name: 'ProjectManagment',
    component: ProjectManagment
  },
  {
    path: '/add-job/:id',
    name: 'AddJob',
    component: AddJob
  },
  {
    path: '/workers-view/:id',
    name: 'WorkersView',
    component: WorkersView
  },
  {
    path: '/add-worker/:id',
    name: 'AddWorker',
    component: AddWorker
  },
  {
    path: '/project-machines/:id',
    name: 'ProjectMachines',
    component: ProjectMachines
  },
  {
    path: '/add-machine/:id',
    name: 'AddMachine',
    component: AddMachine
  },
  {
    path: '/project-map/:id',
    name: 'ProjectMap',
    component: ProjectMap
  },
  {
    path: '/project-files/:id',
    name: 'ProjectFiles',
    component: ProjectFiles
  },
  {
    path: '/project-tools/:id',
    name: 'ProjectTools',
    component: ProjectTools
  },
  {
    path: '/pits-list/:id',
    name: 'PitsList',
    component: PitsList
  },
  {
    path: '/field-project-managment/',
    name: 'FieldProjectManagment',
    component: FieldProjectManagment
  },
  {
    path: '/machine-managment/:id',
    name: 'MachineManagment',
    component: MachineManagment
  },
  {
    path: '/machine-crew/:id',
    name: 'MachineCrew',
    component: MachineCrew
  },
  {
    path: '/field-map/:id',
    name: 'FieldProjectMap',
    component: FieldProjectMap
  },
]
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to , from , next) => {
  const {isLoggedIn, user } = useAppState();
  if(to.fullPath === '/home')
  {
    if(!isLoggedIn.value){
      next('/login');
      return
    }
    if(user.value.customData.userType === 'driller'){
      next('/field-project-managment/');
      return 
    }
    
  }
  if(to.fullPath === '/login'){
    if(isLoggedIn.value){

      if(user.value.customData.userType === 'driller'){
      next('/field-project-managment/');
      return 
    }
      else if(user.value.customData.userType === 'manager'){
      next('./home');
      return
    }
    }
  }
  if(to.fullPath==='/create-project' || to.fullPath==='/create-project' || to.fullPath==='/projects' || to.fullPath==='/project/:id'
  || to.fullPath==='/employees' || to.fullPath==='/machines' || to.fullPath==='/daily-report/:id' || to.fullPath==='/employee/:id'
  || to.fullPath==='/machine/:id' || to.fullPath==='/create-employee' || to.fullPath==='/create-machine' || to.fullPath==='/project-reports/:id'
  || to.fullPath==='/project-managment/:id' || to.fullPath==='/add-job/:id' || to.fullPath==='/workers-view/:id' || to.fullPath==='/add-worker/:id'
  || to.fullPath==='/project-machines/:id' || to.fullPath==='/add-machine/:id' || to.fullPath==='/project-map/:id' || to.fullPath==='/project-files/:id' 
  || to.fullPath==='/project-tools/:id' || to.fullPath==='/pits-list/:id' || to.fullPath==='/field-project-managment/' || to.fullPath==='/machine-managment/:id'
  || to.fullPath==='/machine-crew/:id' || to.fullPath==='/field-map/:id')
  {
    if(!isLoggedIn.value){
      next('/login');
      return
    }
  }

  next()
 
  
})

export default router
