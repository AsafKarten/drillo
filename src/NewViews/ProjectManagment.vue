<template>
  <ion-page>
    <ion-content  :fullscreen="true" >

      <OfficeAppHeader :str="'ניהול פרוייקט'"/>
      <!-- <DescriptionCard :header="project?.name" :subtitle="project?.address"/> -->
      <ion-grid class="cardGrid">
        <ion-row>
          <ion-col sizeXl="1" sizeLg="2" sizeMd="2" sizeSm="2" size="2">
            <ProjectCard v-if="project" :projectProp="project" :isClick="false"/>
          </ion-col>
          <ion-col sizeXl="1" sizeLg="2" sizeMd="2" sizeSm="2" size="2">
            <GridButtons :buttons="buttons" :options="{buttonHeight:110}"/>
          </ion-col>
        </ion-row>
      </ion-grid>
      
      
      <!-- <FileUpload :withPreview="true" :originID="project_id" :projectID="project_id" @fileUploaded="logFileUploaded"/> -->
      <ion-modal :is-open="isOpenDetails" @willDismiss="setOpenDetails(false)">
        <ion-header>
          <ion-toolbar>
            <ion-title>פרטי פרוייקט</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpenDetails(false)">סגירה</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <p>{{project?.name}}</p>
          <p>{{project?.address}}</p>
          <p>{{"איש קשר:"+" "+project?.contactPerson.name}}</p>
          <p>{{"טלפון"+" "+project?.contactPerson.phone}}</p>
          <p>{{"מייל:"+" "+project?.contactPerson.mail}}</p>
          <ion-button v-if="project?.status == 'Done'"  @click="changeProjectStatus('Active')">פרוייקט פעיל</ion-button>
          <ion-button v-else  @click="changeProjectStatus('Done')">פרוייקט הסתיים</ion-button>
        </ion-content>
      </ion-modal>

      <ion-modal :is-open="isOpen" @willDismiss="setOpen(false)">
        <ion-header>
          <ion-toolbar>
            <ion-title>מחיקת פרוייקט</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="setOpen(false)">ביטול</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <p>
          האם למחוק פרוייקט זה?
          </p>
          <ion-button color="danger" @click="deleteProject()">מחק</ion-button>
        </ion-content>
      </ion-modal>
   

    </ion-content>
  
  </ion-page>
</template>
  
