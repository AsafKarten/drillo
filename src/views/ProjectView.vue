<template>
  <ion-page>
    <AppHeader :showButtons="true"/>
    
    <ion-content :fullscreen="true" >
  
    <div class="splitScreen">
      <div class="screenTop">

        <div class="mainContainer">
          <h1> פרוייקט <b>{{project?.name}}</b></h1>
          <p>{{"כתובת:" + project?.address}}</p>
          <p>{{"מספר מזהה:" + project_id.id}}</p>

          <ion-button class="headerButton" @click="goToReports"> דוחות עבודה</ion-button>
          <ion-button class="headerButton" @click="modalManagerAddExJob"> הוספת עבודה חיצונית</ion-button>
          <ion-accordion-group>

            <!-- <ion-accordion value="drillers">

              <ion-item slot="header">
                <ion-label>קודחים</ion-label>
                <ion-badge :key="driller._id" v-for="driller in projectDrillers" style="margin:2px">
                  {{ driller.first }}
                </ion-badge>
              </ion-item>

              <div slot="content">
                <ion-item :key="driller._id" v-for="driller in projectDrillers">
                  {{ driller.first }} {{ driller.last }}
                  <ion-button color="danger" slot="end" @click="removeDriller(driller)">הסרה</ion-button>
                </ion-item>
                <ion-item>
                  <ion-button class="headerButton" @click="modalManagerDriller">
                    הוספת קודח
                  </ion-button>
                </ion-item>
              </div>

            </ion-accordion> -->

            <ion-accordion value="machines">

              <ion-item slot="header">
                <ion-label>מכונות קידוח</ion-label>
                <ion-badge :key="machine._id" v-for="machine in projectMachines" style="margin:2px">
                  {{ machine.name }} {{ machine.driller.first + " " + machine.driller.last   }}
                </ion-badge>
              </ion-item>

              <div slot="content">
                <ion-item :key="machine._id" v-for="machine in projectMachines">
                  {{ machine.driller.first +" "+ machine.driller.last }}| {{ machine.name }} | {{ machine.type }} | {{ machine.model }} 
                  <ion-button color="danger" slot="end" @click="changeDrillerModalManager(machine)">החלפת קודח</ion-button>
                  <ion-button color="danger" slot="end" @click="removeMachine(machine)">הסרה</ion-button>
                </ion-item>
                <ion-item>
                  <ion-button class="headerButton" @click="modalManagerMachine">
                    הוספת מכונת קידוח
                  </ion-button>
                </ion-item>
              </div>

            </ion-accordion>

          
          </ion-accordion-group>

        </div>

       <!-- <div>
          <ion-button class="headerButton" @click="modalManagerMachine">הוספת מכונת קידוח</ion-button>
          <ion-button class="headerButton" @click="modalManagerDriller">הוספת קודח</ion-button>
          <ion-button class="headerButton" @click="modalManagerSiteManager">הוספת מנהל עבודה</ion-button>
        </div> -->
        
      </div>
      <div class="screenBottom">

        <MapBox id="map" 
        :v-show="showMap"
        :pitsToShow="pitsToShow" 
        @pitClick="pitClick"
        />

      </div>
    </div>

      
      <!--Show pit modal-->
        <ion-modal :is-open="isOpen">
      <ion-header>
        <ion-toolbar>
          <ion-title>בור קידוח מספר {{currentPit.p}}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="modalManager">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="hebrewText">
          <h5>{{currentPit?.p}}</h5>
          <h6>נתוני קידוח</h6>
          <p>עומק: <span class="coords">{{currentPit?.diameter}}</span></p>
          <p>קוטר: <span class="coords">{{currentPit?.depth}}</span></p>
          <p>נפח בטון תיאורטי: <span class="coords">{{currentPit?.concreteVolume?.toFixed(3)}}</span></p>
          <h6>קואורדינטות</h6>
          <p>Lon: <span class="coords">{{currentPit?.coordinates.long.toFixed(10)}}</span></p>
          <p>Lat: <span class="coords">{{currentPit?.coordinates.lat.toFixed(10)}}</span></p>
          <h6>רשת ישראל החדשה</h6>
          <p>צפון: <span class="coords">{{currentPit?.itm.y}}</span></p>
          <p>מערב: <span class="coords">{{currentPit?.itm.x}}</span></p>
          <p>סטטוס: {{currentPit?.status}}</p>
          <div :key="note.depth" v-for="note in currentPit?.notes">
            <p>סוג מפגע:{{note?.note}} עומק: {{note?.depth}}</p>
          </div>
        </div>
      </ion-content>
    </ion-modal>
    </ion-content>
