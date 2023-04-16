<template>

    <div v-if="loaded">
     <div class="homeContainer">
        <!-- <h1>העובדים שלי</h1> -->
        <ion-item>
            <ion-avatar slot="start">
              <img alt="Silhouette of a person's head" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
            </ion-avatar>
          <p v-show="showType" > {{employee?.userType ===  'driller' ? ' קודח' : ' מנהל משרד' }} {{" "+ ','}}</p>
          <p > {{" " + employee.first}} {{employee.last + " " }}</p>
          <p v-show="project" style="font-weight: bold;"> {{" "+ ','}} {{project === undefined ? " " : project?.name}}</p>
          <p v-show="machine" style="font-weight: bold;"> {{" "+ ','}} {{machine === undefined ? " " : machine?.name}}</p>
          <ion-button class="btnClass" v-show="empProfile" size="default" slot="end" @click="goToEmployee(employee)">פרופיל עובד</ion-button>
          <ion-button class="btnClass" v-show="empSelect" size="default" slot="end" @click="$emit('addEmployee')">הוספה</ion-button>
          <ion-button class="btnClass" v-show="empModal" size="default" slot="end" @click="$emit('openModal')">פרטי עובד</ion-button>
          <ion-button v-show="empRemove" color="danger" size="default" slot="end" @click="$emit('removeEmployee')">הסר</ion-button>
          </ion-item>     
        
      </div>
    </div>
    <ion-item v-if="!loaded">
        <ion-thumbnail style="width: 50px ; height: 50px" slot="start">
            <ion-skeleton-text :animated="true"></ion-skeleton-text>
          </ion-thumbnail>
        <ion-skeleton-text :animated="true" style="width: 100%"></ion-skeleton-text>
    </ion-item>
   
  </template>
  
  <script lang="ts">
  import {onIonViewWillEnter, IonContent, IonPage, IonThumbnail, IonSkeletonText, IonButton, IonItem, IonCol, IonGrid, IonRow, IonFab, IonFabButton, IonAvatar , IonIcon } from '@ionic/vue';
  import {add} from 'ionicons/icons';
  import { defineComponent, onMounted, ref, render } from 'vue';
  import { useRouter } from 'vue-router';
  import {useAppState} from '../realm-state';
  
  import AppHeader from '../Components/OfficeAppHeader.vue'
import { log } from 'console';
  
  
  
  
  export default defineComponent({
    name: 'EmployeesView',
    components: {
      //IonContent,
      //IonPage,
      IonButton,
      IonItem,
      IonAvatar, 
      IonThumbnail, 
      IonSkeletonText,
      //IonIcon,
      //AppHeader
  },
  props:{employeeObj:Object , selectBtn:Boolean, profileBtn:Boolean, modalBtn:Boolean, removeBtn:Boolean, empType:Boolean},
  emits:['addEmployee', 'openModal', 'removeEmployee'],
    setup(props){
      const router = useRouter();
      
      const {user ,getProjectByID, getDrillingMachineByID} = useAppState();
      const currentUser = ref<any>(user)
      const employee = ref<any>(props.employeeObj)
      const project = ref<any>()
      const machine = ref<any>()
      const empSelect = ref(props.selectBtn)
      const empProfile = ref(props.profileBtn)
      const empModal = ref(props.modalBtn)
      const empRemove = ref(props.removeBtn)
      const showType = ref(props.empType)
      const loaded = ref(false)
      
      onMounted(async() => {
       
        if(employee.value.project_id !== undefined && employee.value.project_id !== "" && employee.value.userType === 'driller'  ){
            project.value = await getProjectByID(employee.value.project_id.toString())
            console.log(project.value);  
             
        }
        if(employee.value.machine_id !== undefined && employee.value.machine_id !== "" && employee.value.userType === 'driller'  ){
            machine.value = await getDrillingMachineByID(employee.value.machine_id.toString())
            console.log(machine.value);  
             
        }
        loaded.value = true
     
      
    
      
    });
  
      
        const goToEmployee =(employee:any)=>{
          router.push('/employee/'+ employee._id)
      }
       return {
        //methods
          goToEmployee,
          //properties
          currentUser,
          employee,
          project,
          machine,
          empSelect,
          empProfile,
          empModal,
          empRemove,
          showType,
          loaded,
  
          //icons
          add
          
    }
    },
   
  });
  </script>
  
  <style scoped>
  .mainContainer{
    display: block;
    direction: rtl;
    
  }
  
  .homeContainer{
    display: block;
    
    padding-top: 2%;
    padding-bottom: 2%;
    height: 100%;
    text-align: center;
  }
  
  .btnClass {
    --background: #4DBA87;
    --background-hover: #9ce0be;
    --background-activated: #88f4be;
    --background-focused: #88f4be;
    
  
    --color: #fff;
  
    --border-radius: 10px;
    --border-color: #4DBA87;
    --border-style: solid;
    --border-width: 2px;
  
    --box-shadow: 0 2px 6px 0 rgb(0, 0, 0, 0.25);
  
    --ripple-color: deeppink;
  
    --padding-top: 10px;
    --padding-bottom: 10px;
  
  }
  .addButton{
    text-align: center;
    
  }
  ion-skeleton-text {
    --border-radius: 9999px;
   
  }
  
  </style>
  