<script lang="ts">
  import {onIonViewDidEnter, IonContent, IonPage, IonModal, IonButton, IonButtons ,IonToolbar, IonHeader, IonCol, IonGrid, IonRow, IonTitle } from '@ionic/vue';
  import { defineComponent, onMounted, reactive, ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppState } from '../realm-state';
  import GridButtons from './Utilities/GridButtons.vue';
  import DescriptionCard from './Utilities/DescriptionCard.vue'
  import OfficeAppHeader from '../Components/OfficeAppHeader.vue'
  import ProjectCard from './Utilities/ProjectCard.vue';
  
  import FileUpload from './Utilities/FileUpload.vue'
  
  import { home ,receiptOutline, constructOutline, peopleOutline, personAddOutline, closeCircleOutline , documentTextOutline, reorderFourOutline} from 'ionicons/icons';

  
  export default defineComponent({
    name: 'ProjectManagment',
    components: {
    IonContent,
    IonPage,
    IonModal,
    IonButton,
    IonButtons,
    IonToolbar,
    IonHeader, 
    IonTitle,
    IonCol, 
    IonGrid, 
    IonRow,
    GridButtons,
    OfficeAppHeader,
    ProjectCard,
   
    //DescriptionCard,

    //FileUpload
},
    setup(){
      const router = useRouter();
      const route = useRoute();
      const {user , getProjectByID,updateProjectStatus, deleteProjectByID, deleteProjectPits, getDrillingMachineByID, updateMachineProjectID,updateEmployeeProject} = useAppState();
      const currentUser = ref<any>(user)
      const project_id = ref<any>(route.params);
      const project = ref<any>();
      const isOpenDetails = ref(false)
      const isOpen = ref(false)


    
      const buttons = reactive(
        [
          {text:"צוות קידוח",      icon: peopleOutline,click: ()=>goTo('/workers-view/'+ project.value._id) },
          //{text:"מכונות קידוח",          icon: home, click: ()=>goTo('/project-machines/'+ project.value._id) },
          {text:" עריכת צוות קידוח", icon: personAddOutline,  click: ()=>goTo('/add-machine-project/'+ project.value._id) },
          {text:"דוחות עבודה",           icon: receiptOutline, click: ()=>goTo('/project-reports/'+ project.value._id) },
          //{text:"מפת אתר קידוח",         icon: home, click: ()=>goTo('/project-map/'+ project.value._id) },
          {text:"בורות קידוח",      icon: constructOutline, click: ()=>goTo('/managment-pits-list/'+ project.value._id) },
          {text:'יצירת דו"ח',      icon: documentTextOutline, click: ()=>goTo('/generate-excel/'+ project.value._id)  },
          {text:"פרטי פרוייקט",      icon: reorderFourOutline, click: ()=>setOpenDetails(true) },
          {text:"מחיקת פרוייקט",      icon: closeCircleOutline, click: ()=>setOpen(true) },
          
          // {text:"הוספת עובד",            icon: home,click: ()=>goTo('/add-worker/'+ project.value._id) },
          //{text:"הוספת עבודה חיצונית",  icon: home, disabled:"true", click: ()=>goTo('/add-job/'+ project.value._id) },
          //{text:"יומן עבודה",            icon: home, disabled:"true", click: ()=>goTo('/work-diary/'+ project.value._id) },
          //{text:"מסמכי אתר",             icon: home, disabled:"true", click: ()=>goTo('/project-files/'+ project.value._id) },
          //{text:"ציוד",                  icon: home, disabled:"true", click: ()=>goTo('/project-tools/'+ project.value._id) },
          //{text:"הזמנת הובלה",          icon: home, disabled:"true", click: ()=>goTo('/machine-transportation/'+ project.value._id)  },
        ]
      );
      //BUTTON TEMPLATE: {index:Number/nothing, text:String, icon:Icon, fill:"solid"/"clear"/"outline", color:String, badge:{count:String/Number, color:String} ,click: ()=>Function },
      //IONIC COLORS: primary, secondary, tertiary, success, warning, danger, light, medium, dark


      onIonViewDidEnter(async()=>{
        if(currentUser?.value.customData.organizationID === undefined)
              router.push('Login')
    
        project.value = await getProjectByID(project_id.value)
        console.log(project.value);
    
      });

      const goTo =(route:any)=>{
        router.push(route)
    }

    const deleteProject =async () => {
      if(project.value.machines !== undefined && project.value.machines !== null ){
        for (let index = 0; index < project.value.machines.length; index++) {
          let id = project.value.machines[index]._id
          let machine = await getDrillingMachineByID(id.toString())
          machine.project_id = ""
          await updateMachineProjectID(machine)
          await updateDrillers(machine)
        }
      }
      await deleteProjectPits(project.value._id)
      await deleteProjectByID(project.value)
      .then(()=>{router.push('/new-home')})
      setOpen(false)
      
    }

    const updateDrillers =async (machine:any)=>{
      if(machine.drillers !== undefined && machine.drillers !== null){
        for (let index = 0; index < machine.drillers.length; index++) {
          let driller = machine.drillers[index]
          driller.project_id = ""
          await updateEmployeeProject(driller)
          
        }
      }
    }
    
    const setOpenDetails = (value: boolean)=>{
      isOpenDetails.value = value
    }

    const setOpen = (value: boolean)=>{
      isOpen.value = value
    }

    const changeProjectStatus = async (status: string) =>{
      project.value.status = status
      await updateProjectStatus(project.value)
    }






      


    const logFileUploaded = (id:any)=>console.log(id)
          
      return {
         //methods
         goTo,
         setOpenDetails,
         setOpen,
         deleteProject,
         updateDrillers,
         changeProjectStatus,
         //properties
         currentUser,
         project,
         project_id,
         isOpenDetails,
         isOpen,

         buttons, 


        logFileUploaded
      }
    }
  });
  </script>
  
  <style scoped>
  .cardGrid {
    --ion-grid-columns: 2;
  }
  </style>