<!-- Add driller to project modal-->
  <!--  <ion-modal :is-open="isOpenDriller">
      <ion-header>
        <ion-toolbar>
          <ion-title></ion-title>
          <ion-buttons slot="end">
            <ion-button @click="modalManagerDriller">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="hebrewText">
   <ion-item :key="driller._id" v-for="driller in drillers">
        <p >{{driller.first }}{{driller.last }}</p>
        
        <p >{{driller._id}}</p>
        <ion-button @click="addDriller(driller)">הוסף</ion-button>
        </ion-item>
        </div>
      </ion-content>
    </ion-modal> -->

<!--Add site manager to project modal-->
      <!-- <ion-modal :is-open="isOpenSiteManager">
      <ion-header>
        <ion-toolbar>
          <ion-title></ion-title>
          <ion-buttons slot="end">
            <ion-button @click="modalManagerSiteManager">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="hebrewText">
           <ion-item :key="siteManager._id" v-for="siteManager in siteManagers">
        <p >{{siteManager.first }}{{siteManager.last }}</p>
        
        <p >{{siteManager._id}}</p>
        <ion-button @click="addSiteManager(siteManager)">הוסף</ion-button>
        </ion-item>
        </div>
      </ion-content>
    </ion-modal> -->

    <!--Add machine to project modal-->
     <ion-modal :is-open="isOpenMachine">
      <ion-header>
        <ion-toolbar>
          <ion-title></ion-title>
          <ion-buttons slot="end">
            <ion-button @click="modalManagerMachine">Close</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <div class="hebrewText">
   <ion-item :key="machine._id" v-for="machine in machines">
        <p >{{machine.name + ", " + machine.type + ", " + machine.model  + ", " + machine.driller.first + ", " + machine.driller.last }}</p>       
        <ion-button @click="addMachine(machine)">הוסף</ion-button>
        </ion-item>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>

  <!--Add external job to project modal-->
  <ion-modal :is-open="showAddExJob">
    <ion-header>
      <ion-toolbar>
        <ion-title></ion-title>
        <ion-buttons slot="end">
          <ion-button @click="modalManagerAddExJob">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="hebrewText">
        <ion-item>
          <ion-label position="floating">סוג קבל"ן</ion-label>
          <ion-input
            v-model="contractorType"
            type="text"
          ></ion-input>
      </ion-item>
      <ion-item>
        <ion-label position="floating">שם</ion-label>
        <ion-input
          v-model="contractorName"
          type="text"
        ></ion-input>
    </ion-item>

  <ion-item>
    <ion-label position="floating">סוג השירות</ion-label>
    <ion-input
      v-model="serviceType"
      type="text"
    ></ion-input>
</ion-item>
<ion-item>
  <ion-label position="floating">מחיר</ion-label>
  <ion-input
    v-model="servicePrice"
    type="number"
  ></ion-input>
</ion-item>
<ion-item>
 
</ion-item>
<Datepicker v-model="serviceDate" multiDates></Datepicker>
  

<ion-button @click="saveExJob">שמור</ion-button>
      </div>
    </ion-content>
  </ion-modal>
 <!--change driller in machine modal-->
 <ion-modal :is-open="isOpenDriller">
  <ion-header>
    <ion-toolbar>
      <ion-title>הוספת מכונת קידוח לפרוייקט</ion-title>
      <ion-buttons slot="end">
        <ion-button @click="changeDrillerModalManager(null)">Close</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content class="ion-padding">
    <div class="hebrewText">
      <ion-item :key="employee._id" v-for="employee in employees">
        <p>{{employee._id}}</p>
        <p>{{employee.first}} {{employee.last}}</p>
        <ion-button @click="viewEmployeeModalManager(employee)">פרטי עובד</ion-button>
        <ion-button @click="addEmployee(employee)">בחר</ion-button>
        </ion-item>      
    </div>
    
  </ion-content>
