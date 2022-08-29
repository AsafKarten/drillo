<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <div v-if="currentUser" class="header">
      <p class="headerText">{{currentUser.customData.first}} {{currentUser.customData.last}}</p>
       <p class="headerText">{{currentUser?.profile.email}} </p>
      <ion-button class="headerButton" @click="userLogout">יציאה</ion-button>
    </div>
      </ion-toolbar>
    </ion-header>
    
    <ion-content :fullscreen="true" >
  
   
      
      <div class="mainContainer">
        <h1> פרוייקט {{ project?.name}}</h1>
        <p>{{"שם הפרוייקט:" + project?.name}}</p>
        <p>{{ "כתובת:" + project?.address}}</p>
        <p>{{"מספר מזהה:" + project_id.id}}</p>
        <div>
          <p>קודחים:</p>
          <ion-item :key="driller._id" v-for="driller in projectDrillers">
        <p >{{driller.first }}{{driller.last }}</p>
        </ion-item>
        </div>

          <div>
          <p>מכונות קידוח:</p>
          <ion-item :key="machine._id" v-for="machine in projectMachines">
        <p >{{machine.name }} {{machine.type }} {{machine.model}}</p>
        </ion-item>
        </div>

         <div>
          <p>מנהלי פרוייקט:</p>
          <ion-item :key="manager._id" v-for="manager in projectManagers">
        <p >{{manager.first }}{{manager.last }}</p>
        </ion-item>
        </div>
        
      </div>
      <div>
        <ion-button class="headerButton" @click="modalManagerMachine">הוספת מכונת קידוח</ion-button>
        <ion-button class="headerButton" @click="modalManagerDriller">הוספת קודח</ion-button>
        <ion-button class="headerButton" @click="modalManagerSiteManager">הוספת מנהל עבודה</ion-button>
      </div>
        <MapBox id="map" 
        :v-show="showMap"
      :pitsToShow="pitsToShow" 
      @pitClick="pitClick"
       />
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
        <h5>{{ currentPit.p}}</h5>
        <h6>קואורדינטות</h6>
        <p>{{"Lon: "+currentPit.coordinates.long+ " "}}{{"Lat: "+currentPit.coordinates.lat}}</p>
         <h6>רשת ישראל החדשה</h6>
        <p>{{"צפון: "+currentPit.itm.y+ " "}}{{"מערב: "+currentPit.itm.x}}</p>
           <p>{{currentPit.status}}</p>
        <p>{{currentPit.garbage? "זבל בקידוח" :  " " }}</p>
        </div>
      </ion-content>
    </ion-modal>
    </ion-content>
<!--Add driller to project modal-->
     <ion-modal :is-open="isOpenDriller">
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
    </ion-modal>

<!--Add site manager to project modal-->
      <ion-modal :is-open="isOpenSiteManager">
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
    </ion-modal>

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
        <p >{{machine.name }}{{machine.type }}</p>
        
        <p >{{machine.model}}</p>
        <ion-button @click="addMachine(machine)">הוסף</ion-button>
        </ion-item>
        </div>
      </ion-content>
    </ion-modal>
  </ion-page>
</template>

<script lang="ts">
import {  IonContent, IonHeader, IonPage, IonToolbar,IonButton,IonButtons,IonModal,IonTitle,IonInput,IonLabel,IonItem, } from '@ionic/vue';
import { defineComponent, onMounted, ref, render } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import {useAppState} from '../realm-state';
import MapBox from'../views/MapBox.vue';





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
   
},
  setup(){
    const router = useRouter();
    const route = useRoute();
    const currentUser = ref<any>()
    const {user , logout, getProjectByID,updateProjectMachines,getAllDrillingMachines, getAllProjects,getAllEmployees, updateProjectDrillers, updateProjectSiteManagers} = useAppState();
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

    
    const userLogout = async ()=>{
      await logout();
      currentUser.value = null;
      router.replace("/login");
      
      
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
     return {
        userLogout,
        pitClick,
        modalManager,
        addDriller,
        addSiteManager,
        addMachine,
        modalManagerDriller,
        modalManagerMachine,
        modalManagerSiteManager,
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

  }
  },
 
});
</script>

<style scoped>
.hebrewText{
  direction: rtl;
}
.mainContainer{
  display: block;
  direction: rtl;
  
}
.header{
  display: flex;
  flex-direction: row;
  width: 100%;
  align-content: space-between;
  font-size: 20px;
 
}
.headerText {
  padding-left: 2%;
}
.headerButton{
  padding-left: 2%;
}

</style>