</ion-modal>

   <!--view driller-->
   <ion-modal :is-open="isOpenEmp">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{current_employee?.first}} {{current_employee?.last}}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="viewEmployeeModalManager(null)">Close</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <div class="hebrewText">
        <p>שם: {{current_employee?.first}} {{current_employee?.last}}</p>
      </div>
      
    </ion-content>
  </ion-modal>

</template>

<script lang="ts">
import {  IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonButtons,IonModal,IonTitle,IonInput,IonLabel,IonBadge,IonItem,
    IonAccordion, 
    IonAccordionGroup,
    IonDatetime,
    IonDatetimeButton,
} from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';
import MapBox from'../views/MapBox.vue';

import AppHeader from '../Components/AppHeader.vue'

import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'



export default defineComponent({
  name: 'ProjectView',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonButton,
    IonButtons,
    IonModal,
    IonTitle,
    IonItem,
    MapBox,
    IonAccordion, 
    IonAccordionGroup,
    IonLabel,
    IonBadge,
    IonInput,
    //IonDatetime, 
    //IonDatetimeButton,
    AppHeader,
    Datepicker,
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const {user , logout, getProjectByID,updateProjectExternalServices,updateProjectMachines,getAllDrillingMachines, getAllProjects, updateMachineDriller, updateEmployeeMachine, getAllEmployees, updateProjectDrillers, updateProjectSiteManagers} = useAppState();
    const project_id = ref<any>(route.params);
    const project = ref<any>();
    const {id} = route.params
    const machines = ref<any>()
    const pitsToShow = ref<any>([]);
    const showMap = ref(false);
    const isOpen = ref(false);
    const isOpenSiteManager = ref(false);
    const isOpenDriller = ref(false);
    const isOpenMachine = ref(false);
    const currentPit = ref<any>();
    const employees = ref<any>()
    const employee = ref<any>()
    const siteManagers = ref<any>()
    const drillers = ref<any>()
    const projectDrillers = ref<any>();
    const projectMachines = ref<any>();
    const projectManagers = ref<any>();
    const showAddExJob = ref(false);
    const contractorType = ref("");  
    const contractorName = ref("");  
    const serviceType = ref("");  
    const servicePrice = ref("");  
    const serviceDate = ref();  
    const current_machine = ref<any>()
    const current_employee = ref<any>() 
    const isOpenEmp= ref(false)
  onMounted(async()=>{
//need to fix find project by id and remove the find function here
  machines.value =  await getAllDrillingMachines();
  machines.value = machines.value.filter((machine: { organizationID: any; }) => machine.organizationID === user.value.customData.organizationID)
    const projects = await getAllProjects()
    employees.value = await getAllEmployees()
    project.value = projects?.find(proj =>proj._id.toString() === project_id.value.id)
    projectDrillers.value = project?.value.drillers
    projectMachines.value = project?.value.machines
    projectManagers.value = project?.value.site_managers
    siteManagers.value = employees?.value.filter((emp: { userType: string; organizationID: any; })=> emp.userType === "site manager" && emp.organizationID === user.value.customData.organizationID)
    drillers.value = employees?.value.filter((emp: { userType: string; organizationID: any; })=> emp.userType === "driller" && emp.organizationID === user.value.customData.organizationID)
    projectMachines.value = project?.value.machines
    pitsToShow.value = project.value.pits 
    showMap.value = true;
    console.log(employees.value);
    console.log(siteManagers.value);
   console.log(drillers.value);
  });
 //unify add driller and add site manager to one smart modal and one smart fuction
  const addDriller =async (driller:any)=>{
    if(projectDrillers.value === undefined)
       projectDrillers.value=[]

    let tempDriller = projectDrillers?.value.find((d: { _id: any; }) =>d._id.toString() === driller._id.toString())
    console.log(tempDriller);
    if(tempDriller !== undefined){
      console.log("הקודח כבר משוייך לפרוייקט זה")
      return;
    }
    else{
      console.log(driller);
      if(project.value.drillers === undefined)
          project.value.drillers = [];

      project.value.drillers.push(driller)
      console.log(project.value);
      await updateProjectDrillers(project.value)
    }    
  }
  const removeDriller =async (driller:any)=>{
    let tempDriller = projectDrillers?.value.find((d: { _id: any; }) =>d._id.toString() === driller._id.toString())
    console.log(tempDriller);
    if(tempDriller !== undefined){
      project.value.drillers.splice( project.value.drillers.indexOf(driller) )
      await updateProjectDrillers(project.value)
    }
    else{
      console.log("הקודח לא משוייך לפרוייקט זה")
      return;
    }    
  }

  const addSiteManager =async (siteManager:any)=>{
    if(projectManagers.value === undefined)
        projectManagers.value=[]

    let tempManager = projectManagers.value.find((m: { _id: any; }) =>m._id.toString() === siteManager._id.toString())
    console.log(tempManager);
    
    if(tempManager !== undefined){
      console.log("המנהל כבר משוייך לפרוייקט זה")
      return;
    }
    else{
      console.log(siteManager);
    if(project.value.site_managers === undefined)
          project.value.site_managers = [];
     project.value.site_managers.push(siteManager)
     console.log(project.value);
     await updateProjectSiteManagers(project.value)
  }
    }

  const removeSiteManager =async (siteManager:any)=>{
    let tempManager = projectManagers.value.find((m: { _id: any; }) =>m._id.toString() === siteManager._id.toString())
    console.log(tempManager);
    
    if(tempManager !== undefined){
      project.value.site_managers.splice( project.value.site_managers.indexOf(siteManager) )
      console.log(project.value);
      await updateProjectSiteManagers(project.value)
    }
    else{
      console.log(siteManager);
      console.log("המנהל לא משוייך לפרוייקט זה")
      return;
  }
    }
    

const addMachine =async (machine:any)=>{
  if(projectMachines.value === undefined)
      projectMachines.value=[]

    let tempMachine = projectMachines?.value.find((m: { _id: any; }) =>m._id.toString() === machine._id.toString())
    console.log(tempMachine);
    if(tempMachine !== undefined){
      console.log(tempMachine);
      console.log("המכונה כבר משוייכת לפרוייקט זה")
      return;
    }
    else{
      console.log(machine);
      if(project.value.machines === undefined)
          project.value.machines = [];

      project.value.machines.push(machine)
      console.log(project.value);
      await updateProjectMachines(project.value)
    }    
  }

  const removeMachine =async (machine:any)=>{
    let tempMachine = projectMachines?.value.find((m: { _id: any; }) => m._id.toString() === machine._id.toString())
    console.log(tempMachine);
    if(tempMachine !== undefined){
      project.value.machines.splice( project.value.machines.indexOf(machine) )
      await updateProjectMachines(project.value)
    }
    else{
      console.log(tempMachine);
      console.log("המכונה לא נמצאה בפרוייקט זה")
    }    
  }

    

       const pitClick = (clickData: { _id: any; }) => {
        const pitClicked = pitsToShow.value.find((pit: { p: { toString: () => any; }; }) => pit.p.toString() === clickData._id);
        currentPit.value = pitClicked
        modalManager();
        if (pitClicked == undefined) return;
        
    }
          //modal block
      const modalManager = ()=>{
        if(isOpen.value)
          isOpen.value=false;
        else
          isOpen.value = true;
      }
         const modalManagerDriller = ()=>{
        if(isOpenDriller.value)
          isOpenDriller.value=false;
        else
          isOpenDriller.value = true;
      }
         const modalManagerMachine = ()=>{
        if(isOpenMachine.value)
          isOpenMachine.value=false;
        else
          isOpenMachine.value = true;
      }
         const modalManagerSiteManager = ()=>{
        if(isOpenSiteManager.value)
          isOpenSiteManager.value=false;
        else
          isOpenSiteManager.value = true;
      }

      const modalManagerAddExJob = ()=>{
        if(showAddExJob.value)
        showAddExJob.value=false;
        else
        showAddExJob.value = true;
      }

      const goToReports = ()=>{
        router.push('/project-reports/'+ project.value._id)
    }

    const saveExJob =async ()=>{
      if(project.value.external_services === undefined)
          project.value.external_services = []

      if(serviceDate.value instanceof Date){
        project.value.external_services.push({
          contractorType:contractorType.value,
          contractorName:contractorName.value, 
          serviceType:serviceType.value, 
          servicePrice:servicePrice.value, 
          serviceDate:serviceDate.value
        })
        
      }
      else if(serviceDate.value instanceof Array){
        for (let i = 0; i < serviceDate.value.length; i++) {
          const dateElement = serviceDate.value[i];
          project.value.external_services.push({
          contractorType:contractorType.value,
          contractorName:contractorName.value, 
          serviceType:serviceType.value, 
          servicePrice:servicePrice.value, 
          serviceDate:dateElement
        })
        }
      }

      await updateProjectExternalServices(project.value)
      console.log(project.value);
      contractorType.value= ""
      contractorName.value= "" 
      serviceType.value=""
      servicePrice.value=""
      serviceDate.value= null
      modalManagerAddExJob()

    }

    const changeDrillerModalManager = (machine: any)=>{
        if(isOpenDriller.value)
        isOpenDriller.value=false;
        else{
          current_machine.value = machine
          isOpenDriller.value = true;
          if(machine?.value.driller !== undefined){
              current_employee.value = employees?.value.filter((emp: { _id: any; }) => emp._id.toString() === machine?.value.driller.driller_id.toString())
              current_employee.value = current_employee.value[0]
              console.log(current_employee.value);
            }
        }
        
      }

      const viewEmployeeModalManager = (employee: any)=>{
        if(isOpenEmp.value)
        isOpenEmp.value=false;
        else{
          current_employee.value = employee
          isOpenEmp.value = true;
         
        }
        
      }

      const addMachine2 = (machine: any)=>{
        if(projectMachines.value === undefined)
            projectMachines.value = []

        projectMachines.value.push(machine)
      }

      const addEmployee = async (employee: any)=>{
    current_machine.value.driller = {driller_id : employee._id, first: employee.first, last: employee.last}
    console.log(current_machine.value);
    employee.machine_id = current_machine.value._id
      
    if(current_employee.value !== undefined){
         current_employee.value.machine_id = ""
         await updateEmployeeMachine(current_employee.value)
        }

    await updateMachineDriller(current_machine.value)
    await updateEmployeeMachine(employee)
    current_employee.value = employee
  }
      
     return {
      //methods
        pitClick,
        modalManager,
        addDriller,
        removeDriller,
        addSiteManager,
        removeSiteManager,
        addMachine,
        removeMachine,
        modalManagerDriller,
        modalManagerMachine,
        modalManagerSiteManager,
        modalManagerAddExJob,
        goToReports,
        saveExJob,
        changeDrillerModalManager,
        viewEmployeeModalManager,
        addEmployee,
        //properties
        currentUser : user,
        project:project,
        project_id:project_id,
        id:id,
        pitsToShow:pitsToShow,
        showMap:showMap,
        isOpen:isOpen,
        isOpenDriller:isOpenDriller,
        isOpenMachine:isOpenMachine,
        isOpenSiteManager:isOpenSiteManager,
        currentPit:currentPit,
        employees:employees,
        employee:employee,
        siteManagers:siteManagers,
        drillers:drillers,
        projectDrillers:projectDrillers,
        projectManagers:projectManagers,
        projectMachines:projectMachines,
        machines:machines,
        showAddExJob:showAddExJob, 
        contractorType:contractorType,
        contractorName:contractorName, 
        serviceType:serviceType, 
        servicePrice:servicePrice, 
        serviceDate:serviceDate,
        current_machine:current_machine,
        current_employee:current_employee,
        isOpenEmp:isOpenEmp,
  }
  },
 
});
</script>

<style scoped>
.hebrewText{
  direction: rtl;
  line-height: 80%;
  overflow: scroll;
  margin-bottom: 10%;
}
.mainContainer{
  display: block;
  direction: rtl;
}

.splitScreen {
  width: 100%;
  height: 100%;
}
.screenTop, .screenBottom {
  width: 100%;
  height: 50%;
}
.screenTop {
  overflow-y: scroll;
}
.screenBottom {
  display: flex;
}

h5,h6{
  font-weight: bold;
}

.coords {
  font-family: monospace;
  font-size: 150%;
  letter-spacing: 1px;
}
</style>